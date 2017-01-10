app.controller('ProfileController', ["$http", function($http) {
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
    $http.post('/clients', self.currentProfile)
      .then(function(response){
        console.log("POST finished");
      });
  }
  self.copyAddress = function(){
    console.log("checkbox");

  }
  function getClients() {
    $http.get('/clients')
    .then(function(response) {
      console.log("Clients", response);
    },
    function(response) {
      console.log('get error:', response);
    });
  }



}]);
