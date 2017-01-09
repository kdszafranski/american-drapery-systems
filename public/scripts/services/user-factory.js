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
    // const deffered = $q.defer();
    console.log("Running logIn fxn in user-factory");
    //Sign in with popup message using google credentials
     return auth.$signInWithPopup("google").then((firebaseUser) => {
      //Assign result of signin to current user object
      currentUser = firebaseUser;
      //Log user's email
      console.log("Firebase User: ", firebaseUser, firebaseUser.user.email);
      //Get idToken
      currentUser.user.getToken().then((idToken) => {
        //GET request to /dashboard route, send idToken in header
        $http({
          method: 'GET',
          url: '/dashboard',
          headers: {
            id_token: idToken
          }
        }).then((response) => { //when $http promise resolved:
          console.log("I'm back form the GET request! res: ", response);

          // deffered.resolve(response);
        });
      });
      // return deffered.promise;
    });
  }

  function logOut() {
    console.log("Running logOut fxn in user-factory");
    auth.$signOut().then(() => {
      console.log("User succesfully logged out");
    });
  }

  function getUser() {
    return currentUser;
  }

  var publicApi = {
    logIn: () => logIn(),
    logOut: () => logOut(),    
    getUser: () => getUser()
  };

  return publicApi;

}]);
