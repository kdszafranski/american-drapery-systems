app.controller('LoginController', ['UserFactory', '$location', function(UserFactory, $location, TestFactory) {
  console.log("LoginController is running");

  const self = this;

  self.logIn = function() {

    UserFactory.logIn()
    .then(function() {
      console.log(".then() happened in login controller");
      $location.path('/dashboard');
    })
    .catch(function() {
      console.log("Could not log in!");
      UserFactory.logOut();
    })
  };

}]);
