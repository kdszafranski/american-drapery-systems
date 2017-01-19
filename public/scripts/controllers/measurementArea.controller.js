app.controller('MeasurementAreaController', ["$http", 'IdFactory', '$location', 'UserFactory', 'InfoFactory', '$route', '$mdDialog',
function($http, IdFactory, $location, UserFactory, InfoFactory, $route, $mdDialog) {
  var self = this;
  // var survey_id = IdFactory.getSurveyId();
  var surveyId = $route.current.params.surveyId;
  self.loading = false;
  self.showInput = false
  self.currentProfile = {};
  var currentUser;
  var areaId;

  self.newAreaName = '';
  self.editAreas = false;
  console.log(surveyId);
  self.inputAreaName = false;
  self.toRemove = [];
  // getSurveyDetails();

  //function to send area to measurent controller
  self.setArea = function(index) {
    console.log("index: ", index);
    areaId = self.areaArrayId[index];
    IdFactory.setArea(areaId);

    $location.path('/measurement/' + surveyId + '/' + areaId);
  }


  //function to add a new area
  self.showInput = function() {
    self.inputAreaName = true;
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
    console.log("Clicked Add New Area:");
    self.inputAreaName = false;
    self.newArea = {
      area_name: self.newAreaName,
      survey_id: surveyId
    }
    console.log("New Area Object: ", self.newArea);
    // currentUser = UserFactory.getUser();

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
          console.log("Response from new area post: ", response.data[0].id);
          //We shouldn't really need to do this anymore, as we're storing this info in the url now
          areaId = response.data[0].id;
          IdFactory.setArea(areaId);
          //We do need to do this now.
          $location.path('/measurement/' + surveyId + '/' + areaId);
        },
        function(err) {
          console.log("error getting survey details: ", err);
        });
    })
  }
  //Edit client profile button
  self.editClient = function(){
    console.log("clicked");
    self.showInput = !self.showInput;
  }
  //save edits to client profile button
  self.updateClient = function(){
    var clientId = self.currentProfile.client_id;
    // var currentUser = UserFactory.getUser();
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
  //function to handle clicking of an already existing area

  //function to get all areas associated with survey
  function getSurveyDetails(firebaseUser) {
    console.log("SURVEY ID\n\n", surveyId);
    if(firebaseUser) {
      user = firebaseUser;
    } else {
      user = currentUser;
    }
    user.getToken()
      .then(function(idToken) {
        $http({
          method: 'GET',
          url: '/surveys/one/' + surveyId,
          headers: {
            id_token: idToken
          }
        })
        .then(function(response){
          console.log("GETTING AREAS FOR SURVEY \n\n");
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
        })
        .catch(function(err) {
          console.log("error getting survey details: ", err);
        });
    })
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
    self.editAreas = false;
    self.loading = true;
    console.log("Response From Server: ", self.surveyDetails);
    console.log("Area Array: ", self.areaArray);
    console.log("Area ID: ", self.areaArrayId);
  }
  // getSurveyDetails(firebaseUser);
  //This happens when when we switch to this view/controller AND when page is refreshed
  UserFactory.auth.$onAuthStateChanged(function(firebaseUser) {
    currentUser = firebaseUser;
    getSurveyDetails(firebaseUser);
  });

}]);

//Function to group measurements by area
function groupBy(arr, property) {
  return arr.reduce(function(memo, x) {
    if (!memo[x[property]]) { memo[x[property]] = []; }
    memo[x[property]].push(x);
    return memo;
  }, {});
}
