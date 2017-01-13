/**********************
Create file factory
***********************/
app.factory('FileFactory', ['$http', 'MultipartForm',
function($http, MultipartForm) {

  const uploadUrl = '/files';

  var fileFactory = {

    filesObject: {
      files: FileList,
      filesInfo: [],
    },

    updateFiles: function(newFiles) {
      fileFactory.filesObject.files = newFiles.files;
      fileFactory.filesObject.filesInfo = newFiles.filesInfo;
      console.log("Files now in FileFactory: ", fileFactory.filesObject.files, fileFactory.filesObject.filesInfo);
    },

    submitFiles: function() {
      console.log("submitFiles() running in FileFactory, sending files to server");
      return MultipartForm.post(uploadUrl, fileFactory.filesObject).then(function(response) {
        console.log("Response from server: ", response);
      });
    }







  }

  return fileFactory;
}]);
