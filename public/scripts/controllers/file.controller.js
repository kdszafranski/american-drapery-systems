/**********************
Create file controller
***********************/
app.controller('FileController', ['FileFactory', 'UserFactory',
function(FileFactory, UserFactory) {
  console.log("File controller running");
  const self = this;
  var currentUser = UserFactory.getUser();

  self.filesObject = { //store files and info here
    files: FileList,
    filesInfo: {}
  };

  self.infoCounter = 0;

  self.clickTest = function() {
    console.log("click test clicked");
    console.log(self.filesObject.filesInfo);
  }

  self.submitFiles = function() {
    console.log('submit files clicked');
    console.log('sending these files to FileFactory: ', self.filesObject.files);
    console.log('sending this file info to FileFactory: ', self.filesObject.filesInfo);
    FileFactory.updateFiles(self.filesObject); //send filesObject to FileFactory
    FileFactory.submitFiles(currentUser); //send files and info to server
  }

}]);//End controller
// .directive('fileInfo', function() {
//   return {
//     template: 'This is data from the file controller: {{files.filesObject.test}}'
//   }
// });
