app.controller('AdminController', ['UserFactory', '$http', function(UserFactory, $http) {
  const self = this;
  var currentUser = {};
  self.users = [];
  self.newUser = {};
  self.unauthorized = false;

  UserFactory.auth.$onAuthStateChanged(function(firebaseUser){
    // firebaseUser will be null if not logged in
    currentUser = firebaseUser;
    getUsers();
    console.log("onAuthStateChanged", currentUser);
  });

  function getUsers() {
    currentUser = UserFactory.getUser();
    console.log('getting users - currentUser:', currentUser);
    currentUser.getToken().then(function(idToken) {
      $http({
        method: 'GET',
        url: '/users/all',
        headers: {
          id_token: idToken
        }
      }).then(function(response){
        console.log('success');
        self.users = response.data;
        self.loading = true;
      });
    });
  }

  self.addUser = function(newUser) {
    newUser.authorized = true;
    currentUser = UserFactory.getUser();
    console.log('adding user - newuser:', newUser);
    currentUser.getToken().then(function(idToken) {
      $http({
        method: 'POST',
        url: '/users/',
        data: newUser,
        headers: {
          id_token: idToken
        }
      }).then(function(response){
        console.log('success');
        getUsers();
      }).catch(function(err) {
        console.log("Error in user post");
        if (err.status === 403) {
          self.unauthorized = true;
          console.log("In error 403: ", self.unauthorized);
        }
      });
    });
  }

  self.deleteUser = function(id) {
    currentUser = UserFactory.getUser();
    currentUser.getToken().then(function(idToken) {
      $http({
        method: 'DELETE',
        url: '/users/' + id,
        headers: {
          id_token: idToken
        }
      }).then(function(response){
        console.log('delete success');
        getUsers();
      }).catch(function(err) {

        console.log("Error in user post: ", err);
        if (err.status === 403) {
          self.unauthorized = true;
          console.log("In error 403: ", self.unauthorized);
        }
      });
    });
  }

}]);
