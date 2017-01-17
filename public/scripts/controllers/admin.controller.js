app.controller('AdminController', ['UserFactory', 'IdFactory', '$http', '$location', function(UserFactory, IdFactory, $http, $location) {
  const self = this;
  var currentUser = {};
  self.users = [];
  self.newUser = {};

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
        method: 'postClients',
        url: '/users/',
        data: newUser,
        headers: {
          id_token: idToken
        }
      }).then(function(response){
        console.log('success');
        $location.path('/admin');
      }).catch(function(err) {
        console.log("Error in user post");
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
        $location.path('/admin');
      }).catch(function(err) {
        console.log("Error in user post");
      });
    });
  }

}]);
