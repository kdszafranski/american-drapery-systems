app.controller('DashboardController', ['UserFactory', 'IdFactory', '$http', '$location', '$scope', "$mdDialog", "$timeout", function(UserFactory, IdFactory, $http, $location, $scope, $mdDialog, $timeout) {

  const self = this;
  var currentUser = {};
  var surveyList = [];
  self.statusOptions = ['Pending', 'Dispatched', 'Completed', 'Declined'];
  self.redId = 0;
  self.greenId = 0;
  self.loggedOut = false;

  UserFactory.auth.$onAuthStateChanged(function(firebaseUser){
    if (!firebaseUser) {
      console.log("No User");
      self.loggedOut = true;
      $timeout(function() {
        $location.path('/login');
      }, 3000);
    }
    currentUser = firebaseUser;
    getSurveys();
    console.log("onAuthStateChanged", currentUser);
  });

  function getSurveys() {
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
    self.redId=id;
    console.log('red id', id);
    // Appending dialog to document.body to cover sidenav in docs app
    var confirm = $mdDialog.confirm()
      .title('Are you sure you wish to delete survey #' + id + ', along with all associated areas, measurements and files?')
      .targetEvent(ev)
      .ok('Yes. Delete survey.')
      .cancel('No. Go back to dashboard');
    $mdDialog.show(confirm).then(function() {
      deleteSurvey(id);
    }, function() {
      self.redId=0;
    });
  };

  function deleteSurvey(id) {
    console.log("remove survey ", id);
    currentUser = UserFactory.getUser();
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
          self.redId=0;
          removeObjById(self.filtered, id);
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

  self.changeStatus = function(survey_id, status) {
    console.log("Select Changed - Survey Id is: ", survey_id);
    self.statusUpdate = {
      status: status,
      last_modified: new Date()
    }
    currentUser = UserFactory.getUser();
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
        console.log("Response from status update: ", response);
        greenTimout(survey_id);
      },
      function(err) {
        console.log("error updating status: ", err);
      });
    });
  }

  function greenTimout(id) {
    self.greenId = id;
    console.log('green id', id);
    $timeout(function(){
      self.greenId = 0;
    }, 1000);
  }

  /***************************ANGULAR SEARCH FILTER ***************************/
  self.currentPage = 0;
  self.pageSize = 20;
  self.filtered = [];
  self.loading = false;
  self.sortType = 'id'; // set the default sort type
  self.sortReverse = true;  // set the default sort order
  self.show = {
    options: ['Pending', 'Dispatched', 'Completed', 'Declined'],
    statuses: [true, true, true, true],
    text: function () {
      var ret = [];
      var pendBool = (!this.statuses[0] && this.options[0]);
      var dispBool = (!this.statuses[1] && this.options[1]);
      var compBool = (!this.statuses[2] && this.options[2]);
      var decBool = (!this.statuses[3] && this.options[3]);
      if (compBool) { ret.push(compBool) }
      if (decBool) { ret.push(decBool) }
      if (dispBool) { ret.push(dispBool) }
      if (pendBool) { ret.push(pendBool) }
      return ret;
    }
  }
  self.pageCheck = function(numResults) {
    var total = self.totalPages(numResults);
    if (self.currentPage >= total || ((self.currentPage == -1) && total)) {
      self.currentPage = total -1 ;
    }
  }
  self.totalPages = function (num) {
    var total = 0;
    if (num) {
      total = parseInt(((num - 1) / self.pageSize) + 1);
    }
    return total;
  }

}]);
