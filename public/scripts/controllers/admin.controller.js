app.controller('AdminController', ['UserFactory', '$http', "$mdDialog", "$timeout", function(UserFactory, $http, $mdDialog, $timeout) {
  const self = this;
  var currentUser = {};
  self.users = [];
  self.newUser = {};
  self.redId = false;
  self.greenId = true;

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
        greenRow();

      }).catch(function(err) {
        console.log("Error in user post");
      });
    });
  }

  function deleteUser(id) {
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
        console.log("Error in user post");
      });
    });
  }

  self.showConfirm = function(ev, id) {
    // Appending dialog to document.body to cover sidenav in docs app
    self.redId = id;
    var confirm = $mdDialog.confirm()
      .title('Are you sure you wish to delete user ' + self.users[id].first_name + ' ' + self.users[id].last_name + '?')
      .targetEvent(ev)
      .ok('Yes, delete user.')
      .cancel('No');
    $mdDialog.show(confirm).then(function() {
      deleteUser(id);
    }, function() {
      self.redId = false;
    });
  };

  function greenRow(id) {
    self.greenId = id;
    $timeout(function(){
      self.greenId = 0;
    }, 1000);
  }

}]);
