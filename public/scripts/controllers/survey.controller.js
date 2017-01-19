app.controller('SurveyController', ["$http", 'UserFactory', 'IdFactory',  function($http, UserFactory, IdFactory) {
  console.log("In Survey Controller");
  var self = this;
  var survey_id = IdFactory.getSurveyId();
  const MIN_AREA_GOTO_TOP = 4;

  self.goToTop = function() {
    window.scrollTo(0, 0);
    console.log("Clicked Top");
  }

  console.log("Id Factory: ", IdFactory.survey);
  console.log("Survey_id: ", survey_id);

  function getSurveyDetails() {
    currentUser = UserFactory.getUser();
    console.log("Current User", currentUser);
    currentUser.getToken()
    .then(function(idToken) {
        $http({
          method: 'GET',
          url: '/surveys/one/' + survey_id,
          headers: {
            id_token: idToken
          }
        }).then(function(response){
          self.surveyDetails = formatDates(response.data);
          console.log("Response From Server: ", self.surveyDetails);
          //Seperate measurements into areas
          var separateAreas = groupBy(self.surveyDetails, 'area_name');
          console.log(separateAreas);
          self.areaArray = [];
          for (x in separateAreas) {
            self.areaArray.push(separateAreas[x]);
          }
        },
        function(err) {
          console.log("error getting survey details: ", err);
        });
    })}

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
