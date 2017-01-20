/**********************
Create file controller
***********************/
app.controller('FileController', ['FileFactory', 'UserFactory', 'IdFactory', '$route', '$mdDialog',
function(FileFactory, UserFactory, IdFactory, $route, $mdDialog) {
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

  // self.currentFilesObject["file_" + (index + 1)].

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


      // FileFactory.getFiles(currentUser, areaId).then(function() {
  //   //Clear currentFilesObject in FileFactory
  //   FileFactory.currentFilesObject.files = FileList;
  //   FileFactory.currentFilesObject.filesInfo = {};
  //   //Se
  //   self.currentFilesObject.filesInfo = FileFactory.currentFilesObject.filesInfo;
  // });


  self.submitFiles = function() {
    console.log('submit files clicked');
    console.log('sending these files to FileFactory: ', self.newFilesObject.files);
    console.log('sending this file info to FileFactory: ', self.newFilesObject.filesInfo);
    FileFactory.updateFiles(self.newFilesObject); //send newFilesObject to FileFactory
    FileFactory.submitFiles(currentUser, surveyId, areaId); //send files and info to server
  }



}]);//End controller
