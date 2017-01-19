app.controller('SurveyController', ["$http", 'UserFactory', 'IdFactory', '$route',
function($http, UserFactory, IdFactory, $route) {
  console.log("In Survey Controller");
  var self = this;
  // var surveyId = IdFactory.getSurveyId();
  var surveyId = $route.current.params.surveyId;
  var currentUser;
  console.log("Id Factory: ", IdFactory.survey);
  console.log("surveyId: ", surveyId);

  function getSurveyDetails() {
    currentUser = UserFactory.getUser();
    console.log("Current User", currentUser);
    currentUser.getToken()
    .then(function(idToken) {
        $http({
          method: 'GET',
          url: '/surveys/preview/one/' + surveyId,
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
          self.areaArray
          console.log('areaArray', self.areaArray);
        },
        function(err) {
          console.log("error getting survey details: ", err);
        });
    })}

  // getSurveyDetails();

  UserFactory.auth.$onAuthStateChanged(function(firebaseUser) {
    currentUser = firebaseUser;
    getSurveyDetails();
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
