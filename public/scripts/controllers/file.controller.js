/**********************
Create file controller
***********************/
app.controller('FileController', ['FileFactory',
function(FileFactory) {
  const self = this;

  self.filesObject = { //store files and info here
    files: FileList
  };

  self.submitFiles = function() {
    console.log('submit files clicked');
    FileFactory.updateFiles(self.filesObject); //send filesObject to FileFactory
    FileFactory.submitFiles(); //send files and info to server
  }

}]);//End controller
