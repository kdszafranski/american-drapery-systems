app.controller('NavController', ["UserFactory", "$location", function(UserFactory, $location) {
  console.log("Nav controller is running!");
  //
  const self = this;
  // self.showStuff = true;
  //
  // var currentUser = UserFactory.getUser();
  //
  // if(currentUser != {}) {
  //   self.showStuff = true;
  // }
  self.logOut = function() {
    UserFactory.logOut();
    $location.path('/login');
  };

  self.dash = function() {
    $location.path('/dashboard');
  };

}]);
