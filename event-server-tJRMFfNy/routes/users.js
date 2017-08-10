var userdb = require('../db/customer');
var devicedb = require('../db/Device');

var util = require('../util/util');

module.exports = (function () {

	var api = {
		insertUser : function (d,sc,ec) {
			var list = [];
			list.push(d);

			this.selectUser({id:d.id}, function (res) {

				if (res.length!==0) {
					ec({result:"id-duplicated"});
				} else {
					userdb.findAll({where:{phoneNumber:d.phoneNumber}}).then(function(res) {
						if (util._getDataValues(res).length!==0) {
							ec({result:"pn-duplicated"});
						} else {
							userdb.bulkCreate(list).then(sc, ec);
						}
					},ec);
				}
			}, ec);
		},
		updateUser : function (wp,vp,sc,ec) {
			userdb.update(vp,{where:wp}).then(sc,ec);
		},
		deleteUser : function (wk,sc,ec) {

		},
		selectUser : function (wp,sc,ec) {

			if (wp === null) {
				userdb.findAll().then(function(res) {
					var list = util._getDataValues(res);
					sc(list);
				},ec);
			} else {
				userdb.findAll({where:wp}).then(function(res) {
					var list = util._getDataValues(res);
					sc(list);
				},ec);
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