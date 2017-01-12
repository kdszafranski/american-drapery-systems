app.controller('MeasurementController', ["$http", function($http) {
  var self = this;
  self.measurement = {};
  self.measurements =[];


  self.addButton = function(){
    console.log("mesurement: ", self.measurement);
    self.measurements.push(self.measurement)
    console.log("mesurement array", self.measurements);
  }

  // function getMeasurements(){
  //   currentUser = UserFactory.getUser();
  //   console.log("current user: ", currentUser);
  //   currentUser.user.getToken().then(function(idToken) {
  //     $http({
  //       method: 'GET',
  //       url: '/clients',
  //       headers: {
  //         id_token: idToken
  //       }
  //     }).then(function(response){
  //       console.log('success. Response', response.data);
  //       self.clients = response.data
  //     });
  //   });
  // }

}]);
