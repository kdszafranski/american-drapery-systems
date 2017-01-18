app.factory("InfoFactory", function($interval)
{
  var companyInfo={};
  return {
    getCompanyInfo: function() {
      return companyInfo;
    },
    setCompanyInfo: function(infoObj) {
      companyInfo=infoObj;
    }

  }
});
