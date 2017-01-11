app.controller('DashboardController', ['UserFactory', '$http', '$location', function(UserFactory, $http, $location) {
  const self = this;
  var currentUser = {};
  var surveyList = [];
  self.currentPage = 0;
  self.pageSize = 20;

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
        surveyList = formatData(response.data);
        self.statusFilter(self.show);
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
  }

  self.newJob = function() {
    $location.path('/profile');
  }

}]);
