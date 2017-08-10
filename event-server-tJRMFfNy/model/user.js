var customer = require('../db/customer');
var devicedb = require('../db/Device');

var util = require('../util/util');

module.exports = (function () {

	var api = {
		insertUser: function (data, success, error) {
			var list = [];
			list.push(data);

			customer.findAll({where: {phoneNumber: data.phoneNumber}}).then( function(results) {
				if (util._getDataValues(results).length!==0) {
					error({result: 'pn-duplicated'});
				} else {
					customer.bulkCreate(list, {individualHooks: true}).then(function(results) {
						success(results);
					}, error);
				}
			}, error);
		},

		updateUser: function (conditions, data, success, error) {
			customer.update(data, {where: conditions}).then(success, error);
		},

		selectUser: function (conditions, success, error) {
			if (conditions === null) {
				customer.findAll().then( function(results) {
					var list = util._getDataValues(results);
					success(list);
				}, error);
			} else {
				customer.findAll({where: conditions}).then( function(results) {
					var list = util._getDataValues(results);
					success(list);
				}, error);
			}
		},
		selectUserDeviceList : function(wp,sc,ec) {

			devicedb.findAll({where:wp}).then(function (rlist) {

				var list = util._getDataValues(rlist);
				if (rlist.length === 0 ) {
					sc([]);
				} else {
					addresslist = list.map(function (item) {
						return item.macaddress;
					});

					sc(addresslist);
				}

			},ec);
		}
	};

	return {
		api : api
	};
})();