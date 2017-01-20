app.controller('SurveyController', ["$http", 'UserFactory', 'IdFactory', '$route',
function($http, UserFactory, IdFactory, $route) {
  console.log("In Survey Controller");
  var self = this;
  // var surveyId = IdFactory.getSurveyId();
  var surveyId = $route.current.params.surveyId;
  var currentUser;
  self.loading = false;
  const MIN_AREA_GOTO_TOP = 4;

  self.goToTop = function() {
    window.scrollTo(0, 0);
    console.log("Clicked Top");
  }

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
          self.loading = true;
          for (x in separateAreas) {
            self.areaArray.push(separateAreas[x]);
          }
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

  self.printPage = function() {
    window.print();
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
