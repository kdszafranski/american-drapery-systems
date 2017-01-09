var app = angular.module('app', ['ngRoute', 'firebase', 'ngMaterial']);


app.config(['$routeProvider', function($routeProvider) {
  $routeProvider
  .when('/dashboard',{
    templateUrl: '/views/templates/dashboard.html',
    controller: 'DashboardController',
    controllerAs: 'dash'
  })
  .when('/measurement',{
    templateUrl: '/views/templates/measurement.html',
    controller: 'MeasurementController',
    controllerAs: 'measure'
  })
  .when('/survey' ,{
    templateUrl: '/views/templates/survey.html',
    controller: 'SurveyController',
    controllerAs: 'survey'
  })
  .otherwise({
    redirectTo: 'dashboard'
  });

}]);
