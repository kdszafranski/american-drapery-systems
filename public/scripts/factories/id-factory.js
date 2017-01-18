app.factory("IdFactory", function($interval)
{
  var id={
    survey: 0,
    area: 0,
    measurement: 0,
    client: 0,
    newArea: false,
    newSurvey: false
  };
  return {
    id: id,
    setSurvey: function(newId) {
      console.log('changing survey to ', newId);
      id.survey = newId;
    },
    setArea: function(newId) {
      console.log('changing survey to ', newId);
      id.area = newId;
    },
    setMeasurement: function(newId) {
      console.log('changing survey to ', newId);
      id.measurement = newId;
    },
    setNewSurvey: function(name) {
      id.newSurvey = name;
    },
    setNewArea: function(name) {
      id.newArea = name;
    },
    setClient: function(newId) {
      console.log('changing survey to ', newId);
      id.client = newId;
    },
    getSurveyId: function() {
      return id.survey;
    },
    getAreaId: function() {
      return id.area;
    },
    getNewArea: function() {
      return id.newArea;
    },
    getNewSurvey: function() {
      return id.newMeasurement;
    }
  }
});
