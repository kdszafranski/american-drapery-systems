app.controller('MeasurementController', ["$http", "IdFactory", function($http, IdFactory) {
  const self = this;
  self.areaId = IdFactory.id.area;
  self.getMeasurements = function() {
    $http({
      method: 'GET',
      url: '/measurements/' + self.areaId,
      // headers: id_token
    }).then(function(response) {
      console.log("response in measurement controller: ", response);
    }).catch(function(err) {
      console.log("Error in measurment controller get req: ", err);
    })

  }

}]);
