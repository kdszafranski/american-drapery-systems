/**********************
Create file factory
***********************/
app.factory('FileFactory', ['$http', 'MultipartForm',
function($http, MultipartForm) {

  var fileFactory = {

    filesObject: {
      files: FileList,
      filesInfo: {}
    },

    updateFiles: function(newFiles) {
      fileFactory.filesObject.files = newFiles.files;
      fileFactory.filesObject.filesInfo = newFiles.filesInfo;
      console.log("Files now in FileFactory: ", fileFactory.filesObject.files, fileFactory.filesObject.filesInfo);
    },

    submitFiles: function(currentUser, areaId) {
      var uploadUrl = '/files/' + areaId;
      console.log("submitFiles() running in FileFactory, sending files to server " +
      "Using route: ", uploadUrl);

      return currentUser.getToken().then(function(idToken) {
        return MultipartForm.post(uploadUrl, fileFactory.filesObject, idToken)
        .then(function(response) {
          return console.log("Response from server: ", response);
        });
      });
    }







  }

  return fileFactory;
}]);
