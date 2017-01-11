app.service('MultipartForm', ['$http', function($http) {
  this.post = function(uploadUrl, data) {
    var fd = new FormData();
    console.log("Multipartform data: ", data);

    fd.append();

    for( var i = 0; i< data.files.length ; i++ ){
        fd.append('file' , data.files[i] );
    }

    return $http.post(uploadUrl, fd, { //this is a configuration for the POST
      transformRequest: angular.indentity, //stops angular from serializing our data
      headers: { 'Content-Type': undefined } //lets browser handle what type of data is being sent...
    });
  };//end this.post function expression
}]);
