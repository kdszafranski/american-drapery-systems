var app = angular.module('app', ['ngRoute', 'firebase', 'ngMaterial']);


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
  .when('/measurementarea' ,{
    templateUrl: '/views/templates/measurement-area.html',
    controller: 'MeasurementAreaController',
    controllerAs: 'ma'
  })
  .otherwise({
    redirectTo: 'login'
  });

}]);
