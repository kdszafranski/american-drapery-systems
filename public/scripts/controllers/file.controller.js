/**********************
Create file controller
***********************/
app.controller('FileController', ['FileFactory', 'UserFactory', 'IdFactory', '$scope',
function(FileFactory, UserFactory, IdFactory, $scope) {
  console.log("File controller running");
  const self = this;

  var currentUser = UserFactory.getUser();
  var surveyId = IdFactory.getSurveyId();
  var areaId = IdFactory.getAreaId();


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

  FileFactory.getFiles(currentUser, areaId).then(function() {
    //Clear currentFilesObject in FileFactory
    FileFactory.currentFilesObject.files = FileList;
    FileFactory.currentFilesObject.filesInfo = {};
    //Se
    self.currentFilesObject.filesInfo = FileFactory.currentFilesObject.filesInfo;
  });


  self.submitFiles = function() {
    console.log('submit files clicked');
    console.log('sending these files to FileFactory: ', self.newFilesObject.files);
    console.log('sending this file info to FileFactory: ', self.newFilesObject.filesInfo);
    FileFactory.updateFiles(self.newFilesObject); //send newFilesObject to FileFactory
    FileFactory.submitFiles(currentUser, surveyId, areaId); //send files and info to server
  }

}]);//End controller
