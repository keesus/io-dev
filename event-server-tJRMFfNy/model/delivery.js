var delivery = require('../db/delivery');
var userdb = require('../db/customer');


var util = require('../util/util');

module.exports = (function () {

	var api = {
		insertDelivery: function(data, success, error) {
			var list = [];
			list.push(data);

			delivery.bulkCreate(list).then(success, error);
		},
		
		updateDeliveryData : function (wp,vp,sc,ec) {

			deliverydb.update(vp,{where:wp}).then(sc,ec);
		},
		deleteDeliveryData : function (wk,sc,ec) {

		},
		selectDeliveryData : function (wp,sc,ec) {
			if (wp === null) {
				deliverydb.findAll().then(sc,ec);
			} else {
				deliverydb.findAll({where:wp}).then(sc,ec);
			}

		}
	};

	return {
		api : api
	};
})();