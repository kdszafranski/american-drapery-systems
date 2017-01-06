var app = angular.module('app', ['ngRoute', 'firebase',]);

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
  .when('/job' ,{
    templateUrl: '/views/templates/job.html',
    controller: 'JobController',
    controllerAs: 'job'
  })
  .otherwise({
    redirectTo: 'dash'
  });

}]);
