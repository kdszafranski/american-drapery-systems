app.controller('MeasurementController', ["$http", function($http) {
  var self = this;
  self.measurement = {};
  self.measurements =[];
  self.measurement.edit = true;

  self.addButton = function(){
    console.log("mesurement: ", self.measurement);
    self.measurements.push(angular.copy(self.measurement))
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
