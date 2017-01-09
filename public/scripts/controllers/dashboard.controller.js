app.controller('DashboardController', ["UserFactory", function(UserFactory) {
  console.log("DashboardController is running");
  const self = this;
  self.currentUser = false;
  self.x = "text";

  self.logIn = () => {
    console.log("Login clicked, running logIn fxn in dashboard controller");
    UserFactory.logIn().then(() => {
      self.currentUser = UserFactory.getUser();
    });
  };

  self.logOut = () => {
    console.log("Logout clicked, running logOut fxn in dashboard controller");
    UserFactory.logOut();
    self.currentUser = false;
  };

}]);
