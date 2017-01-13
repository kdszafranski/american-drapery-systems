
app.controller('NavController', ["UserFactory", "$location", "$rootScope",
function(UserFactory, $location, $rootScope) {
  console.log("Nav controller is running!");

  const self = this;
  self.isUser = UserFactory.isUser;
  self.currentUser = {};

  self.logOut = function() {
    UserFactory.logOut().then(function() {
      $location.path('/login');
    });
  }

  self.goToDashboard = function() {
    $location.path('/dashboard');
  }

  $rootScope.$on('$routeChangeSuccess', function (next, last) {
    console.log("Nav controller detected a change in Angular route");
    getUser();
  });

  function getUser() {
    self.currentUser = UserFactory.getUser();
    self.isUser = UserFactory.userChecker();
    console.log("nav controllers get user: ", self.currentUser, self.isUser);
  }

}]);
