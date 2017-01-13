/*********************
Create file directive
**********************/
app.directive('fileModel', ['$parse', function($parse) {
  return {
    restrict: 'A',//restrict to attribute
    link: function(scope, element, attrs) {
      var model = $parse(attrs.fileModel);
      var modelSetter = model.assign;
      element.bind('change', function() { //when element changes, execute this function
        scope.$apply(function() {
          console.log("Images selected: ", element[0].files);
          modelSetter(scope, element[0].files);
          console.log("Element in file directive: ", element);
        });
      });
    }
  };
}]);//end directive
