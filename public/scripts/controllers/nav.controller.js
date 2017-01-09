app.controller('NavController', ["UserFactory", "$scope",
function(UserFactory, $scope) {
  console.log("Nav controller is running!");
  const self = this;

  self.showNav = false;

  self.currentUser = UserFactory.getUser();






  // self.currentUser = UserFactory.getUser();


}]);
