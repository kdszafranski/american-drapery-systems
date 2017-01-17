app.controller('DashboardController', ['UserFactory', 'IdFactory', '$http', '$location', '$scope',  function(UserFactory, IdFactory, $http, $location, $scope) {
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
      self.currentPage = total ;
    }
    console.log('new currentpage', self.currentPage);
    $scope.$apply;
    console.log('scope currentpage', self.currentPage);

  }

  self.show = {
    completed: false,
    declined: false,
    compare: function (status) {
      var compBool = (!this.completed && (status == "Completed"));
      var decBool = (!this.declined && (status == "Declined"));
      return compBool || decBool;
    }
  }

  UserFactory.auth.$onAuthStateChanged(function(firebaseUser){
    // firebaseUser will be null if not logged in
    currentUser = firebaseUser;
    getSurveys();
    console.log("onAuthStateChanged", currentUser);
  });
  function getSurveys() {
    currentUser = UserFactory.getUser();
    console.log('getting surveys - currentUser:', currentUser);
    currentUser.getToken().then(function(idToken) {
    // var idToken = true;
      $http({
        method: 'GET',
        url: '/surveys/all',
        headers: {
          id_token: idToken
        }
      }).then(function(response){
        console.log('success');
        surveyList = formatDates(response.data);
        self.statusFilter(self.show);
        self.loading = true;
      });
    });
  }

  self.statusFilter = function(show, ary) {
    self.filtered = [];
    for (var i = 0; i < surveyList.length; i++) {
      if(!show.compare(surveyList[i].status)) {
        self.filtered.push(surveyList[i]);
      }
    }
    console.log('filtered 0', self.filtered[0]);
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

}]);
