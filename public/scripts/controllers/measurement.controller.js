app.controller('MeasurementController', ["$http", "IdFactory", "UserFactory", "$mdDialog", 'InfoFactory',  function($http, IdFactory, UserFactory, $mdDialog, InfoFactory) {
  var self = this;
  var survey_id = IdFactory.getSurveyId();
  self.measurement = {};
  self.measurements =[];
  self.measurement.edit = true;
  self.areaId = IdFactory.getAreaId();
  self.loading = false;
  self.showInput = true
  self.companyInfo = formatDates([InfoFactory.companyInfo])[0];
  self.currentProfile = {};



  self.getMeasurements = function() {
    var currentUser = UserFactory.getUser();
    currentUser.getToken()
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
          self.loading = true;
          console.log(self.measurements);
          console.log("InfoFactory", self.companyInfo);
        }).catch(function(err) {
          console.log("Error in measurment controller get req: ", err);
        });
      })
  }

  self.getMeasurements();

  function getSurveyDetails() {
    var currentUser = UserFactory.getUser();
    currentUser.getToken()
      .then(function(idToken) {
        $http({
          method: 'GET',
          url: '/surveys/one/' + survey_id,
          headers: {
            id_token: idToken
          }
        })
        .then(function(response){
          self.surveyDetails = response.data;
          console.log("Response From Server: ", self.surveyDetails);
          self.companyInfo = self.surveyDetails[0];
          self.areaArray = self.surveyDetails.map(survey => survey.area_name);
          console.log("Area Array: ", self.areaArray);
          self.areaArrayId = self.surveyDetails.map(survey => survey.id);
          console.log("Area ID: ", self.areaArrayId);
          self.currentProfile = self.companyInfo;
          InfoFactory.companyInfo = self.companyInfo;
          self.loading = true;
        },
        function(err) {
          console.log("error getting survey details: ", err);
        });
    })

  }

  getSurveyDetails();

  self.addButton = function(){
    console.log("mesurement: ", self.measurement);
    console.log("survey ID: ", self.areaId);
    var currentUser = UserFactory.getUser();
    currentUser.getToken()
    .then(function(idToken) {
        $http({
          method: 'PUT',
          url: '/measurements/' + self.areaId,
          data: self.measurement,
          headers: {
            id_token: idToken
          }
        }).then(function(response) {
          console.log("Response from measurement route: ", response);
        }).catch(function(err) {
          console.log("Error in measurement post");
        });
      })
    self.measurements.push(angular.copy(self.measurement));
    console.log("mesurement array", self.measurements);
    self.getMeasurements();
  }

  //Edit client profile button
  self.editClient = function(){
    console.log("clicked");
    self.showInput = !self.showInput;
  }

  //save edits to client profile button
  self.updateClient = function(){
    var clientId = self.currentProfile.client_id;
    var currentUser = UserFactory.getUser();
    currentUser.getToken()
    .then(function(idToken) {
      $http({
        method: 'POST',
        url: '/clients/'+ clientId,
        data: self.currentProfile,
        headers: {
          id_token: idToken
        }
      }).then(function(response){
        console.log("Response from new area post: ", response.data);
        self.showInput = !self.showInput;
      },
      function(err) {
        console.log("error getting survey details: ", err);
      });
    });
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

  //button clicked to update the edited row
  self.updateRowButton = function(index){
    console.log("check clicked", index);
    self.measurements[index].edit = !self.measurements[index].edit;
    console.log("measurements", self.measurements[index]);
    var currentUser = UserFactory.getUser();
    currentUser.getToken()
    .then(function(idToken) {
        $http({
          method: 'PUT',
          url: '/measurements/',
          data: self.measurements[index],
          headers: {
            id_token: idToken
          }
        }).then(function(response) {
          console.log("Response from measurement route: ", response);
        }).catch(function(err) {
          console.log("Error in measurement post");
        });
      });
  }

  //Confirming user wants to delete measurement. Index is the measurement to delete
  self.showConfirm = function(ev, index) {
    // Appending dialog to document.body to cover sidenav in docs app
    var confirm = $mdDialog.confirm()
          .title('Are you sure you wish to delete this measurement?')
          .targetEvent(ev)
          .ok('Yes. Delete measurement.')
          .cancel('No. Go back to measurements');

    $mdDialog.show(confirm).then(function() {
      self.deleteRowButton(index);
    }, function() {
    });
  };
  //Deleting measurement after confirmation
  self.deleteRowButton = function(index){
    console.log("remove row number: ", self.measurements[index].id);
    var idToDelete = self.measurements[index].id;
    var currentUser = UserFactory.getUser();
    currentUser.getToken()
    .then(function(idToken) {
        $http({
          method: 'DELETE',
          url: '/measurements/' + idToDelete,
          headers: {
            id_token: idToken
          }
        }).then(function(response) {
          console.log("Response from measurement route: ", response);
          self.getMeasurements();
        }).catch(function(err) {
          console.log("Error in measurement post");
        });
      });
  }

}]);
