var app = angular.module('app', ['ngRoute', 'firebase', 'ngMaterial']);

app.filter('startFrom', function() {
  return function(input, start) {
    start = +start; //parse to int
    return input.slice(start);
  }
});

angular.module('app').directive('updateOnEnter', function() {
  return {
      restrict: 'A',
      require: 'ngModel',
      link: function(scope, element, attrs, ctrl) {
          element.on("keyup", function(ev) {
              if (ev.keyCode == 13) {
                  ctrl.$commitViewValue();
                  scope.$apply(ctrl.$setTouched);
              }
          });
      }
  }
});
app.config(['$routeProvider', function($routeProvider) {
  $routeProvider
  .when('/login', {
    templateUrl: '/views/templates/login.html',
    controller: 'LoginController',
    controllerAs: 'login'
  })
  .when('/dashboard', {
    templateUrl: '/views/templates/dashboard.html',
    controller: 'DashboardController',
    controllerAs: 'dash'
  })
  .when('/measurement', {
    templateUrl: '/views/templates/measurement.html',
    controller: 'MeasurementController',
    controllerAs: 'measure'
  })
  .when('/survey', {
    templateUrl: '/views/templates/survey.html',
    controller: 'SurveyController',
    controllerAs: 'survey'
  })
  .when('/profile' ,{
    templateUrl: '/views/templates/profile.html',
    controller: 'ProfileController',
    controllerAs: 'profile'
  })
  .otherwise({
    redirectTo: 'login'
  });

}]);
