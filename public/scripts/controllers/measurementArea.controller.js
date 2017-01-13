app.controller('MeasurementAreaController', ["$http", function($http) {
  var self = this;
<<<<<<< HEAD
  var survey_id = 2;
  //function to send area to measurent controller

  //function to add a new area

  //function to handle clicking of an already existing area

  //function to get all areas associated with survey
  function getSurveyDetails() {
    $http({
      method: 'GET',
      url: '/surveys/one/' + survey_id
    }).then(function(response){
      self.surveyDetails = response.data;
      console.log("Response From Server: ", self.surveyDetails);
      self.companyInfo = self.surveyDetails[0];
      self.areaArray = self.surveyDetails.map(survey => survey.area);
      for (var i = 0; i < 5; i++) {
        self.areaArray.push(i);
      }
    },
    function(err) {
      console.log("error getting survey details: ", err);
    });
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
