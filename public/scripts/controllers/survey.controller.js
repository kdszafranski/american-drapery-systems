app.controller('SurveyController', ["$http", 'UserFactory', 'IdFactory',  function($http, UserFactory, IdFactory) {
  console.log("In Survey Controller");
  var self = this;
  var survey_id = IdFactory.getSurveyId();

  console.log("Id Factory: ", IdFactory.survey);
  console.log("Survey_id: ", survey_id);

  function getSurveyDetails() {
    currentUser = UserFactory.getUser();
    console.log("Current User", currentUser);
    currentUser.getToken()
    .then(function(idToken) {
        $http({
          method: 'GET',
          url: '/surveys/one/' + survey_id,
          headers: {
            id_token: idToken
          }
        }).then(function(response){
          self.surveyDetails = formatDates(response.data);
          console.log("Response From Server: ", self.surveyDetails);

          //Assigning Contact Information to variables in controller
          self.primary_contact_name = self.surveyDetails[0].primary_contact_name;
          self.primary_contact_phone_number = self.surveyDetails[0].primary_contact_phone_number;
          self.primary_contact_email = self.surveyDetails[0].primary_contact_email;

          //Only show alt contact if one exists
          if (self.surveyDetails[0].alt_contact_name !== null) {
            self.showAltContact = true;
            self.alt_contact_name = self.surveyDetails[0].alt_contact_name;
            self.alt_phone_number = self.surveyDetails[0].alt_phone_number;
            self.alt_contact_email = self.surveyDetails[0].alt_contact_email;
          } else {
            self.showAltContact = false;
          }

          //Seperate measurements into areas
          var separateAreas = groupBy(self.surveyDetails, 'area_name');
          console.log(separateAreas);
          self.areaArray = [];
          for (x in separateAreas) {
            self.areaArray.push(separateAreas[x]);
          }
          self.areaArray
          console.log('areaArray', self.areaArray);
        },
        function(err) {
          console.log("error getting survey details: ", err);
        });
    })}

  getSurveyDetails();
}]);

//Function to group measurements by area
function groupBy(arr, property) {
  return arr.reduce(function(memo, x) {
    if (!memo[x[property]]) { memo[x[property]] = []; }
    memo[x[property]].push(x);
    return memo;
  }, {});
}
