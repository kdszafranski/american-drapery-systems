app.controller('SurveyController', ["$http", function($http) {
  var self = this;
  var survey_id = 2;

  function getSurveyDetails() {
    $http({
      method: 'GET',
      url: '/surveys/one/' + survey_id
    }).then(function(response){
      self.surveyDetails = response;
      console.log("Response From Server: ", self.surveyDetails.data);
      var separateAreas = groupBy(self.surveyDetails.data, 'area');
      console.log(separateAreas);
      var areaArray = [];
      for (x in separateAreas) {
        areaArray.push(separateAreas[x]);
      }
      console.log(areaArray);
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
