app.controller('SurveyController', ["$http", 'UserFactory', 'IdFactory', '$route', 'FileFactory', '$scope', '$mdDialog',
function($http, UserFactory, IdFactory, $route, FileFactory, $scope, $mdDialog) {
  console.log("In Survey Controller");
  var self = this;
  // var surveyId = IdFactory.getSurveyId();
  var surveyId = $route.current.params.surveyId;
  self.surveyId = surveyId;
  var currentUser;
  const MIN_AREA_GOTO_TOP = 4;
  var currentFilesObject = {};

  self.goToTop = function() {
    window.scrollTo(0, 0);
    console.log("Clicked Top");
  };

  self.show = true;

  self.showPreview = function(ev, index) {
    // Appending dialog to document.body to cover sidenav in docs app
    var currentFile = self.currentFilesObject["file_" + (index + 1)];
    var baseUrl = 'https://s3.amazonaws.com/american-drapery-systems/survey_';
    var currentFileUrl = baseUrl + surveyId + '/' + 'area_' + currentFile.areaId + '/' + currentFile.key + currentFile.originalName;

    $mdDialog.show({
      template:
        '<md-card>' +
          '<md-card-content layout="row" layout-wrap>' +
            '<img ng-src="' + currentFileUrl + '"/>' +
          '</md-card-content>' +
        '</md-card flex>',
      targetEvent: ev,
      clickOutsideToClose: true
    })
  };


  console.log("Id Factory: ", IdFactory.survey);
  console.log("surveyId: ", surveyId);

  function getSurveyDetails() {
    // currentUser = UserFactory.getUser();
    // console.log("Current User", currentUser);
    currentUser.getToken()
    .then(function(idToken) {
        $http({
          method: 'GET',
          url: '/surveys/preview/one/' + surveyId,
          headers: {
            id_token: idToken
          }
        })
        .then(function(response){
          self.surveyDetails = formatDates(response.data);
          console.log("Response From Server: ", self.surveyDetails);
          //Seperate measurements into areas
          var separateAreas = groupBy(self.surveyDetails, 'area_name');
          console.log(separateAreas);
          self.areaArray = [];
          for (x in separateAreas) {
            self.areaArray.push(separateAreas[x]);
          }
          console.log("areaArray: ", self.areaArray);
        })
        .then(function() {
          FileFactory.getSurveyFiles(currentUser, surveyId)
            .then(function() {
              console.log("This .then() is happening");
              self.currentFilesObject = FileFactory.currentFilesObject;
              console.log("currentFilesObject: ", self.currentFilesObject);
              $scope.$apply();
            })
        })
        .catch(function(err) {
          console.log("error getting survey details: ", err);
        })
    })
  };

  UserFactory.auth.$onAuthStateChanged(function(firebaseUser) {
    currentUser = firebaseUser;
    getSurveyDetails();
  });

}]);//end controller


//Function to group measurements by area
function groupBy(arr, property) {
  return arr.reduce(function(memo, x) {
    if (!memo[x[property]]) { memo[x[property]] = []; }
    memo[x[property]].push(x);
    return memo;
  }, {});
}
