var request = require('../db/request'),
	deliverydb = require('../db/delivery'),
	devicedb = require('../db/Device'),
	requestDevice = require('../db/RequestedDevice');

var util = require('../util/util');
var sequelize = require('../config/db');

module.exports = (function () {

	var api = {
		insertRequest : function (data, success, error) {
			var list = [];
			list.push(data);
			request.bulkCreate(list, {individualHooks: true}).then(function(results) {
				success(results);
			}, error);
		},

		updateRequest : function (conditions, data, success, error) {
			request.update(data, {where: conditions}).then(success, error);
		},
		
		deleteRequest : function (wp,sc,ec) {
			request.destroy({where:wp}).then(sc,ec);
		},
		selectRequest: function(conditions, success, error) {
			request.findAll({where: conditions}).then( function(results) {
				success(util._getDataValues(results));
			}, error);
		},
		selectRequestWithDevice :  function (wp,sc,ec) {

		},
		selectDeliveryDataByRequestId : function (wp,sc,ec) {
			deliverydb.findAll({where:wp}).then(function(res) {
				var list = util._getDataValues(res);
				sc(list);
			},ec);
		},
		selectDeviceByRDMacaddress : function (wp,sc,ec) {
			devicedb.findAll({where:wp}).then(function(res) {
				var list = util._getDataValues(res);
				sc(list);
			},ec)
		},
		insertRequestDevice : function (d,sc,ec) {
			var list = [];
			list.push(d);
			requestDevice.bulkCreate(list).then(sc,ec);
		},
		selectRequestDevice : function (wp,sc,ec) {
			requestDevice.findAll({where:wp}).then(sc,ec);
		},
		updateRequestDevice : function (wp,vp,sc,ec) {
			requestDevice.update(vp,{where:wp,limit:1}).then(sc,ec);
		},
		deleteRequestDevice : function (wp, sc, ec) {

			requestDevice.destroy({where:wp}).then(function(r) {
				sc(r);
			}, function (e) {
				ec(e);
			});

		},
		selectRequestedDeviceWithUser : function (invoice, sc, ec) {

			sequelize.query("SELECT a.id, a.quantity, a.type, b.DeviceId, a.CustomerPhoneNumber, d.pKey"+
				" FROM Requests a "+
				"JOIN RequestedDevices b ON b.RequestId = a.id "+
				"JOIN Deliveries c ON c.RequestId = a.id "+
				"LEFT OUTER JOIN Devices d ON d.id = b.DeviceId "+
				"WHERE c.invoice='"+invoice+"'").then(function (res) {

					var list = res[0];

					sc(list);
				}, ec);
		},
		requestedDeviceAmtInfo : function (id, sc, ec) {
			console.log(id);
			sequelize.query("SELECT a.type,count(*) as amt " +
				"FROM io_refactory_db.Requests a " +
				"JOIN Products b ON a.type = b.productName " +
				"where a.EventId="+id +
				" GROUP BY a.type").then(function (d) {

				var data = d[0];

				sc(data);

			}, ec);
		}
	};

	return {
		api : api
	};
})();