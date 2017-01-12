app.factory("idFactory", function($interval)
{
  var id={
    survey: 0,
    area: 0,
    measurement: 0,
    client: 0
  };
  return {
    id: id,
    changeData: function() {
      id.value++;
    }
  }
});
