/**
 * Created by Rachel on 2016. 9. 22..
 */

var campaign = require('../db/Campaign');


module.exports = (function () {

  var api = {
    insertCampaign : function (data, success, error) {
      var list = [data];
      campaign.bulkCreate(list, {returning: true}).then(function(results) {
        success(results);
      }, error);
    }
  };

  return {
    api : api
  };
})();