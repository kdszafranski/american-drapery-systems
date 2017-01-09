app.controller('DashboardController', ["$firebaseAuth", "$http", function($firebaseAuth, $http) {
  var self = this;
  var auth = $firebaseAuth();
  var currentUser = {};

  self.logIn = function(){
    auth.$signInWithPopup("google").then(function(firebaseUser) {
      console.log("Firebase Authenticated as: ", firebaseUser.user.displayName);
    }).catch(function(error) {
      console.log("Authentication failed: ", error);
    });
  };
  self.logOut = function(){
    auth.$signOut().then(function(){
      console.log('Logging the user out!');
    });
  }

}]);
