var event = require('../db/event');
var eventProduct = require('../db/eventproduct');

var util = require('../util/util');


module.exports = (function () {

	var api = {

		selectEvent: function (conditions, success, error) {

			if (conditions === null) {
				event.findAll().then( function(results) {
					if (results.length === 0) {
						success(results);
					} else {
						success(util._getDataValues(results));
					}
				}, error);
			} else {
				event.findAll({where: conditions}).then( function(results) {
					if (results.length === 0) {
						success(results);
					} else {
						success(util._getDataValues(results));
					}
				}, error);
			}
		},
		
		selectEventProduct: function (conditions, success, error) {
			eventProduct.findAll({where: conditions}).then( function (results) {
				if (results.length === 0) {
					success(results);
				} else {
					success(util._getDataValues(results));
				}
			}, error);
		}
	};

	return {
		api : api
	};
})();
