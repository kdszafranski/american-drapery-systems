app.controller('DashboardController', ["$firebaseAuth", "$http", function($firebaseAuth, $http) {
  var self = this;
  //var auth = $firebaseAuth();
  var currentUser = {};
  self.showDeclined = false;
  self.showCompleted = false;

  self.surveyList = [
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

  // auth.$onAuthStateChanged(function(firebaseUser){
  //   console.log('authentication state changed');
  //   // firebaseUser will be null if not logged in
  //   if(firebaseUser) {
  //     currentUser = firebaseUser;
  //     // This is where we make our call to our server
  //     firebaseUser.getToken().then(function(idToken){
  //       $http({
  //         method: 'GET',
  //         url: '/privateData',
  //         headers: {
  //           id_token: idToken
  //         }
  //       }).then(function(response){
  //         self.secretData = response.data;
  //       });
  //     });
  //   } else {
  //     console.log('Not logged in or not authorized.');
  //     self.secretData = [];
  //   }
  //
  // });



  self.filter = function() {
    self.filteredItems = self.surveyList;
    self.numResults = self.filteredItems.length;
  }
  self.filter();

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


  // self.logIn = function(){
  //   auth.$signInWithPopup("google").then(function(firebaseUser) {
  //     console.log("Firebase Authenticated as: ", firebaseUser.user.displayName);
  //   }).catch(function(error) {
  //     console.log("Authentication failed: ", error);
  //   });
  // };
  // self.logOut = function(){
  //   auth.$signOut().then(function(){
  //     console.log('Logging the user out!');
  //   });
  // }

}]);
