/******************
Create UserFactory
*******************/
app.factory('UserFactory', ['$firebaseAuth', "$http", "$q",
function($firebaseAuth, $http, $q) {
  console.log("User Factory is running!");
  //Auth is constant (won't change), assign to $firebaseAuth()
  const auth = $firebaseAuth();
  //Instantiate currentUser object
  var currentUser = {};
  //logIn fxn, called when logIn button clicked
  function logIn() {
    console.log("Running logIn fxn in user-factory");
    //Sign in with popup message using google credentials
     return auth.$signInWithPopup("google").then(function(firebaseUser) {
      //Assign result of signin to current user object
      currentUser = firebaseUser;
      //Log user's email
      console.log("Firebase User: ", firebaseUser, firebaseUser.user.email);
      //Get idToken
      currentUser.user.getToken().then(function(idToken) {
        //GET request to /dashboard route, send idToken in header
        $http({
          method: 'GET',
          url: '/users',
          headers: {
            id_token: idToken
          }
        }).then(function(response) { //when $http promise resolved:
          console.log("I'm back form the GET request! res: ", response);
        });
      });
    });
  }//End login fxn
  /**********************************************
  //Lougout fxn, runs when logout btn is clicked
  ***********************************************/
  function logOut() {
    console.log("Running logOut fxn in user-factory");
    //Firebase sign out method
    auth.$signOut().then(function() {
      console.log("User succesfully logged out");
    });
  }//End logout fxn
  /************************************
  Function to be called in controllers
  that need access to currentUser
  *************************************/
  function getUser() {
    return currentUser;
  }
  /*********************
  Put all functions
  into publicApi object
  ***********************/
  var publicApi = {
    logIn: function() {
      return logIn()
    },
    logOut: function() {
      return logOut()
    },
    getUser: function() {
      return getUser()
    }
  };
  /*************************
  Return publicApi object
  so controllers can access
  **************************/
  return publicApi;

}]);
