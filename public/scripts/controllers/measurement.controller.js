app.controller('MeasurementController', ["$http", function($http) {
  var self = this;
  self.measurement = {};


  self.addButton = function(){
    console.log("mesurement: ", self.measurement);
  }


}]);
