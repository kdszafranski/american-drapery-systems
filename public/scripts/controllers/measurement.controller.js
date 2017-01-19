app.controller('MeasurementController', ["$http", "IdFactory", "UserFactory", "$mdDialog", 'InfoFactory', '$location',   function($http, IdFactory, UserFactory, $mdDialog, InfoFactory, $location) {
  var self = this;
  var survey_id = IdFactory.getSurveyId();
  self.measurement = {};
  self.measurements =[];
  self.measurement.edit = true;
  self.areaId = IdFactory.getAreaId();
  self.loading = false;
  self.showInput = true;
  self.currentProfile = {};


  if(IdFactory.getNewArea()) {
    //use client info passed along from area controller if this is a new area
    console.log('newstatus');
    self.companyInfo = formatDates([InfoFactory.getCompanyInfo()])[0];
    self.area_name = IdFactory.getNewArea();
    self.loading = true;
  } else {
    //get client info from server
    getMeasurements();
    getSurveyDetails();
  }

  function getMeasurements() {
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
          self.area_name = self.measurements[0].area_name;
          console.log('AREA NAME', self.area_name);
        }).catch(function(err) {
          console.log("Error in measurment controller get req: ", err);
        });
      })
  }

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
          self.companyInfo = response.data[0];
          self.completionDate = new Date(self.companyInfo.completion_date);
          self.surveyDate = new Date(self.companyInfo.survey_date);
          self.loading = true;
        },
        function(err) {
          console.log("error getting survey details: ", err);
        });
    })
  }

  self.addButton = function(){
    console.log("mesurement: ", self.measurement);
    console.log("survey ID: ", self.areaId);
    var currentUser = UserFactory.getUser();
    currentUser.getToken()
    .then(function(idToken) {
        $http({
          method: 'POST',
          url: '/measurements/' + self.areaId,
          data: self.measurement,
          headers: {
            id_token: idToken
          }
        }).then(function(response) {
          console.log("Response from measurement route: ", response);
          getMeasurements();

        }).catch(function(err) {
          console.log("Error in measurement post");
        });
      })
    self.measurements.push(angular.copy(self.measurement));
    console.log("mesurement array", self.measurements);
  }

  //save edits to client profile button
  self.updateClient = function(){
    console.log("profile to be updated", self.companyInfo);
    self.companyInfo.completion_date = new Date(self.completionDate);
    self.companyInfo.survey_date = new Date(self.surveyDate);
    var clientId = self.companyInfo.client_id;
    var currentUser = UserFactory.getUser();
    currentUser.getToken()
    .then(function(idToken) {
      $http({
        method: 'POST',
        url: '/clients/'+ clientId,
        data: self.companyInfo,
        headers: {
          id_token: idToken
        }
      }).then(function(response){
        console.log("Response from new client post: ", response.data);
        updateSurvey();
      },
      function(err) {
        console.log("error posting client: ", err);
      });
    });
  }
  function updateSurvey(){
    var currentUser = UserFactory.getUser();
    console.log("survey id", survey_id);
    currentUser.getToken()
      .then(function(idToken) {
        $http({
          method: 'PUT',
          url: '/surveys/update/' + survey_id,
          data: self.companyInfo,
          headers: {
            id_token: idToken
          }
        }).then(function(response){
          console.log("Updated: ", response.data);
          self.showInput = !self.showInput;
        },
        function(err) {
          console.log("error updating survey details: ", err);
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
          getMeasurements();
        }).catch(function(err) {
          console.log("Error in measurement post");
        });
      });
  }

  self.backToArea = function() {
    $location.path('/area');
  }

}]);
