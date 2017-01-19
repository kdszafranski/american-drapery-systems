app.controller('DashboardController', ['UserFactory', 'IdFactory', '$http', "$mdDialog", '$location', '$scope', function(UserFactory, IdFactory, $http, $mdDialog, $location, $scope) {
  const self = this;
  var currentUser = {};
  var surveyList = [];
  self.currentPage = 0;
  self.pageSize = 20;
  self.filtered = [];
  self.loading = false;
  self.sortType     = 'last_modified'; // set the default sort type
  self.sortReverse  = false;  // set the default sort order
  self.pageCheck = function(numResults) {
    var total = self.totalPages(numResults);
    console.log('total', total);
    console.log('old currentpage', self.currentPage);

    if (self.currentPage >= total || ((self.currentPage == -1) && total)) {
      self.currentPage = total -1 ;
    }
    console.log('new currentpage', self.currentPage);
    $scope.$apply;
    console.log('scope currentpage', self.currentPage);

  }

  self.show = {
    completed: false,
    declined: false,
    text: function () {
      var ret = [];
      var compBool = (!this.completed && "Completed");
      var decBool = (!this.declined && "Declined");
      if (compBool) {
        ret.push(compBool);
      }
      if (decBool) {
        ret.push(decBool);
      }
      return ret;
    }
  }

  UserFactory.auth.$onAuthStateChanged(function(firebaseUser){
    currentUser = firebaseUser;
    getSurveys();
    console.log("onAuthStateChanged", currentUser);
  });
  function getSurveys() {
    currentUser = UserFactory.getUser();
    console.log('getting surveys - currentUser:', currentUser);
    currentUser.getToken().then(function(idToken) {
      $http({
        method: 'GET',
        url: '/surveys/all',
        headers: {
          id_token: idToken
        }
      }).then(function(response){
        console.log('success');
        self.filtered = formatDates(response.data);
        self.loading = true;
      });
    });
  }

  self.showConfirm = function(ev, id) {
    // Appending dialog to document.body to cover sidenav in docs app
    var confirm = $mdDialog.confirm()
      .title('Are you sure you wish to delete survey # ' + id + ', along with all associated areas and measurements?')
      .targetEvent(ev)
      .ok('Yes. Delete survey.')
      .cancel('No. Go back to dashboard');
    $mdDialog.show(confirm).then(function() {
      deleteSurvey(id);
    }, function() {
    });
  };

  function deleteSurvey(id) {
    console.log("remove survey ", id);
    var currentUser = UserFactory.getUser();
    currentUser.getToken()
    .then(function(idToken) {
        $http({
          method: 'DELETE',
          url: '/surveys/' + id,
          headers: {
            id_token: idToken
          }
        }).then(function(response) {
          console.log("Response from survey route: ", response);
          getSurveys();
        }).catch(function(err) {
          console.log("Error in survey delete");
        });
    });
  }


  self.newJob = function() {
    $location.path('/profile');
  }
  self.survey = function(surveyId) {
    IdFactory.setSurvey(surveyId);
    $location.path('/survey');
  }
  self.area = function(surveyId) {
    IdFactory.setSurvey(surveyId)
    $location.path('/area');
  }

  self.totalPages = function (num) {
    var total = 0;
    if (num) {
      total = parseInt(((num - 1) / self.pageSize) + 1);
    }
    return total;
  }

}]);
