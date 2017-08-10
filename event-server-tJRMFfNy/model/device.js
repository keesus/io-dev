var devicedb = require('../db/Device');
var permanentdb = require('../db/PermanentData');
var sequelize = require('../config/db');
var util = require('../util/util');

var TRAINING_DATE = 5;
module.exports = (function () {

	var makeParam = function (k,v) {
		var param = {};

		param[k] = v;

		return param;
	};

	var api = {
		insertDevice : function (d,sc,ec) {
			var list = [];
			list.push(d);
			console.log(list);
			this.selectDevice({macaddress:d.macaddress},function (res) {

				if (res.length === 0) {
					console.log(d);
					devicedb.bulkCreate(list).then(sc,ec);
				} else {
					console.log(2);
					sc(res);
				}
			},ec);
		},
		updateDevice : function (wp,up,sc,ec) {
			devicedb.update(up,{where:wp}).then(sc,ec);
		},
		deleteDevice : function (wp,sc,ec) {
			devicedb.destroy({where:wp}).then(sc,ec);
		},
		selectDevice : function (wp,sc,ec) {
			if (wp === null) {
				devicedb.findAll().then(function (res) {
					sc(util._getDataValues(res));
				}, ec);
			} else {
				devicedb.findAll({where:wp}).then(function (res) {
                    console.log(res);
					sc(util._getDataValues(res));
				}, ec);
			}
		},
		insertWithInnerJoin : function (param, sc ,ec) {
			sequelize.query("INSERT INTO PermanentData (`id`,`dataValue`,`DeviceId`,`createdAt`,`updatedAt`)"+
				""
				)
		},
		selectDeviceDetailInfo : function (wp,sc,ec) {
			// var resData = {
   //                  "modelCode": 1, //switcher db
   //                  "status": 1, // switcher db
   //                  "duration": 30, // eacheventuser db
   //                  "startDate": "20150112151130", //eacheventuser db, payment db
   //                  "endDate": "20150212151130", //eacheventuser db, payment db
   //                  "macaddress": "12:34:56:78", // switcher db
   //                  "hashingShareCode": "7312", // 6자리 sharecode를 4자리로..
   //                  "cardCode": 2, //payment db
   //                  "payPlanCode": 1, // payment db
   //                  "nextPayDate": "20150113151130", // payment db
   //                  "shareCode": "123456", //switcher db
   //                  "currentTime": "2015010211131130" //live create
   //              };

			var resData = {},
				self = this;

			var getPermanentData = function (deviceId) {

				permanentdb.findAll({where:{DeviceId:deviceId}}).then(function (rData) {
					console.log(rData);
                    if (rData.length === 0) {
                        ec({message:"no data"});
                    } else {
                        var list = util._getDataValues(rData);
                        var deviceValue = JSON.parse(list[0].dataValue);
                        resData.shareCode = deviceValue.shareCode+"";
                        sc(resData);
                    }

				},ec);

			};

			var calcTrainingEndDate = function (date) {
				var startDate = new Date(date);

				return new Date(startDate.getFullYear(),startDate.getMonth(),startDate.getDate()+TRAINING_DATE);
			}

			var calcEndDate = function (data) {
				var startDate = new Date(data.updateDate);
				console.log(startDate);
				var duration = (function (state) {
					console.log(state);
					var l = 0;

					switch(state) {
						case "1" :
							l = 1;
						break;
						case "2" :
							l = 12;
						break;
						case "3" :
							l = 12*2;
						break;
						case "4" :
							l = 12*3;
						break;
					}
					return l;
				})(data.nextPaymentDetail);

				return new Date(startDate.getFullYear(),startDate.getMonth()+duration,startDate.getDate());

			};

			console.log(wp);
			sequelize.query("SELECT "+
				"a.id, a.nextPaymentDetail, a.pKey, a.macaddress, a.hashingShareCode,"+
				"a.status, a.ProductId, "+
				"b.PaymentPlanId, b.updatedAt as updateDate, a.shareCode, d.paymentPlan "+
				"FROM Devices a " +
				"JOIN Payments b ON a.id = b.deviceid "+
                "JOIN RequestedDevices c ON a.macaddress = c.macaddress "+
                "JOIN Requests d ON c.RequestId = d.id " +
				"WHERE a.macaddress='"+wp.macaddress+"'"
				).then(function (res) {
					console.log(res);
					var data = res[0];

					var deviceId = 0;

					if(data.length === 0) {
						// payment정보가 없는 상태(체험중인 상태)
						//self.selectDevice(wp,function (list) {
                        sequelize.query("SELECT a.id, a.pKey, a.status, a.ProductId, a.macaddress, a.hashingShareCode, d.deliveryDate, d.firstPayDate, c.paymentPlan, a.shareCode " +
                            "FROM io_refactory_db.Devices a " +
                            "JOIN RequestedDevices b ON a.macaddress = b.macaddress " +
                            "JOIN Requests c ON b.RequestId = c.id " +
                            "JOIN Events d ON d.id = c.EventId " +
                            "WHERE a.macaddress='"+wp.macaddress+"'").then (function (list) {

                            var data = list[0][0];
                            resData.status = data.status;
                            resData.modelCode = data.ProductId === 1 ? "0002" : data.ProductId === 2 ? "0003" : data.ProductId ;
                            resData.macaddress = data.macaddress;
                            resData.hashingShareCode = data.hashingShareCode;
                            resData.startDate = data.deliveryDate;
                            resData.endDate = data.firstPayDate;
                            resData.cardCode = "0";
                            resData.duration = parseInt((data.firstPayDate - new Date())/(24*60*60*1000),10);
                            resData.payPlanCode = data.paymentPlan === null ? -1 : data.paymentPlan === "NULL" ? -1 : data.paymentPlan*1;
                            resData.nextPayDate = data.firstPayDate;
                            resData.currentTime = new Date().getFullYear() + "-" + (new Date().getMonth()+1) + "-"+ new Date().getDate();
                            resData.shareCode = data.shareCode;
                            resData.pKey = data.pKey;
                            resData.freeYN = "Y";
                            deviceId = data.id;
                            console.log(resData.shareCode);
                            if (resData.shareCode === null) {
                                getPermanentData(deviceId);
                            } else {
                                sc(resData);
                            }

                        }, ec);

						//}, ec);

					} else {

						// payment정보가 존재하는 상태
						resData.status = data[0].status;
                        resData.pKey = data[0].pKey;
						resData.modelCode = data[0].ProductId === 1 ? "0002" : data[0].ProductId === 2 ? "0003" : data[0].ProductId;
						resData.macaddress = data[0].macaddress;
						resData.hashingShareCode = data[0].hashingShareCode;
						resData.startDate = data[0].updateDate;
						resData.endDate = calcEndDate(data[0]);
						resData.cardCode = data[0].CreditCardId;
						resData.duration = parseInt((calcEndDate(data[0]) - new Date())/(24*60*60*1000));
						resData.payPlanCode = data[0].paymentPlan === null ? -1 : data[0].paymentPlan === "NULL" ? -1 : data[0].paymentPlan*1;
						resData.nextPayDate = calcEndDate(data[0]);
						resData.currentTime = new Date().getFullYear() + "-" + (new Date().getMonth()+1) + "-"+ new Date().getDate();
						resData.freeYN = "N";
						resData.shareCode = data[0].shareCode;
						deviceId = data[0].id;

						if (resData.shareCode === null) {
							getPermanentData(deviceId);
						} else {
							sc(resData);
						}
					}
				},ec);
		},
		selectAllocatedDevice : function (status,sc,ec) {
			sequelize.query(
					"SELECT a.id as cid, a.phoneNumber, a.name, a.postNo, a.addr1, a.addr2,c.id as did , c.status, c.ProductId, c.pKey, c.macaddress, d.RequestId, e.EventId, f.name as eventName, g.invoice FROM io_refactory_db.Customers a "+
					"JOIN Devices c ON a.phoneNumber = c.phoneNumber "+
					"JOIN RequestedDevices d ON c.macaddress = d.macaddress "+
					"JOIN Requests e ON e.id = d.RequestId "+
					"JOIN Events f ON e.EventId = f.id " +
					"JOIN Deliveries g ON g.RequestId = e.id " +
					"WHERE c.status='"+	status+"'"
			).then(function (list) {
				var list = list[0];

				sc(list)
			},ec);
		},
        selectRefundDevice : function (status, sc, ec) {

            sequelize.query(
                "SELECT b.id as cid, a.phoneNumber, b.name, b.postNo, b.addr1, b.addr2, a.id as did, a.status, a.ProductId, a.pKey, a.macaddress, e.id as RequestId, e.EventId, d.invoice, d.createdAt as returnDate FROM Devices a "+
                "JOIN Customers b ON b.phoneNumber = a.phoneNumber "+
                "JOIN Refunds c ON c.macaddress = a.macaddress " +
                "JOIN RefundDeliveries d ON d.RefundId = c.id " +
                "JOIN Requests e ON c.requestId = e.id " +
                "WHERE a.status='"+status+"'"
            ).then(function (l) {
                var list = l[0];
                sc(list);
            },ec);
        },
        searchRefundDevice : function (status, wk,wv, sc,ec) {
            sequelize.query(
                "SELECT b.id as cid, a.phoneNumber, b.name, b.postNo, b.addr1, b.addr2, a.id as did, a.status, a.ProductId, a.pKey, a.macaddress, e.id as RequestId, e.EventId, d.invoice FROM Devices a "+
                "JOIN Customers b ON b.phoneNumber = a.phoneNumber "+
                "JOIN Refunds c ON c.macaddress = a.macaddress " +
                "JOIN RefundDeliveries d ON d.RefundId = c.id " +
                "JOIN Requests e ON c.requestId = e.id " +
                "WHERE "+wk+"='"+wv+"' AND a.status='"+status+"'"
            ).then(function (l) {
                var list = l[0];
                sc(list);
            },ec);
        },
		searchAllocatedDevice : function (state,wk,wv,sc,ec) {
			sequelize.query(
					"SELECT a.id as cid, a.phoneNumber, a.name, a.postNo, a.addr1, a.addr2,c.id as did , c.status, c.ProductId, c.pKey, c.macaddress, d.RequestId, e.invoice, f.EventId FROM io_refactory_db.Customers a "+
					"JOIN Devices c ON a.phoneNumber = c.phoneNumber "+
					"JOIN RequestedDevices d ON c.macaddress = d.macaddress "+
                    "JOIN Deliveries e ON e.RequestId = d.RequestId "+
                    "JOIN Requests f ON f.id = e.RequestId " +
					"where "+wk+"='"+wv+"' AND c.status='"+state+"'"
			).then(function (list) {
				var list = list[0];

				sc(list)
			},ec);
		},
		selectNotAllocatedDevice : function (sc,ec) {
			sequelize.query(
				"select * from Devices a "+
				"where not exists "+
				"(select 1 from RequestedDevices where macaddress=a.macaddress)"
			).then(function (list) {

				var list = list[0];
				sc(list);

			}, ec)
		},
		searchNotASwitcher : function (wk,wv,sc,ec) {
			sequelize.query(
				"select * from Devices "+
				"where status=0 AND "+wk+"='"+wv+"'"
			).then(function (list) {

				var list = list[0];
				sc(list);

			}, ec)
		},
		selectPermentData : function (wp, sc, ec) {

			permanentdb.findAll({where:wp}).then(function (rData) {
					var list = util._getDataValues(rData);
					var deviceValue = JSON.parse(list[0].dataValue);
					var resData = {};

					for (var key in deviceValue) {
						console.log(key);
						resData[key] = deviceValue[key]+"";
					}

					sc(resData);
				},ec);
		},
		updatePermentData : function (wp, vp, sc ,ec) {
			permanentdb.update(vp, {where:wp}).then(function (rData) {
					sc(rData);
				},ec);
		},
		insertPermentData : function (dl, sc, ec) {

			permanentdb.bulkCreate(dl).then(function (res) {
				sc(res);
			}, ec);
		}
	};

	return {
		api : api
	};
})();