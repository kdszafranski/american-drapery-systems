app.controller('DashboardController', ['UserFactory', '$http', function(UserFactory, $http) {
  const self = this;
  //var auth = $firebaseAuth();
  var currentUser = {};

  self.logIn = () => {
    console.log("Login clicked, running logIn fxn in dashboard controller");
    UserFactory.logIn().then(() => {
      self.currentUser = UserFactory.getUser();
    });
  };

  self.logOut = () => {
    console.log("Logout clicked, running logOut fxn in dashboard controller");
    UserFactory.logOut();
    self.currentUser = false;
  };

  self.showDeclined = false;
  self.showCompleted = false;

  // self.surveyList = [
  //   {
  //     survey_number: 2134,
  //     job_number: 54634,
  //     survey_date: "04/23/2014",
  //     status: "In Progress",
  //     client_name: "ACME",
  //     last_modified: "04/24/2014"
  //   },
  //   {
  //     survey_number: 2135,
  //     job_number: 54637,
  //     survey_date: "02/23/2014",
  //     status: "Completed",
  //     client_name: "DogCo",
  //     last_modified: "02/29/2014"
  //   },
  //   {
  //     survey_number: 2139,
  //     job_number: 54640,
  //     survey_date: "03/23/2014",
  //     status: "Declined",
  //     client_name: "CatCo",
  //     last_modified: "03/29/2014"
  //   }
  // ];

  getSurveys();

  // Get all people
  function getSurveys() {
    $http.get('/surveys/all')
    .then(function(response) {
      formatData(response.data);
      self.filter();
    },
    function(response) {
      console.log('get error:', response);
    });
  }

  function formatData(surveys){
    console.log(surveys);
    for (var i = 0; i < surveys.length; i++) {
      surveys[i].last_modified = moment(surveys[i].last_modified).format("YYYY-MM-DD");
      surveys[i].survey_date = moment(surveys[i].survey_date).format("YYYY-MM-DD");
    }
    self.surveyList = surveys;
  }


  self.filter = function() {
    self.filteredItems = self.surveyList;
    self.numResults = self.filteredItems.length;
  }

}]);
