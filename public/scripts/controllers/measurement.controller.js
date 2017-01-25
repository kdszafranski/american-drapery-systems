app.controller('MeasurementController', ["$http", "UserFactory",
"$mdDialog", '$route', '$location', '$anchorScroll', '$mdToast',
function($http, UserFactory, $mdDialog, $route, $location, $anchorScroll, $mdToast) {
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
    if(firebaseUser) {
      currentUser = firebaseUser;
      getMeasurements(firebaseUser);
      getAreaInfo(firebaseUser);
    } else {
      console.log("There is no firebase user in measurement controller");
    }
  });

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
          self.measurements.push(angular.copy(self.measurement));
          $mdToast.show(
            $mdToast.simple()
            .textContent('Saved')
            .position('top right')
            .hideDelay(600)
            .parent('#notesDiv')
          );
        }).catch(function(err) {
          console.log("Error in measurement post");
          if (err.status === 403) {
            notAuthorizedAlert();
            console.log("In error 403");
          }
        });
      })
    console.log("mesurement array", self.measurements);
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
          if (err.status === 403) {
            notAuthorizedAlert();
            console.log("In error 403");
          }
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
          if (err.status === 403) {
            notAuthorizedAlert();
            console.log("In error 403");
          }
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
            console.log("Error in measurement update");
            //replace with previous values
            getMeasurements();
            if (err.status === 403) {
              notAuthorizedAlert();
              console.log("In error 403");
            }
          });
      });
  }

  //Confirming user wants to delete measurement. Index is the measurement to delete
  self.showConfirm = function(ev, index, id) {
    // Appending dialog to document.body to cover sidenav in docs app
    console.log("delete id:", id);
    self.deleteColor = id;
    var confirm = $mdDialog.confirm()
      .title('Are you sure you wish to delete this measurement?')
      .targetEvent(ev)
      .ok('Yes. Delete measurement.')
      .cancel('No. Go back to measurements');
    $mdDialog.show(confirm).then(function() {
      deleteRow(index);
    }, function() {
      self.deleteColor = false;
    });
  };
  //Deleting measurement after confirmation
  function deleteRow(index){
    currentUser = UserFactory.getUser();
    currentUser.getToken()
    .then(function(idToken) {
        $http({
          method: 'DELETE',
          url: '/measurements/' + self.measurements[index].id,
          headers: {
            id_token: idToken
          }
        }).then(function(response) {
          console.log("Response from measurement route: ", response);
          self.measurements.splice(index, 1);
          self.deleteColor = false;
          self.deleteId = null;
        }).catch(function(err) {
          console.log("Error in measurement post");
          if (err.status === 403) {
            notAuthorizedAlert();
            console.log("In error 403");
          }
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

  function notAuthorizedAlert() {
      alert = $mdDialog.alert({
        title: 'Attention',
        textContent: 'You are not authorized to perform this action',
        ok: 'Close'
      });

      $mdDialog
        .show( alert )
        .finally(function() {
          self.deleteColor = false;
          self.deleteId = null;
          alert = undefined;
          console.log("Ran .finally");
          getMeasurements(currentUser);
          self.measurement = {};
        });
    }

}]);
