app.service('MultipartForm', ['$http', function($http) {
  this.post = function(uploadUrl, data) {
    var fd = new FormData(); //We will store form data here to be sent to server
    console.log("MultipartForm data: ", data);

    fd.append('fileInfo', data.filesInfo); //add file info text to form data

    for( var i = 0; i< data.files.length ; i++ ){
        fd.append('file' , data.files[i] );
    }//will loop through FileList and add each file

    return $http.post(uploadUrl, fd, { //this is a configuration for the POST
      transformRequest: angular.indentity, //stops angular from serializing our data
      headers: { 'Content-Type': undefined } //lets browser handle what type of data is being sent...
    });
  };//end this.post
}]);
