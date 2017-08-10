var refund = require('../db/refund');
var refundDelivery = require('../db/RefundDelivery');

var util = require('../util/util');
module.exports = (function () {

	var api = {
		insertRefund : function (dl,sc,ec) {

			refund.bulkCreate(dl).then(sc,ec);
		},
		updateRefund : function (wp,vp,sc,ec) {
			refund.update(vp,{where:wp}).then(sc,ec);
		},
		deleteRefund : function (wk,sc,ec) {
			refund.destroy({where:wp}).then(sc,ec);
		},
		selectRefund : function (wp,sc,ec) {

			if (wp === null) {
				refund.findAll().then(function (l) {

					var list = util._getDataValues(l);

					sc(list);
				}, ec);
			} else {
				refund.findAll({where:wp}).then(function (l) {

					var list = util._getDataValues(l);

					sc(list);
				}, ec);
			}
		},
		insertRefundDelivery : function ( dl, sc, ec ) {
			refundDelivery.bulkCreate(dl).then(sc,ec);
		},
		updateRefundDelivery : function ( wp, vp, sc, ec ) {
			refundDelivery.update(vp,{where:wp}).then(sc,ec);
		},
		deleteRefundDelivery : function ( wp, sc, ec ) {
			refundDelivery.destory({where:wp}).then(sc,ec);
		},
		selectRefundDelivery : function ( wp, sc, ec ) {
			refundDelivery.findAll({where:wp}).then(function (l) {

				var list = util._getDataValues(l);

				sc(list);
			},ec);

		}
	};

	return {
		api : api
	};
})();