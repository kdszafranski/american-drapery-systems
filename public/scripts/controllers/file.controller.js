/**********************
Create file controller
***********************/
app.controller('FileController', ['FileFactory', 'UserFactory', 'IdFactory', '$route', '$mdToast',
function(FileFactory, UserFactory, IdFactory, $route, $mdToast) {
  console.log("File controller running");
  const self = this;

  var currentUser;
  var surveyId = $route.current.params.surveyId;
  var areaId = $route.current.params.areaId;

  UserFactory.auth.$onAuthStateChanged(function(firebaseUser) {
    currentUser = firebaseUser;
  });

  console.log("FileController currentUser: \n", currentUser, '\n\n');
  console.log("FileController surveyId: \n\n", surveyId, '\n\n');
  console.log("FileController areaId: \n\n", areaId, '\n\n');

  self.newFilesObject = { //store files and info here
    files: FileList,
    filesInfo: {}
  };

  self.currentFilesObject = {
    files: FileList,
    filesInfo: {}
  }

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
    $mdToast.show(
      $mdToast.simple()
      .textContent('Submitted')
      .position('top left' )
      .hideDelay(800)
      .parent('#fileSubmitDiv')
    );
    FileFactory.updateFiles(self.newFilesObject); //send newFilesObject to FileFactory
    FileFactory.submitFiles(currentUser, surveyId, areaId); //send files and info to server
  }



}]);//End controller
