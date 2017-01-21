app.controller('MeasurementController', ["$http", "UserFactory",
"$mdDialog", 'InfoFactory',  '$route', '$location', '$anchorScroll', '$mdToast',
function($http, UserFactory, $mdDialog, InfoFactory, $route, $location, $anchorScroll, $mdToast) {
  var self = this;
  var surveyId = $route.current.params.surveyId;
  self.measurement = {};
  self.measurements =[];
  self.measurement.edit = true;
  self.areaId = $route.current.params.areaId;
  self.area_name = $route.current.params.areaName;
  self.loading = false;
  self.showInput = true;
  self.currentProfile = {};
  var currentUser;

  function getMeasurements(firebaseUser) {
    console.log("CurrentUser in getmeasure: ", currentUser);
    currentUser = firebaseUser;
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
          // self.area_name = self.measurements[0].area_name;
          console.log('AREA NAME', self.area_name);
        }).catch(function(err) {
          console.log("Error in measurment controller get req: ", err);
        });
      })
  }


  //Runs when page refreshed AND when switching to this controller
  UserFactory.auth.$onAuthStateChanged(function(firebaseUser) {
    currentUser = firebaseUser;
    getMeasurements(firebaseUser);
    getAreaInfo(firebaseUser);
  })

  function getAreaInfo(firebaseUser) {
    currentUser = firebaseUser;
    currentUser.getToken()
      .then(function(idToken) {
        $http({
          method: 'GET',
          url: '/areas/' + self.areaId,
          headers: {
            id_token: idToken
          }
        })
        .then(function(response){
          self.companyInfo = response.data[0];
          self.completionDate = new Date(self.companyInfo.completion_date);
          self.surveyDate = new Date(self.companyInfo.survey_date);
          self.areaNotes = self.companyInfo.notes;
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
    self.deleteColor = false;
    $mdToast.show(
      $mdToast.simple()
      .textContent('Saved')
      .position('top right')
      .hideDelay(600)
      .parent('#notesDiv')
    );
    var currentUser = UserFactory.getUser();
    // var currentUser = UserFactory.getUser();
    console.log("Current User at addButton: ", currentUser);
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

          getMeasurements(currentUser);

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
    // var currentUser = UserFactory.getUser();
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
    console.log("survey id", surveyId);
    currentUser.getToken()
      .then(function(idToken) {
        $http({
          method: 'PUT',
          url: '/surveys/update/' + surveyId,
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

    function updateNotes(){
      // var currentUser = UserFactory.getUser();
      console.log("Notes");
      currentUser.getToken()
        .then(function(idToken) {
          $http({
            method: 'PUT',
            url: '/areas/notes/' + self.areaId,
            data: {note: self.areaNotes},
            headers: {
              id_token: idToken
            }
          }).then(function(response){
            console.log("Updated: ", response.data);
          },
          function(err) {
            console.log("error updating survey details: ", err);
          });
        });
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
  self.showConfirm = function(ev, index, id) {
    // Appending dialog to document.body to cover sidenav in docs app
    console.log("IIIIDDDD", id);
    self.deleteColor = id;
    var confirm = $mdDialog.confirm()
          .title('Are you sure you wish to delete this measurement?')
          .targetEvent(ev)
          .ok('Yes. Delete measurement.')
          .cancel('No. Go back to measurements');

    $mdDialog.show(confirm).then(function() {
      self.deleteRowButton(index);
    }, function() {
      self.deleteColor = false;
    });
  };
  //Deleting measurement after confirmation
  self.deleteRowButton = function(index){
    console.log('#row'+ self.measurements[index].id);
    console.log("remove row number: ", self.measurements[index].id);
    var idToDelete = self.measurements[index].id;
    currentUser = UserFactory.getUser();
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
          getMeasurements(currentUser);
          self.deleteColor = false;
        }).catch(function(err) {
          console.log("Error in measurement post");
        });
      });
  }

  self.backToArea = function() {
    updateNotes();
    $location.path('/area/' + surveyId);
    console.log("self.measurements", self.measurements);
  }

  self.goToTopOfPage = function(){
    console.log("clicked");
    window.scrollTo(0,0)
  }

}]);
