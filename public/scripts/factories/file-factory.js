/**********************
Create file factory
***********************/
app.factory('FileFactory', ['$http', 'MultipartForm',
function($http, MultipartForm) {

  var fileFactory = {

    newFilesObject: {
      files: FileList,
      filesInfo: {}
    },

    currentFilesObject: {
      files: FileList,
      filesInfo: {}
    },

    updateFiles: function(newFiles) {
      fileFactory.newFilesObject.files = newFiles.files;
      fileFactory.newFilesObject.filesInfo = newFiles.filesInfo;
      console.log("Files now in FileFactory: ", fileFactory.newFilesObject.files, fileFactory.newFilesObject.filesInfo);
    },

    getFiles: function(currentUser, areaId) {
      console.log("current user in get files: ", currentUser);
      return currentUser.getToken().then(function(idToken) {
        return $http({
          method: 'GET',
          url: '/files/' + areaId,
          headers: {
            id_token: idToken
          }
        }).then(function(response) {
          // return console.log("Recieved this info from the server in FileFactory GET req: ", response);
          for (var i = 0; i < response.data.length; i++) {
            fileFactory.currentFilesObject.filesInfo["file_" + (i + 1)] = response.data[i];
          }
          return console.log(fileFactory.currentFilesObject.filesInfo);
        })
      })
    },

    submitFiles: function(currentUser, surveyId, areaId) {
      var uploadUrl = '/files/' + areaId;
      console.log("submitFiles() running in FileFactory, sending files to server " +
      "Using route: ", uploadUrl);

      return currentUser.getToken().then(function(idToken) {
        return MultipartForm.post(uploadUrl, surveyId, fileFactory.newFilesObject, idToken)
        .then(function(response) {
          return console.log("Response from server: ", response);
        });
      });
    }







  }

  return fileFactory;
}]);
