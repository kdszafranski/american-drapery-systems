app.controller('MeasurementController', ["$http", "IdFactory", "UserFactory",  function($http, IdFactory, UserFactory) {
  var self = this;
  self.measurement = {};
  self.measurements =[];
  self.measurement.edit = true;
  self.areaId = IdFactory.getAreaId();

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
          for (var i = 0; i < self.measurements.length; i++) {
            self.measurements[i].edit = true;
          }
          console.log(self.measurements);
        }).catch(function(err) {
          console.log("Error in measurment controller get req: ", err);
        });
      })
  }

  self.getMeasurements();

  self.addButton = function(){
    console.log("mesurement: ", self.measurement);
    self.measurements.push(angular.copy(self.measurement));
    console.log("mesurement array", self.measurements);
  }
  //Trashcan icon to clear current input row
  self.activeRowClear = function(){
    console.log("current trashcn clicked");
    self.measurement = {};
  }
  //Edit row pencil icon
  self.editRowButton = function(index){
    console.log("pencil clicked", index);
    self.measurements[index].edit = !self.measurements[index].edit;
    console.log("measurements", self.measurements);
  }
  self.updateRowButton = function(index){
    console.log("check clicked", index);
    self.measurements[index].edit = !self.measurements[index].edit;
    console.log("measurements", self.measurements);
  }
  self.deleteRowButton = function(index){
    console.log("remove row number: ", index);
    self.measurements.splice(index, 1)
  }

}]);
