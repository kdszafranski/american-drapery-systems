app.controller('DashboardController', ['UserFactory', 'IdFactory', '$http', '$location', function(UserFactory, IdFactory, $http, $location) {
  const self = this;
  var currentUser = {};
  var surveyList = [];
  self.currentPage = 0;
  self.pageSize = 20;
  self.filtered = [];
  self.loading = false;
  
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
        surveyList = formatData(response.data);
        self.statusFilter(self.show);
        self.loading = true;
      });
    });
  }

  function formatData(surveys){
    //convert the ISO Dates to readable format
    for (var i = 0; i < surveys.length; i++) {
      surveys[i].last_modified = moment(surveys[i].last_modified).format("YYYY/MM/DD");
      surveys[i].survey_date = moment(surveys[i].survey_date).format("YYYY/MM/DD");
    }
    return surveys;
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
