app.controller('DashboardController', ["$firebaseAuth", "$http", function($firebaseAuth, $http) {
  var self = this;
  //var auth = $firebaseAuth();
  var currentUser = {};
  self.showDeclined = true;
  self.testItems = [
    {
      survey_number: 2134,
      job_number: 54634,
      survey_date: "04/23/2014",
      status: "In Progress",
      client_name: "ACME",
      last_modified: "04/24/2014"
    },
    {
      survey_number: 2135,
      job_number: 54637,
      survey_date: "02/23/2014",
      status: "Completed",
      client_name: "DogCo",
      last_modified: "02/29/2014"
    },
    {
      survey_number: 2139,
      job_number: 54640,
      survey_date: "03/23/2014",
      status: "Declined",
      client_name: "CatCo",
      last_modified: "03/29/2014"
    }
  ];
  self.filter = function() {
    self.filteredItems = self.testItems;
  }

  self.logIn = function(){
    auth.$signInWithPopup("google").then(function(firebaseUser) {
      console.log("Firebase Authenticated as: ", firebaseUser.user.displayName);
    }).catch(function(error) {
      console.log("Authentication failed: ", error);
    });
  };
  // self.logOut = function(){
  //   auth.$signOut().then(function(){
  //     console.log('Logging the user out!');
  //   });
  // }


}]);
