app.controller('MeasurementAreaController', ["$http", 'IdFactory', '$location', 'UserFactory', 'InfoFactory', '$route',
function($http, IdFactory, $location, UserFactory, InfoFactory, $route) {
  var self = this;
  // var survey_id = IdFactory.getSurveyId();
  var surveyId = $route.current.params.surveyId;
  self.loading = false;
  self.showInput = false
  self.currentProfile = {};
  var currentUser;
  var areaId;

  self.newAreaName = '';
  self.inputAreaName = false;
  //function to send area to measurent controller
  self.setArea = function(index) {
    console.log("index: ", index);
    areaId = self.areaArrayId[index];
    IdFactory.setArea(areaId);

    $location.path('/measurement/' + surveyId + '/' + areaId);
  }


  //function to add a new area
  self.showInput = function() {
    self.inputAreaName = true;
  }
  self.addNote = function(){
    console.log("addnote clicked");
  }
  self.addNewArea = function() {
    console.log("Clicked Add New Area:");
    self.inputAreaName = false;
    self.newArea = {
      area_name: self.newAreaName,
      survey_id: surveyId
    }
    console.log("New Area Object: ", self.newArea);
    // currentUser = UserFactory.getUser();

    currentUser.getToken()
      .then(function(idToken) {
        $http({
          method: 'POST',
          url: '/areas/',
          data: self.newArea,
          headers: {
            id_token: idToken
          }
        }).then(function(response){
          console.log("Response from new area post: ", response.data[0].id);
          //We shouldn't really need to do this anymore, as we're storing this info in the url now
          areaId = response.data[0].id;
          IdFactory.setArea(areaId);
          //We do need to do this now.
          $location.path('/measurement/' + surveyId + '/' + areaId);
        },
        function(err) {
          console.log("error getting survey details: ", err);
        });
    })
  }

  //Edit client profile button
  self.editClient = function(){
    console.log("clicked");
    self.showInput = !self.showInput;



  }
  //save edits to client profile button
  self.updateClient = function(){
    var clientId = self.currentProfile.client_id;
    // var currentUser = UserFactory.getUser();
    currentUser.getToken()
    .then(function(idToken) {
      $http({
        method: 'POST',
        url: '/clients/'+ clientId,
        data: self.currentProfile,
        headers: {
          id_token: idToken
        }
      }).then(function(response){
        console.log("Response from new area post: ", response.data);
        self.showInput = !self.showInput;
      },
      function(err) {
        console.log("error getting survey details: ", err);
      });
    });
  }
  //function to handle clicking of an already existing area

  //function to get all areas associated with survey
  function getSurveyDetails(firebaseUser) {
    console.log("SURVEY ID\n\n", surveyId);
    firebaseUser.getToken()
      .then(function(idToken) {
        $http({
          method: 'GET',
          url: '/surveys/one/' + surveyId,
          headers: {
            id_token: idToken
          }
        })
        .then(function(response){
          console.log("GETTING AREAS FOR SURVEY \n\n");
          self.surveyDetails = response.data;
          console.log("Response From Server: ", self.surveyDetails);
          self.companyInfo = self.surveyDetails[0];
          self.areaArray = self.surveyDetails.map(survey => survey.area_name);
          console.log("Area Array: ", self.areaArray);
          self.areaArrayId = self.surveyDetails.map(survey => survey.id);
          console.log("Area ID: ", self.areaArrayId);
          self.currentProfile = self.companyInfo;
          InfoFactory.companyInfo = self.companyInfo;
          self.loading = true;
        },
        function(err) {
          console.log("error getting survey details: ", err);
        });
    })

  }
  // getSurveyDetails(firebaseUser);
  //This happens when when we switch to this view/controller AND when page is refreshed
  UserFactory.auth.$onAuthStateChanged(function(firebaseUser) {
    currentUser = firebaseUser;
    getSurveyDetails(firebaseUser);
  });

}]);

//Function to group measurements by area
function groupBy(arr, property) {
  return arr.reduce(function(memo, x) {
    if (!memo[x[property]]) { memo[x[property]] = []; }
    memo[x[property]].push(x);
    return memo;
  }, {});
}
