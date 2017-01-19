
app.controller('NavController', ["UserFactory", "$location", "$scope",
function(UserFactory, $location, $scope) {
  console.log("Nav controller is running!");
  const self = this;
  self.isUser = false;
  self.currentUser = {};

    UserFactory.auth.$onAuthStateChanged(function(firebaseUser){
      // firebaseUser will be null if not logged in
      self.currentUser = firebaseUser;
      console.log("\n\n\n onAuth ran in nav controller \n\n\n");

      if (self.currentUser) {
        //check if user is authorized in DB
        UserFactory.userChecker()
          .then(function(response) {
            console.log("\n\nNavController response: ", response + '\n\n');
            //if authorized, self.isUser is true
            self.isUser = true;
          })
          .catch(function(err) {
            console.log("\n\nNavController error: ", err + '\n\n');
            //if not authorized, log out (also changes route to /login)
            self.isUser = false;
            self.logOut()
          });
      } else {
        //user not authenticated with firebase
        self.isUser = false;
        self.currentUser.displayName = "";
        $location.path('/login');
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
  self.goToAdmin = function() {
    $location.path('/admin');
  }

  // $rootScope.$on('$routeChangeSuccess', function (next, last) {
  //   console.log("Nav controller detected a change in Angular route");
  //   getUser();
  // });

  function getUser() {
    self.currentUser = UserFactory.getUser();
    self.isUser = UserFactory.userChecker();
    console.log("nav controllers get user: ", self.currentUser, self.isUser);
  }



}]);
