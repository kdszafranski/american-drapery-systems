/**********************
Create file controller
***********************/
app.controller('FileController', ['FileFactory', 'UserFactory', 'IdFactory', '$route', '$mdDialog', '$scope',
function(FileFactory, UserFactory, IdFactory, $route, $mdDialog, $scope) {
  console.log("File controller running");
  const self = this;

  var currentUser;
  var surveyId = $route.current.params.surveyId;
  var areaId = $route.current.params.areaId;

  UserFactory.auth.$onAuthStateChanged(function(firebaseUser) {
    currentUser = firebaseUser;
    FileFactory.getFiles(currentUser, areaId)
      .then(function() {
        self.currentFilesObject = FileFactory.currentFilesObject;
        console.log(self.currentFilesObject);
    });

  });

  self.newFilesObject = { //store files and info here
    files: FileList,
    filesInfo: {}
  };

  self.currentFilesObject = {};

  self.showPreview = function(ev, index) {
    // Appending dialog to document.body to cover sidenav in docs app
    var currentFile = self.currentFilesObject["file_" + (index + 1)];
    var baseUrl = 'https://s3.amazonaws.com/american-drapery-systems/survey_';
    var currentFileUrl = baseUrl + surveyId + '/' + 'area_' + currentFile.areaId + '/' + currentFile.key + currentFile.originalName;

    $mdDialog.show({
      template:
        '<md-card>' +
          '<md-card-content layout="row" layout-wrap>' +
            '<img src="' + currentFileUrl + '"/>' +
          '</md-card-content>' +
        '</md-card flex>',
      targetEvent: ev,
      clickOutsideToClose: true
    })
  };

  self.submitFiles = function() {
    FileFactory.updateFiles(self.newFilesObject); //send newFilesObject to FileFactory
    FileFactory.submitFiles(currentUser, surveyId, areaId)
    .then(function() {
      FileFactory.getFiles(currentUser, areaId)
        .then(function() {
          self.currentFilesObject = FileFactory.currentFilesObject;
          self.newFilesObject = {
            files: FileList,
            filesInfo: {}
          };
          console.log(self.newFilesObject);
          $scope.$apply();
          angular.element(document).find('#yourFile').val('');
        })
    }); //send files and info to server
  };

  // self.deleteFile = function(index) {
  //   var clickedFile =  self.currentFilesObject["file_" + (index + 1)];
  //   currentUser.getToken()
  //     .then(function(idToken) {
  //       $http({
  //         method: 'DELETE',
  //         url: '/files/' + surveyId + '/' + clickedFile.areaId + '/' + clickedFile.key + '/' + clickedFile.originalName,
  //         headers: {
  //           id_token: idToken
  //         }
  //       }).then(function(response) {
  //         console.log("Successfully deleted file from DB: ", response);
  //         FileFactory.getFiles(currentUser, areaId)
  //           .then(function() {
  //             self.currentFilesObject = FileFactory.currentFilesObject;
  //       }).catch(function(err) {
  //         console.log("Server error deleting files: ", err);
  //         FileFactory.getFiles(currentUser, areaId)
  //           .then(function() {
  //             self.currentFilesObject = FileFactory.currentFilesObject;
  //             console.log(self.currentFilesObject);
  //       })
  //   }
  //
  // };

}]);//End controller
