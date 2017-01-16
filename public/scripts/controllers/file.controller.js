/**********************
Create file controller
***********************/
app.controller('FileController', ['FileFactory', 'UserFactory', 'IdFactory',
function(FileFactory, UserFactory, IdFactory) {
  console.log("File controller running");
  const self = this;

  var currentUser = UserFactory.getUser();
  var surveyId = IdFactory.getSurveyId();
  var areaId = IdFactory.getAreaId();

  console.log("FileController currentUser: \n", currentUser, '\n\n');
  console.log("FileController surveyId: \n\n", surveyId, '\n\n');
  console.log("FileController areaId: \n\n", areaId, '\n\n');

  self.filesObject = { //store files and info here
    files: FileList,
    filesInfo: {}
  };


  self.submitFiles = function() {
    console.log('submit files clicked');
    console.log('sending these files to FileFactory: ', self.filesObject.files);
    console.log('sending this file info to FileFactory: ', self.filesObject.filesInfo);
    FileFactory.updateFiles(self.filesObject); //send filesObject to FileFactory
    FileFactory.submitFiles(currentUser, surveyId, areaId); //send files and info to server
  }

}]);//End controller
