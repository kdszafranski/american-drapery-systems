app.controller('MeasurementAreaController', ["$http", 'IdFactory', '$location', "$mdDialog", 'UserFactory', 'InfoFactory', function($http, IdFactory, $location, $mdDialog, UserFactory, InfoFactory) {
  var self = this;
  var survey_id = IdFactory.getSurveyId();
  self.loading = false;
  self.showInput = true;
  self.newAreaName = '';
  self.editAreas = false;
  console.log(survey_id);
  self.inputAreaName = false;
  self.toRemove = [];
  getSurveyDetails();

  //function to send area to measurent controller
  self.setArea = function(index) {
    console.log("index: ", index);
    IdFactory.setArea(self.areaArrayId[index]);
    $location.path('/measurement');
  }
  self.showConfirm = function(ev) {
    // Appending dialog to document.body to cover sidenav in docs app
    if(self.toRemove.indexOf(true) != -1) {
      var confirm = $mdDialog.confirm()
        .title('Are you sure you wish to delete the selected areas and all associated measurements')
        .targetEvent(ev)
        .ok('Yes. Delete areas.')
        .cancel('No. Go back to areas');
      $mdDialog.show(confirm).then(function() {
        deleteAreas();
      }, function() {
      });
    }
  };

  self.areaClick = function(index) {
    if(self.editAreas) {
      self.toRemove[index]=!self.toRemove[index];
    } else {
      self.setArea(index);
      self.editAreas = true;
    }
  }
  function deleteAreas() {
    self.loading = false;
    var deleteIds = [];
    var currentUser = UserFactory.getUser();
    for (var i = 0; i < self.toRemove.length; i++) {
      if (self.toRemove[i]) {
        deleteIds.push(self.areaArrayId[i])
      }
    }
    console.log('deleteIds', deleteIds);
    currentUser.getToken()
      .then(function(idToken) {
        $http({
          method: 'DELETE',
          url: '/areas/',
          params: {
            "id[]": deleteIds
          },
          headers: {
            id_token: idToken
          }
        }).then(function(response){
          //get survey details on last iteration
          getSurveyDetails();
          console.log('deletes complete')
        },
        function(err) {
          console.log("error with delete: ", err);
    });
    });
  }

  self.addNewArea = function() {
    InfoFactory.setCompanyInfo(self.companyInfo);
    IdFactory.setNewArea(self.newAreaName);
    console.log("Clicked Add New Area:");
    self.inputAreaName = false;
    self.newArea = {
      area_name: self.newAreaName,
      survey_id: survey_id
    }
    console.log("New Area Object: ", self.newArea);
    var currentUser = UserFactory.getUser();
    currentUser.getToken()
      .then(function(idToken) {
        $http({
          method: 'POST',
          url: '/areas/',
          data: self.newArea,
          headers: {
            id_token: idToken
          }
        }).then(function(response){
          console.log("Response from new area post: ", response.data);
          self.newAreaId = response.data[0].id;
          IdFactory.setArea(self.newAreaId);
          $location.path('/measurement');
        },
        function(err) {
          console.log("error getting survey details: ", err);
        });
    })
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

  //function to update survey data
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

  //function to get all areas associated with survey or just company and survey information if the survey is new
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
          //Check to see if it is a new survey. Length will be zero if it is a new survey
          if (self.surveyDetails.length === 0) {
            currentUser.getToken()
              .then(function(idToken) {
                $http({
                  method: 'GET',
                  url: '/surveys/new/' + survey_id,
                  headers: {
                    id_token: idToken
                  }
                })
                .then(function(response){
                  self.surveyDetails = response.data;
                  surveyOps();
                },
                function(err) {
                  console.log("error getting survey details: ", err);
                });
            });
          } else {
            surveyOps();
          }
        },
        function(err) {
          console.log("error getting survey details: ", err);
        });
    });
  }

  function surveyOps() {
    self.companyInfo = self.surveyDetails[0];
    self.areaArray = [...new Set(self.surveyDetails.map(survey => survey.area_name))];
    self.areaArrayId = [...new Set(self.surveyDetails.map(survey => survey.area_id))];
    for (var i = 0; i < self.areaArray.length; i++) {
      self.toRemove[i] = false;
    }
    self.completionDate = new Date(self.companyInfo.completion_date);
    self.surveyDate = new Date(self.companyInfo.survey_date);
    self.loading = true;
    console.log("Response From Server: ", self.surveyDetails);
    console.log("Area Array: ", self.areaArray);
    console.log("Area ID: ", self.areaArrayId);

  }
}]);

//Function to group measurements by area
function groupBy(arr, property) {
  return arr.reduce(function(memo, x) {
    if (!memo[x[property]]) { memo[x[property]] = []; }
    memo[x[property]].push(x);
    return memo;
  }, {});
}
