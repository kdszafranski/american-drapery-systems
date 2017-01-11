app.controller('ProfileController', ["$http", "UserFactory", function($http, UserFactory) {
  var self = this;
  self.currentProfile = {};
  self.checkbox = true;
  self.clients = [];
  self.selected = {};
  self.showCompany = false;
  self.showUpdateButton = true;
  self.showSubmitButton = false;

  //Submit button function
  self.submitButton = function(){
    if (self.checkbox == true) {
      self.currentProfile.billing_address_street = self.currentProfile.survey_address_street
      self.currentProfile.billing_address_city = self.currentProfile.survey_address_city
      self.currentProfile.billing_address_state = self.currentProfile.survey_address_state
      self.currentProfile.billing_address_zip = self.currentProfile.survey_address_zip
    }
    console.log("submit button clicked. Object:", self.currentProfile);
    //postClients();
  }

  //Update existing client information Button
  self.updateButton = function(){
    if (self.checkbox == true) {
      self.currentProfile.billing_address_street = self.currentProfile.survey_address_street
      self.currentProfile.billing_address_city = self.currentProfile.survey_address_city
      self.currentProfile.billing_address_state = self.currentProfile.survey_address_state
      self.currentProfile.billing_address_zip = self.currentProfile.survey_address_zip
    }
    console.log("self.selected", self.selected);
    updateClient();
  }

  //GET client_name and id for Dropdown
  function getClients() {
    currentUser = UserFactory.getUser();
    console.log("current user: ", currentUser);
    currentUser.user.getToken().then(function(idToken) {
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

  getClients();

  //GET client information from client selected from dropdown
  function getClient() {
    currentUser = UserFactory.getUser();
    console.log("current user: ", currentUser);
    currentUser.user.getToken().then(function(idToken) {
      $http({
        method: 'GET',
        url: '/clients/' + self.selected.id,
        headers: {
          id_token: idToken
        }
      }).then(function(response){
        console.log('success. Response', response.data);
        self.currentProfile = response.data[0]
        if (self.currentProfile.client_name == self.selected.client_name) {
          self.showCompany = true;
        } else {
          self.showCompany = false;
        }
      });
    });
  }

  //POST client information to database
  function postClients() {
    currentUser = UserFactory.getUser();
    console.log("current user: ", currentUser);
    currentUser.user.getToken().then(function(idToken) {
      $http({
        method: 'POST',
        url: '/clients',
        data: self.currentProfile,
        headers: {
          id_token: idToken
        }
      }).then(function(response){
        console.log('success');
      });
    });
  }

  //Update client information in database
  function updateClient() {
    currentUser = UserFactory.getUser();
    console.log("current user: ", currentUser);
    currentUser.user.getToken().then(function(idToken) {
      $http({
        method: 'POST',
        url: '/clients/' + self.selected.id,
        data: self.currentProfile,
        headers: {
          id_token: idToken
        }
      }).then(function(response){
        console.log('success');
      });
    });
  }

  //course of action from drop down selection
  self.dropdownOption = function(){
    console.log("selected", self.selected);
    if (self.selected === "None") {
      self.currentProfile = {}
      self.showCompany = false;
      self.showUpdateButton = true;
      self.showSubmitButton = false;
    } else {
      self.showUpdateButton = false;
      self.showSubmitButton = true;
      getClient();
    }
  }


}]);
