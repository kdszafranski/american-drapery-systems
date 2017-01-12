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
    changeSurvey: function(data) {
      console.log('changing survey to ', data);
      id.survey = data;
    }
  }
});
