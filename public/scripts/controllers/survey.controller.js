app.controller('SurveyController', ["$http", 'UserFactory', 'IdFactory', '$route', 'FileFactory', '$scope', '$mdDialog',
function($http, UserFactory, IdFactory, $route, FileFactory, $scope, $mdDialog) {
  console.log("In Survey Controller");
  var self = this;
  var surveyId = $route.current.params.surveyId;
  self.surveyId = surveyId;
  var currentUser;
  self.loading = false;
  self.imgLoad = false;
  const MIN_AREA_GOTO_TOP = 4;
  var currentFilesObject = {};

  self.goToTop = function() {
    window.scrollTo(0, 0);
    console.log("Clicked Top");
  };

  self.show = true;
  self.baseUrl = 'https://s3.amazonaws.com/american-drapery-systems/survey_' + surveyId + '/area_';

  self.showPreview = function(ev, index) {
    // Appending dialog to document.body to cover sidenav in docs app
    var currentFile = self.currentFilesObject["file_" + (index + 1)];
    var currentFileUrl = self.baseUrl + currentFile.areaId + '/' + currentFile.key + currentFile.originalName;

    if(currentFile.extension == "pdf") {
      $mdDialog.show({
        template:
          '<md-card>' +
            '<md-card-content layout="row" layout-wrap>' +
              '<iframe ng-src="' + currentFileUrl + '" width="750" height="750"></iframe>' +
            '</md-card-content>' +
          '</md-card flex>',
        targetEvent: ev,
        clickOutsideToClose: true
      })
    } else {
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
    }
  };


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
          self.loading = true;
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
              FileFactory.currentFilesObject = {};
              console.log("currentFilesObject: ", self.currentFilesObject);
              self.imgLoad = true;
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

  self.printPage = function() {
    window.print();
  }

}]);//end controller

//Function to group measurements by area
function groupBy(arr, property) {
  return arr.reduce(function(memo, x) {
    if (!memo[x[property]]) { memo[x[property]] = []; }
    memo[x[property]].push(x);
    return memo;
  }, {});
}
