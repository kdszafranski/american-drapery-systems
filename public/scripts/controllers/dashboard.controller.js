app.controller('DashboardController', ['UserFactory', 'IdFactory', '$http', '$location', '$scope', function(UserFactory, IdFactory, $http, $location, $scope) {
  const self = this;
  var currentUser = {};
  var surveyList = [];
  self.statusOptions = ['Pending', 'Dispatched', 'Completed', 'Declined'];
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
  console.log(self.totalPages(0), self.totalPages(1), self.totalPages(19), self.totalPages(20), self.totalPages(21));

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
      },
      function(err) {
        console.log("error getting survey details: ", err);
      });
    });
  }

}]);
