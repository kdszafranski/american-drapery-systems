app.controller('DashboardController', ['UserFactory', '$http', function(UserFactory, $http) {
  const self = this;
  var currentUser = {};

  self.logIn = function() {
    console.log("Login clicked, running logIn fxn in dashboard controller");
    UserFactory.logIn().then(function() {
      console.log('test');
      getSurveys();
    });
  };

  self.logOut = function() {
    console.log("Logout clicked, running logOut fxn in dashboard controller");
    UserFactory.logOut();
    currentUser = {};
  };

  self.showDeclined = false;
  self.showCompleted = false;
  self.surveyList = [];
  var standardList = [];
  var completedList = [];
  var declinedList = [];

  function getSurveys(){
    currentUser = UserFactory.getUser();
    console.log('getting surveys - currentUser:', currentUser);
    currentUser.user.getToken().then(function(idToken) {
      $http({
        method: 'GET',
        url: '/surveys/all/',
        headers: {
          id_token: idToken
        }
      }).then(function(response){
        console.log('success');
        standardList = formatData(response.data);
        self.surveyList = standardList;
      });
    });
  }

  self.completed = function(toShow) {
    if(toShow == true) {
      completedList = getMore('Completed');
    } else {
      completedList = [];
      buildSurveyList();
    }
  }

  self.declined = function(toShow) {
    if(toShow == true) {
      declinedList = getMore('Declined');
    } else {
      declinedList = [];
      buildSurveyList();
    }
  }

  function getMore(jobStatus) {
    currentUser = UserFactory.getUser();
    console.log('getting surveys - status type', jobStatus);
    currentUser.user.getToken().then(function(idToken) {
      $http({
        method: 'GET',
        url: '/surveys/all/' + jobStatus,
        headers: {
          id_token: idToken
        }
      }).then(function(response){
        console.log('success');
        console.log('more response', response.data);
        self.surveyList.concat(formatData(response.data));
        console.log('surveylist', self.surveyList);
      });
    });
  }

  function formatData(surveys){
    console.log(surveys);
    for (var i = 0; i < surveys.length; i++) {
      surveys[i].last_modified = moment(surveys[i].last_modified).format("YYYY/MM/DD");
      surveys[i].survey_date = moment(surveys[i].survey_date).format("YYYY/MM/DD");
    }
    return surveys;
  }

  function buildSurveyList() {
    console.log('lists', standardList, completedList, declinedList);
    self.surveyList.concat(standardList, completedList, declinedList);
  }


}]);
