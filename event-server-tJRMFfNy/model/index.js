var card = require('./card'),
	delivery = require('./delivery'),
	device = require('./device'),
	event = require('./event'),
	refund = require('./refund'),
	request = require('./request'),
	user = require('./user'),
	campaign = require('./campaign');

var paymentPlandb = require('../db/PaymentPlan');
var paymentdb = require('../db/Payment');
var devicedb = require('../db/Device');
var permanentdb = require('../db/PermanentData');
var productdb = require('../db/Product');

var util = require('../util/util');

var ciphersModule = require('./ciphers');

var sequelize = require('../config/db');

var common = {

	selectPricingInfo : function (wp,sc,ec) {
		var whereParam ={where:wp};

		if (wp !== null) {
			paymentPlandb.findAll(whereParam).then(function(list) {
				sc(util._getDataValues(list));
			}, ec);
		} else {
			paymentPlandb.findAll().then(function(list) {
				sc(util._getDataValues(list));
			}, ec);
		}

	},
	insertPaymentInfo : function (d,sc,ec) {
		var list = [];
		list.push(d);
		paymentdb.bulkCreate(list).then(sc, ec);
	},
	updatePayEndDate : function (planKey, macaddress, sc, ec) {

		var today = new Date("YYYYMMDD");

		this.selectPricingInfo({id:planKey}, function (res) {

			var data = util._getDataValues(res)[0];
			var expDate = new Date(
				today.getFullYear(),
				today.getMonth(),
				today.getDate()+data.durantion
				);
			devicedb.update({nextPaymentDetail:expDate.toString()},{macaddress:macaddress})
			.then(sc, ec);
		}, ec);
	},
	initializeDevice : function ( pKey, sc, ec) {
		console.log(2);
		var cp = new ciphersModule();

		var addZero = function (n) {

		    var num = n.toString();

		    if (n.length === 1) {
		        num = "0"+num;
		    }

		    return num;
		};

		var leadingZeros = function(n, digits) {
		    var zero = '';
		    n = n.toString();

		    if (n.length < digits) {
		        for (var i = 0; i < digits - n.length; i++)
		            zero += '0';
		    }
		    return zero + n;
		};

		var generatePKey = function (n) {

		    var k = (parseInt(n+addZero(new Date().getMonth()+1)+addZero(new Date().getDate()),10)).toString(16)
		    var dist = 8 - k.length;
		    var tempNum;
		    if (dist >0) {
		        for (var i = 0 ; i < dist; i ++) {
		            tempNum = Math.floor(Math.random()*9+1);
		            k = k+tempNum;
		        }
		    }

		    return k;
		};

		var makeShareCode = function (cb) {
			var sharingCode = (function () {
		        return Math.floor(Math.random()*(9999-1000+1) +1000);
		    })();

		    return sharingCode;
		};

		var originalDevice = {};
		var permanentData = {};

		console.log(device.api.selectDevice);

		device.api.selectDevice({pKey:pKey},function (list) {
			originalDevice = list[0];
			console.log(4);
			//RequestedDevice 테이블에서 해당 row 삭제
			request.api.selectRequestDevice({macaddress:list[0].macaddress}, function (rdlist) {
				console.log(5);

				request.api.deleteRequestDevice({macaddress:rdlist[0].macaddress}, function(r) {

					//Request 테이블에서 해당 row 삭제
					request.api.deleteRequest({id:rdlist[0].RequestId}, function (r) {
						//Deivce 테이블에서 pkey, shareCode, hashingShareCode, phoneNumber 업데이트
						originalDevice.pKey = generatePKey(cp.getKey());
						originalDevice.hashingShareCode = cp.getHashingKey();
						originalDevice.phoneNumber = null;
						originalDevice.status = "7";

						device.api.updateDevice({macaddress:originalDevice.macaddress},originalDevice, function (r) {

							var shareCode = makeShareCode();
							var data = [];

							permanentData.dataValue = JSON.stringify({shareCode:shareCode});

							permanentdb.findAll({where:{DeviceId:originalDevice.id}}).then(function (l) {

								var list = util._getDataValues(l);

								if (list.length === 0) {
									data.push(permanentData);
									permanentdb.bulkCreate(data).then(function (res) {
										sc(list[0]);
									}, ec);
								} else {
									device.api.updatePermentData({DeviceId:originalDevice.id},permanentData, function (r) {
										sc(r)
									}, ec);
								}
							}, ec);
						}, ec);
					}, ec);
				}, ec);
			}, ec);
		}, ec);


	},
	makeRequest : function (pKey, sc, ec) {


	},
	createSwitcherField : function (macaddress, type, sc, ec) {

		//device field 초기 정보
		//status : 0
		//nextPaymentDetial : null
		//serialNumber : makeSerialNumber
		//macaddress : macaddress
		//hashingShareCode : makeHashingShareCode
		//pKey : makepKey
		//phoneNumber : null
		//PaymentPlanId : null
		//ProductId : select from Products
		//permanetData dataValue = {shareCode : makeShareCode}

		var cp = new ciphersModule();
		var datavalues = {};
		var addZero = function (n) {

		    var num = n.toString();

		    if (n.length === 1) {
		        num = "0"+num;
		    }

		    return num;
		};

		var leadingZeros = function(n, digits) {
		    var zero = '';
		    n = n.toString();

		    if (n.length < digits) {
		        for (var i = 0; i < digits - n.length; i++)
		            zero += '0';
		    }
		    return zero + n;
		};

		var generatePKey = function (n) {

		    var k = (parseInt(n+addZero(new Date().getMonth()+1)+addZero(new Date().getDate()),10)).toString(16)
		    var dist = 8 - k.length;
		    var tempNum;
		    if (dist >0) {
		        for (var i = 0 ; i < dist; i ++) {
		            tempNum = Math.floor(Math.random()*9+1);
		            k = k+tempNum;
		        }
		    }

		    return k;
		};

		var deviceData = {},
			permanentData = {},
			makeSerialNumber = function (cb) {
				console.log(3);
				device.api.selectDevice(null,function (list) {
					console.log(4);
					var pn = type,
						version = "01",
						month = addZero(new Date().getMonth() +1),
						orderingNumber = list.length === 0 || list[0].serialNumber.substr(7,2) !== month ? "0000001" : leadingZeros(list[0].serialNumber.substr(8,8) + 1);
					console.log(5);
					cb(pn+version+month+orderingNumber);
				}, ec)
			},
			makeHashingShareCode = function () {
				var code = cp.getHashingKey();
				var addingNumber =Math.floor((Math.random()*10 -1) +1) + "";

				return code.length > 3 ? code : code + addingNumber;
			},
			makepKey = function () {

				var key = cp.getKey();

				return generatePKey(key);
			},
			makeShareCode = function (cb) {
				var sharingCode = (function () {
			        return Math.floor(Math.random()*(9999-1000+1) +1000);
			    })();

			    return sharingCode;
			};
		//device field 초기 정보
		//status : 0
		//nextPaymentDetial : null
		//serialNumber : makeSerialNumber
		//macaddress : macaddress
		//hashingShareCode : makeHashingShareCode
		//pKey : makepKey
		//phoneNumber : null
		//PaymentPlanId : null
		//ProductId : select from Products
		//permanetData dataValue = {shareCode : makeShareCode}
		makeSerialNumber(function (serialNumber) {
			deviceData.status = 0;
			deviceData.pKey = makepKey().toUpperCase();
			deviceData.serialNumber = serialNumber;
			deviceData.macaddress = macaddress;
			deviceData.hashingShareCode = makeHashingShareCode();

			console.log(deviceData);

			datavalues.shareCode = makeShareCode();

			permanentData.dataValue = JSON.stringify(datavalues);
			productdb.findAll({where:{productName:type}}).then(function (response) {

				var list = util._getDataValues(response);
				deviceData.ProductId = list[0].id;
				device.api.insertDevice(deviceData, function (r) {
					console.log(r);
					if (r[0] === undefined ||r[0].dataValues !== undefined) {
						device.api.selectDevice({pKey:deviceData.pKey}, function (list) {

							permanentData.DeviceId = list[0].id;
							var data = [];
							data.push(permanentData);
							permanentdb.bulkCreate(data).then(function (res) {
								sc(list);
							}, ec);
						}, ec);
					} else {
						sc(r);
					}

				}, ec);
			}, ec);
		});
	},
	getEventDetailInfoList : function (id, sc, ec) {
		sequelize.query("select a.id, a.quantity, a.type, b.name, b.phoneNumber, b.addr1, b.addr2, b.postNo, c.name as eventName, c.status, c.id as eventid, d.invoice" +
				" from Requests a " +
				"JOIN Customers b ON a.CustomerPhoneNumber = b.phoneNumber " +
				"JOIN Events c ON a.EventId = c.id " +
				"JOIN Deliveries d ON a.id = d.RequestId "+
				"WHERE a.EventId="+id).then(function (list) {
			console.log(list);
			sc(list);
		}, ec)
	},
	allocateSwitcher : function (no,pKey,sc,ec) {

		delivery.api.selectDeliveryData({invoice:no},function (list) {

			var list = util._getDataValues(list);
			var reqID = list[0].RequestId;
			var pn = list[0].phoneNumber;
			sequelize.query("select c.paymentPlan, a.invoice, b.macaddress from Deliveries a " +
				"JOIN RequestedDevices b ON a.RequestId = b.RequestId " +
				"JOIN Requests c ON c.id = b.RequestId " +
				"WHERE a.invoice="+no).then(function(ql) {

				var paymentPlanId = ql[0][0].paymentPlan;

					device.api.updateDevice({pKey:pKey},{phoneNumber:pn,nextPaymentDetail:paymentPlanId},function(response) {
						device.api.selectDevice({pKey:pKey},function (r) {
							var dList = r;
							request.api.updateRequestDevice({RequestId:reqID, DeviceId:null},{macaddress:dList[0].macaddress,DeviceId:dList[0].id},sc,ec);
						}, ec);
					}, ec);
			}, ec);
		},ec);
	},
	freeSwitcher : function (pKey, sc, ec) {
		console.log(pKey);
		device.api.selectDevice({pKey:pKey}, function (r) {
			var d = r[0];
			console.log(device);
			sequelize.query("UPDATE Devices SET phoneNumber=null WHERE pKey='"+pKey+"'").then(function () {
				sequelize.query("UPDATE RequestedDevices SET macaddress=null, DeviceId=null WHERE macaddress='"+ d.macaddress+"'").then(function (r) {
					sc({result:"success"});
				}, ec);

			}, ec);
			//device.api.updateDevice({pKey:pKey},{phoneNumber:null}, function () {
			//
			//}, ec);
		}, ec);
	},
	findUserTotalInfo : function (k, v, sc, ec) {
		/*
			Customers, Devices, Requests
		 */
		sequelize.query(
			"SELECT a.id as cid, a.phoneNumber, a.name, a.postNo, a.addr1, a.addr2,c.id as did , c.status, c.ProductId, c.pKey, c.macaddress, d.RequestId, e.invoice FROM io_refactory_db.Customers a "+
			"JOIN Devices c ON a.phoneNumber = c.phoneNumber "+
			"JOIN RequestedDevices d ON c.macaddress = d.macaddress "+
			"JOIN Deliveries e ON d.RequestId = e.RequestId "+
			"where a."+k+"='"+v+"'"
		).then(function (list) {
				var list = list[0];
				if (list.length === 0) {
					sequelize.query("SELECT * FROM Customers where "+k+"='"+v+"'").then(function (list) {

						var list = list[0];

						sc(list);
					}, ec);
				} else {

					sc(list);
				}
		},ec);
	},
	findRequestedDevice : function (eid, sc ,ec) {

		sequelize.query(
			"SELECT b.macaddress, d.price, c.id as deviceId, d.id as planId, e.id as cardId,  e.cardNumber, c.phoneNumber, e.expireDate, f.name FROM Requests a "+
			"JOIN RequestedDevices b ON a.id = b.RequestId "+
			"JOIN Devices c ON c.id = b.DeviceId "+
			"JOIN PaymentPlans d ON d.id = c.nextPaymentDetail "+
			"JOIN CreditCards e ON e.phoneNumber = c.phoneNumber "+
			"JOIN Customers f ON f.phoneNumber = c.phoneNumber "+
			"WHERE b.macaddress IS NOT NULL AND e.main='"+1+"' AND a.EventId="+eid
			).then(function (l) {

            var list = l[0];
            sc(list);
        },ec);
	},
	findInfoWithInvoice : function ( invoice,sc,ec ) {
		sequelize.query(
			"SELECT a.invoice, a.RequestId, a.status, a.phoneNumber, b.macaddress FROM Deliveries a "+
			"JOIN RequestedDevices b ON a.RequestId = b.RequestId "+
			"WHERE a.invoice='"+invoice+"'"
		).then(sc,ec);
	},
	findAllPrdList : function ( sc, ec ) {
		productdb.findAll().then(function (list) {
			sc(util._getDataValues(list));
		}, ec);
	},
	setDeviceState : function (macaddress, state, sc, ec) {

		device.api.updateDevice({macaddress:macaddress},{status:state}, function(r) {
			sequelize.query(
				"SELECT c.invoice FROM Devices a " +
				"JOIN RequestedDevices b ON a.macaddress = b.macaddress " +
				"JOIN Deliveries c ON b.RequestId = c.RequestId " +
				"WHERE a.macaddress='"+macaddress+"'"
			).then(function (i) {
				var data = i[0][0];

				delivery.api.updateDeliveryData({invoice:data.invoice},{status:state},function (r) {
					sc(r);
				},ec);
			}, ec);
		}, ec);
	},
	getIncome : function (eventid, sc, ec) {

		sequelize.query("SELECT a.price, b.RequestId, c.EventId FROM io_refactory_db.Payments a " +
			"JOIN RequestedDevices b ON a.deviceid = b.DeviceId " +
			"JOIN Requests c ON b.RequestId = c.id " +
			"WHERE c.EventId="+eventid).then(function (i) {

			var dataList = i[0];
			var income = 0;

			for (var j = 0; j < dataList.length; j++) {
				income += ((dataList[j].price != null & dataList[i].price != undefined) ? dataList[j].price * 1 : 0);
			}

			sc({income:income});
		}, ec);
	}
};

module.exports = (function () {

	return {
		card : card.api,
		delivery : delivery.api,
		device : device.api,
		event : event.api,
		refund : refund.api,
		user : user.api,
		request : request.api,
		common : common,
		campaign: campaign.api
	}
})();