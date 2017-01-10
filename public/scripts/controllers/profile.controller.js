app.controller('ProfileController', ["$http", "UserFactory", function($http, UserFactory) {
  var self = this;
  self.currentProfile = {};
  self.checkbox = true;


  self.submitButton = function(){
    if (self.checkbox == true) {
      self.currentProfile.billing_address_street = self.currentProfile.survey_address_street
      self.currentProfile.billing_address_city = self.currentProfile.survey_address_city
      self.currentProfile.billing_address_state = self.currentProfile.survey_address_state
      self.currentProfile.billing_address_zip = self.currentProfile.survey_address_zip
    }
    console.log("submit button clicked. Object:", self.currentProfile);
    postClients();
  }
  self.copyAddress = function(){
    console.log("checkbox");

  }
  function getClients() {
    currentUser = UserFactory.getUser();
    console.log('getting surveys', currentUser.credential.idToken);
    $http({
      method: 'GET',
      url: '/clients',
      headers: {
        id_token: currentUser.credential.idToken
      }
    }).then(function(response){
      console.log('success');
      formatData(response.data);
    });
  }

  function getSurveys(){
    currentUser = UserFactory.getUser();
    console.log('getting surveys - currentUser:', currentUser);
    currentUser.user.getToken().then(function(idToken) {
      $http({
        method: 'GET',
        url: '/surveys/all/',
        headers: {
          id_token: currentUser.credential.idToken
        }
      }).then(function(response){
        console.log('success');
        formatData(response.data);
      });
    });
  }

  function postClients() {
    currentUser = UserFactory.getUser();
    console.log("current user: ", currentUser);
    console.log('getting surveys', currentUser.credential.idToken);

    currentUser.user.getToken().then(function(idToken) {
      $http({
        method: 'POST',
        url: '/clients',
        data: self.currentProfile,
        headers: {
          id_token: currentUser.credential.idToken
        }
      }).then(function(response){
        console.log('success');
      });
    });
  }


}]);
