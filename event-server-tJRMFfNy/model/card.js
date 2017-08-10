var creditCard = require('../db/creditcard'),
	paymentdb = require('../db/Payment'),
	userdb = require('../db/customer');


var util = require('../util/util');
module.exports = (function () {

	var makeParam = function (k,v) {
		var param = {};

		param[k] = v;

		return param;
	};

	var api = {
		insertCard : function(data, success, error) {
			var list = [];
			list.push(data);
			creditCard.bulkCreate(list, {individualHooks: true}).then(function(results) {
				success(results);
			}, error);
		},
		
		updateCard : function (wp,vp,sc,ec) {
			carddb.update(vp,{where:wp}).then(sc,ec);
		},
		deleteCard : function (wk,sc,ec) {

		},
		selectCard : function(conditions, success, error) {
			creditCard.findAll({where: conditions}).then(function(results) {
				success(util._getDataValues(results));
			}, error);
		},
		insertPaymentInfo : function (dl, sc, ec) {
			paymentdb.bulkCreate(dl).then(sc,ec);
		},
		selectPaymentInfo : function (wp,sc,ec) {
			if (wp === null) {
				paymentdb.findAll().then(function (res) {
					sc(util._getDataValues(res));
				},ec);
			} else {
				paymentdb.findAll({where:wp}).then(function (res) {
					sc(util._getDataValues(res));
				},ec);
			}
		}
	};

	return {
		api : api
	};
})();