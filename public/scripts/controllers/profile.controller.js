app.controller('ProfileController', ["$http", "UserFactory", "IdFactory", "$location", "$mdDialog",  function($http, UserFactory, IdFactory, $location, $mdDialog) {
  var self = this;
  self.checkbox = true;
  self.clients = [];
  self.survey = {};
  self.showCompany = false;
  self.showUpdateButton = true;
  self.showSubmitButton = false;

  UserFactory.auth.$onAuthStateChanged(function(firebaseUser) {
    if(firebaseUser) {
      currentUser = firebaseUser;
      getClients();
    } else {
      console.log("There is no firebase user");
    }
  })
  //Submit button function
  self.submitButton = function(id){
    copyAddress(id);
    console.log("submit button clicked. Object:", self.clients[id]);
    postClients(id);
  }

  //Update existing client information Button
  self.updateButton = function(id){
    copyAddress(id);
    console.log("update button clicked. Object:", self.clients[id]);

    updateClient(id);
  }


  //GET client_name and id for Dropdown
  function getClients() {
    // currentUser = UserFactory.getUser();
    console.log("current user: ", currentUser);
    currentUser.getToken().then(function(idToken) {
      $http({
        method: 'GET',
        url: '/clients',
        headers: {
          id_token: idToken
        }
      }).then(function(response){
        console.log('success. Response', response.data);
        self.clients = response.data
      });
    });
  }

  //POST client information to database
  function postClients(clientId) {
    // currentUser = UserFactory.getUser();
    console.log("current user: ", currentUser);
    currentUser.getToken().then(function(idToken) {
      $http({
        method: 'POST',
        url: '/clients',
        data: self.clients[clientId],
        headers: {
          id_token: idToken
        }
      }).then(function(response){
        console.log('success in adding new client');
        var clientId = response.data[0].id;
        console.log(response.data[0].id);
        addNewSurvey(self.survey);
      },
      function(err) {
        console.log("error updating clientdetails: ", err);
        if (err.status === 403) {
          notAuthorizedAlert();
          console.log("In error 403");
        }
      });
    });
  }

  //Update client information in database
  function updateClient(clientId) {
    // currentUser = UserFactory.getUser();
    console.log("current user: ", currentUser);
    console.log('client id', clientId);
    currentUser.getToken().then(function(idToken) {
      $http({
        method: 'POST',
        url: '/clients/' + clientId,
        data: self.clients[clientId],
        headers: {
          id_token: idToken
        }
      }).then(function(response){
        console.log('success');
        addNewSurvey(self.survey);
      },
      function(err) {
        console.log("error updating clientdetails: ", err);
        if (err.status === 403) {
          notAuthorizedAlert();
          console.log("In error 403");
        }
      });
    });
  }

  //course of action from drop down selection
  self.dropdownOption = function(id){
    self.survey.status = 'Pending';
    console.log("selected", id);
    if (id === "None") {
      self.clients = {};
      self.showCompany = false;
      self.showUpdateButton = true;
      self.showSubmitButton = false;
      console.log("This if statement works");
    } else {
      self.survey.client_id = id;
      self.showUpdateButton = false;
      self.showSubmitButton = true;
      self.showCompany = true;
    }
  }


  function addNewSurvey(survey) {
    console.log("Running addNewSurvey");
    currentUser.getToken().then(function(idToken) {
      $http({
        method: 'POST',
        url: '/surveys',
        data: self.survey,
        headers: {
          id_token: idToken
        }
      }).then(function(response){
        $location.path('/area/' + response.data[0].id);
        console.log('success in adding new survey');
      },
      function(err) {
        console.log("error creading survey: ", err);
        if (err.status === 403) {
          notAuthorizedAlert();
          console.log("In error 403");
        }
      });
    });
  }

  function copyAddress(id) {
    console.log('id', id);
    if (self.checkbox) {
      self.survey.address_street = self.clients[id].billing_address_street;
      self.survey.address_city = self.clients[id].billing_address_city;
      self.survey.address_state = self.clients[id].billing_address_state;
      self.survey.address_zip = self.clients[id].billing_address_zip;
    }
  }

  function notAuthorizedAlert() {
      alert = $mdDialog.alert({
        title: 'Attention',
        textContent: 'You are not authorized to perform this action',
        ok: 'Close'
      });
      $mdDialog
        .show( alert )
        .finally(function() {
          alert = undefined;
        });
    }
}]);
