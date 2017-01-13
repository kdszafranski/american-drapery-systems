
app.controller('NavController', ["UserFactory", "$location", "$rootScope",
function(UserFactory, $location, $rootScope) {
  console.log("Nav controller is running!");
  const self = this;
  self.isUser = UserFactory.isUser;
  self.currentUser = {};

    UserFactory.auth.$onAuthStateChanged(function(firebaseUser){
      // firebaseUser will be null if not logged in
      self.currentUser = firebaseUser;
      console.log("onAuthStateChanged Nav", self.currentUser);
      if (self.currentUser) {
        self.isUser = true;
        $location.path('/dashboard');
      }
      if (self.currentUser.displayName == null) {
        self.currentUser.displayName = "need to log in";
      }
    });

  self.logOut = function() {
    UserFactory.logOut().then(function() {
      $location.path('/login');
      self.currentUser.displayname = "";
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
