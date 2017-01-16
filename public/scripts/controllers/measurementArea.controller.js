app.controller('MeasurementAreaController', ["$http", 'IdFactory', '$location', 'UserFactory',  function($http, IdFactory, $location, UserFactory) {
  var self = this;
  var survey_id = IdFactory.getSurveyId();
  self.newAreaName = '';
  console.log(survey_id);
  self.inputAreaName = false;
  //function to send area to measurent controller
  self.setArea = function(index) {
    console.log("index: ", index);
    IdFactory.setArea(self.areaArrayId[index]);

    $location.path('/measurement');
  }


  //function to add a new area
  self.showInput = function() {
    self.inputAreaName = true;
  }

  self.addNewArea = function() {
    console.log("Clicked Add New Area: ", self.newArea);
    self.inputAreaName = false;
    self.newArea = {
      area: self.newAreaName,
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
          console.log("Response from new area post: ", response.data[0].id);
          self.newAreaId = response.data[0].id;
          IdFactory.setArea(self.newAreaId);
          $location.path('/measurement');
        },
        function(err) {
          console.log("error getting survey details: ", err);
        });
    })
  }



  //function to handle clicking of an already existing area

  //function to get all areas associated with survey
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
        },
        function(err) {
          console.log("error getting survey details: ", err);
        });
    })

  }

  getSurveyDetails();
}]);

//Function to group measurements by area
function groupBy(arr, property) {
  return arr.reduce(function(memo, x) {
    if (!memo[x[property]]) { memo[x[property]] = []; }
    memo[x[property]].push(x);
    return memo;
  }, {});
}
