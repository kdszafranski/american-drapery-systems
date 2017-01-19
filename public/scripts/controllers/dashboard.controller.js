app.controller('DashboardController', ['UserFactory', 'IdFactory', '$http', '$location', '$scope', '$mdToast', "$mdDialog", function(UserFactory, IdFactory, $http, $location, $scope, $mdToast, $mdDialog) {

  const self = this;
  var currentUser = {};
  var surveyList = [];
  self.statusOptions = ['Pending', 'Dispatched', 'Completed', 'Declined'];
  self.currentPage = 0;
  self.pageSize = 20;
  self.filtered = [];
  self.loading = false;
  self.sortType     = 'id'; // set the default sort type
  self.sortReverse  = true;  // set the default sort order


  self.show = {
    completed: true,
    declined: true,
    dispatched: true,
    pending: true,
    text: function () {
      var ret = [];
      var compBool = (!this.completed && "Completed");
      var dispBool = (!this.dispatched && "Dispatched");
      var pendBool = (!this.pending && "Pending");
      var decBool = (!this.declined && "Declined");
      if (compBool) { ret.push(compBool) }
      if (decBool) { ret.push(decBool) }
      if (dispBool) { ret.push(dispBool) }
      if (pendBool) { ret.push(pendBool) }
      return ret;
    }
  }

  UserFactory.auth.$onAuthStateChanged(function(firebaseUser){
    currentUser = firebaseUser;
    getSurveys();
    console.log("onAuthStateChanged", currentUser);
  });

  function getSurveys() {
    // currentUser = UserFactory.getUser();
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
      .title('Are you sure you wish to delete survey # ' + id + ', along with all associated areas, measurements and files?')
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
    console.log("\n\nsurveyId in dash.survey: ", surveyId);
    $location.path('/survey/' + surveyId);
  }
  self.area = function(surveyId) {
    IdFactory.setSurvey(surveyId)
    $location.path('/area/' + surveyId);
  }

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

  self.totalPages = function (num) {
    var total = 0;
    if (num) {
      total = parseInt(((num - 1) / self.pageSize) + 1);
    }
    return total;
  }

  self.changeStatus = function(survey_id) {
    console.log("Select Changed - Survey Id is: ", survey_id);

    //Find the index of the survey that has been changed to capture the status change
    var indexOfSurvey = self.filtered.findIndex(item => item.id === survey_id);
    console.log("Index of changed survey: ", self.filtered[indexOfSurvey].status);
    self.statusUpdate = {
      status: self.filtered[indexOfSurvey].status,
      last_modified: new Date()
    }
    var currentUser = UserFactory.getUser();
    currentUser.getToken()
    .then(function(idToken) {
      $http({
        method: 'PUT',
        url: '/surveys/status/'+ survey_id,
        data: self.statusUpdate,
        headers: {
          id_token: idToken
        }
      }).then(function(response){
        console.log("Response from new area post: ", response);
        console.log("survey_id", survey_id);

        $mdToast.show(
          $mdToast.simple()
          .textContent('Updated')
          .position('top left' )
          .hideDelay(2000)
          .parent('#row'+ survey_id)
        );
      },
      function(err) {
        console.log("error getting survey details: ", err);
      });
    });
  }

}]);
