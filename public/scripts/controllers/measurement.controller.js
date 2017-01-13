app.controller('MeasurementController', ["$http", "IdFactory", "UserFactory",  function($http, IdFactory, UserFactory) {
  const self = this;
  // self.areaId = IdFactory.id.area;
  self.areaId = 1;
  self.getMeasurements = function() {
    var currentUser = UserFactory.getUser();
    currentUser.user.getToken()
      .then(function(idToken) {
        $http({
          method: 'GET',
          url: '/measurements/' + self.areaId,
          headers: {
            id_token: idToken
          }
        }).then(function(response) {
          console.log("response in measurement controller: ", response);
          self.measurements = response.data;
          console.log(self.measurements);
        }).catch(function(err) {
          console.log("Error in measurment controller get req: ", err);
        });
      })
  }

  self.getMeasurements();

}]);
