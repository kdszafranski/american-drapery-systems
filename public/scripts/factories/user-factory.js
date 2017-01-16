/******************
Create UserFactory
*******************/
app.factory('UserFactory', ['$firebaseAuth', "$http",
function($firebaseAuth, $http) {
  console.log("User Factory is running!");
  //Auth is constant (won't change), assign to $firebaseAuth()
  const auth = $firebaseAuth();
  //Instantiate currentUser object
  var currentUser = {};
  var isUser = false;
  //logIn fxn, called when logIn button clicked
  function logIn() {
    console.log("Running logIn fxn in user-factory");
    //Sign in with popup message using google credentials
      return auth.$signInWithPopup("google").then(function(firebaseUser) {
      //Assign result of signin to current user object
      currentUser = firebaseUser;
      isUser = true;
      //Log user's email
      console.log("Firebase User: ", firebaseUser.user.email);
      //Get idToken
      return currentUser.user.getToken().then(function(idToken) {
        //GET request to /dashboard route, send idToken in header
         return $http({
          method: 'GET',
          url: '/users',
          headers: {
            id_token: idToken
          }
        }).then(function(response) { //when $http promise resolved:
          console.log("Retrieved this data from server at login: ", response);
          isUser = true;
        });
      });
    });

  }//End login fxn

  //Check authorization satus
  auth.$onAuthStateChanged(function(firebaseUser){
    // firebaseUser will be null if not logged in
    currentUser = firebaseUser;
    console.log("onAuthStateChanged", currentUser);
    if(firebaseUser) {
      isUser = true;
    }
  });

  /**********************************************
  //Lougout fxn, runs when logout btn is clicked
  ***********************************************/
  function logOut() {
    console.log("Running logOut fxn in user-factory");
    //Firebase sign out method
     return auth.$signOut().then(function() {
      console.log("User succesfully logged out");
      isUser = false;
    });
  }//End logout fxn
  /************************************
  Function to be called in controllers
  that need access to currentUser
  *************************************/
  function getUser() {
    return currentUser;
  }
  /************************************
  function to be called in controllers
  that need to ngShow/Hide buttons
  *************************************/
  function userChecker() {
    return isUser;
  }
  /*********************
  Put all functions
  into publicApi object
  ***********************/
  var publicApi = {
    logIn: function() {
      return logIn();
    },
    logOut: function() {
      return logOut();
    },
    getUser: function() {
      return getUser();
    },
    userChecker: function() {
      return userChecker();
    },
    auth: auth,
    isUser: isUser
  };
  /*************************
  Return publicApi object
  so controllers can access
  **************************/
  return publicApi;

}]);
