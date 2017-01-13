app.controller('DashboardController', ['UserFactory', 'IdFactory', '$http', '$location', function(UserFactory, IdFactory, $http, $location) {
  const self = this;
  var currentUser = {};
  var surveyList = [];
  self.currentPage = 0;
  self.pageSize = 20;
  self.filtered = [];

  self.show = {
    completed: false,
    declined: false,
    compare: function (status) {
      var compBool = (!this.completed && (status == "Completed"));
      var decBool = (!this.declined && (status == "Declined"));
      return compBool || decBool;
    }
  }
  getSurveys();

  function getSurveys() {
    currentUser = UserFactory.getUser();
    console.log('getting surveys - currentUser:', currentUser);
    currentUser.user.getToken().then(function(idToken) {
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
      });
    });
  }

  self.statusFilter = function(show) {
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
    return parseInt(num / self.pageSize) + 1;
  }
}]);
