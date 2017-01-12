app.factory("IdFactory", function($interval)
{
  var id={
    survey: 0,
    area: 0,
    measurement: 0,
    client: 0
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
    setClient: function(newId) {
      console.log('changing survey to ', newId);
      id.client = newId;
    }
  }
});
