var express = require('express');
var router = express.Router();
var util = require('../util/util');
var model = require('../model/index');
var config = require('../config/sms_conf');
var mongojs = require('mongojs');
var db = mongojs("temporaryUser", ['info']);
var purchaseDB = mongojs("purchases", ['priceTests', 'awaiters']);
var fs = require('fs');
var lineReader = require('line-reader');
var nodeExcel = require('excel-export');
var querystring = require('querystring');

var smsUtil = require('../util/sms');

var winston = require('winston');
var moment = require('moment');

var logger = new (winston.Logger)({
  transports: [
    new (winston.transports.Console)({
      timestamp: function () {
        return moment().format("YYYY-MM-DD HH:mm:ss");
      }
    })
  ]
});

var prefix = "/event";
var isParamNull = function (param) {

  var flag = false;

  if (param == "" || param == undefined || param == null) {
    flag = true;
  } else {
    flag = false;
  }
  return flag;
};

router.get(prefix + '/checkUser', function (req, res, next) {
  logger.info('[index.js - /checkUser] start');
  var eventId;
  var max;
  var userCnt;

  model.event.selectEvent({"status": 1}, function (l) {
    if (l.length > 0) {
      eventId = l[0].id;

      model.event.selectEventPrd({"EventId": eventId}, function (r) {
        logger.info('[index.js - /checkUser] quentity: ' + r[0].quentity);
        max = r[0].quentity;

        model.request.selectRequest({"EventId": eventId}, function (userlist) {
          userCnt = userlist.length;
          res.status(200).send({data: {max: max, userCnt: userCnt, eventId: eventId}});
        });
      });

    } else {
      logger.info('[index.js - /checkUser] no data');
      res.status(200).send({max: "no data"});
    }
  });
});

/* complete by rachel */
router.get(prefix + '/eventInfo', function (req, res, next) {
  logger.info('[index.js - /eventInfo] START');
  var eventId;
  var deliveryAt;
  var endAt;
  var max;
  var maxByType;
  var requestCount;
  var userCount;

  model.event.selectEvent({'status': 1}, function (results) {
    if (results.length > 0) {
      eventId = results[0].id;
      deliveryAt = results[0].deliveryAt;
      endAt = results[0].endAt;

      model.event.selectEventProduct({'eventId': eventId}, function (results) {

        // get max count by event
        max = (function (results) {
          var quantity = 0;

          if (results.length === 0) {
            return quantity;
          }

          for (var i = 0; i < results.length; i++) {
            quantity += results[i].quantity * 1;
          }

          return quantity;
        })(results);

        // get max count by model type
        maxByType = (function(results) {

          var type1Quantity = 0, type2Quantity = 0;
          if (results.length === 0) {
            return {
              '1': type1Quantity,
              '2': type2Quantity
            };
          }

          for (var i = 0; i < results.length; i++) {
            if (results[i].modelId == '1') {
              type1Quantity = results[i].quantity;
            } else if (results[i].modelId == '2') {
              type2Quantity = results[i].quantity;
            }
          }
          return {
            '1': type1Quantity,
            '2': type2Quantity
          };
        })(results);

        // get request count
        model.request.selectRequest({'eventId': eventId, 'deletedAt': {$eq: null}}, function(results) {

          userCount = results.length;

          requestCount = (function(results) {

            var type1Quantity = 0, type2Quantity = 0;
            if (results.length === 0) {
              return {
                '1': type1Quantity,
                '2': type2Quantity
              };
            }

            for (var i=0; i<results.length; i++) {
              if (results[i].modelId == '1') {
                type1Quantity += 1;
              } else if (results[i].modelId == '2') {
                type2Quantity += 1;
              }
            }
            return {
              '1': type1Quantity,
              '2': type2Quantity
            };
          })(results);

          util._success(res, {
            max: max,
            userCount: userCount,
            eventId: eventId,
            deliveryAt: deliveryAt,
            endAt: endAt,
            maxByType: maxByType,
            requestCount: requestCount
          });
        }, function(error) {
          util._success(res, {error: 'no event'});
        });
      }, function (error) {
        util._success(res, {error: 'no event'});
      });
    } else {
      util._success(res, {error: 'no event'});
    }
  });
});

/* by rachel */
router.get(prefix + '/next', function (req, res, next) {
  model.event.selectEvent({status: '0', deletedAt: {$eq: null}}, function (results) {

    var nextEventDate = '';
    if(results.length <= 0) {
      nextEventDate = new Date();
    } else {
      var lastEvent = results[results.length - 1];
      nextEventDate = new Date(lastEvent.sellingStartAt);
    }

    util._success(res, { nextEventDate: new Date(nextEventDate) });
  }, function () { });
});

/* 
 qa전용
 */
router.get(prefix + '/member/eventInfo', function (req, res, next) {
  logger.info('[index.js - /member/eventInfo] start');
  var eventId;
  var max;
  var userCnt;

  model.event.selectEvent({"status": 8}, function (l) {

    if (l.length > 0) {
      eventId = l[0].id;

      model.event.selectEventPrd({"EventId": eventId}, function (r) {

        max = (function (res) {

          var quentity = 0;

          if (res.length === 0) {
            return quentity;
          }

          for (var i = 0; i < res.length; i++) {
            quentity += res[i].quentity * 1;
          }

          return quentity;
        })(r);

        typesMax = (function (res) {

          var oneTypeQuentity = 0, twoTypeQuentity = 0;

          if (res.length === 0) {
            return {
              "0002": oneTypeQuentity,
              "0003": twoTypeQuentity
            };
          }

          for (var i = 0; i < res.length; i++) {
            if (res[i].ProductId == 1) {
              oneTypeQuentity = res[i].quentity;
            } else if (res[i].ProductId == 2) {
              twoTypeQuentity = res[i].quentity;
            }
          }

          return {
            "0002": oneTypeQuentity,
            "0003": twoTypeQuentity
          };

        })(r);

        model.request.selectRequest({"EventId": eventId}, function (userlist) {

          userCnt = userlist.length;

          divideQuentity = (function (list) {
            var oneTypeQuentity = 0, twoTypeQuentity = 0;

            if (list.length === 0) {
              return {
                "0002": oneTypeQuentity,
                "0003": twoTypeQuentity
              };
            }

            for (var i = 0; i < list.length; i++) {
              if (list[i].type == "0002") {
                oneTypeQuentity += 1;
              } else if (list[i].type == "0003") {
                twoTypeQuentity += 1;
              }
            }

            return {
              "0002": oneTypeQuentity,
              "0003": twoTypeQuentity
            };
          })(userlist);

          util._success(res, {
            max: max,
            userCnt: userCnt,
            eventId: eventId,
            divideMax: typesMax,
            divideQuentity: divideQuentity
          });
        }, function (e) {
          util._success(res, {error: "no event"});
        });
      }, function (e) {
        util._success(res, {error: "no event"});
      });

    } else {
      util._success(res, {error: "no event"});
    }
  });
});

router.get(prefix + '/complete', function (req, res, next) {
  logger.info('[index.js - /complete] start');

  if (isParamNull(req.query.id)) {
    logger.error('[index.js - /complete] 아이디 값이 잘못되었습니다.');
    util._error(res, {reason: "아이디 값이 잘못되었습니다."});
    return;
  }

  model.user.selectUser({id: req.query.id}, function (l) {
    if (l.length > 0) {
      util._success(res, {name: l[0].name, phoneNumber: l[0].phoneNumber, address: l[0].addr1 + " " + l[0].addr2});
    } else {
      logger.error('[index.js - /complete] 유저의 정보를 찾을 수 없습니다. id: ' + req.query.id);
      util._error(res, {reason: "유저의 정보를 찾을 수 없습니다."});
    }
  }, function (e) {
    util._error(res, {reason: "유저의 정보를 확인하던 도중 에러가 발생했습니다."});
  });
});

/* complete by rachel */
router.post(prefix + '/auth/number', function (req, res, next) {
  var phoneNumber = req.body.phoneNumber;
  logger.info('[index.js - /auth/number] phoneNumber: ' + phoneNumber);

  var authDate = new Date().getTime() + '';
  var authStr = (function(currentDate) {
      var str1 = currentDate.substr(0, 4);
      var str2 = currentDate.substr(currentDate.length-4, 4);
      return ((str1*str2) + '').substr(0, 4);
  })(authDate);
  var credential = 'Basic ' + new Buffer(config.appid + ':' + config.apiKey).toString('base64');
  var reqOpt = {
      host: 'api.bluehouselab.com',
      port: 443,
      path: '/smscenter/v1.0/sendsms',
      headers: {
        'Authorization': credential,
        'Content-Type': 'application/json; charset=utf-8'
      },
      method: 'POST'
  };
  var reqData = {
      'sender': config.sender,
      'receivers': [phoneNumber],
      'content': config.prefix + authStr + config.end
  };

  if(isParamNull(phoneNumber)) {
    logger.error('[index.js - /auth/number] 사용자의 핸드폰 번호가 올바르지 않습니다. phoneNumber: ' + phoneNumber);
    util._error(res, {reason: '사용자의 핸드폰 번호가 올바르지 않습니다.'});
    return;
  }

  reqOpt.headers['Content-Length'] = Buffer.byteLength(JSON.stringify(reqData));

  // insert new customer info
  model.user.insertUser({phoneNumber: phoneNumber, authNumber: authStr}, function(results) {
    var customerId = results[0].id;
    util._request(reqOpt, JSON.stringify(reqData), function (okBody) {
      util._success(res, {customerId: customerId});
    }, function (error) {
      util._error(res, {reason: '인증번호 전송 도중 에러가 발생했습니다.'});
    });
  }, function(error) {
    if(error['result'] === 'pn-duplicated') {
      model.user.updateUser({phoneNumber: phoneNumber}, {authNumber: authStr}, function(results) {
        model.user.selectUser({phoneNumber: phoneNumber}, function(results) {
          var customer = results[0];
          util._request(reqOpt, JSON.stringify(reqData), function (results) {
            util._success(res, {customerId: customer.id});
          }, function(error) {
            util._error(res, {reason: '인증번호 전송 도중 에러가 발생했습니다.'});
          });
        }, function(error) {
          util._error(res, {reason: '유저 검색도중 에러가 발생했습니다.'});
        });
      }, function(error) {
        util._error(res, {reason: '유저 정보 업데이트 도중 에러가 발생헀습니다.'});
      });
    } else {
      util._error(res, {reason: '유저 정보 등록 도중 에러가 발생했습니다.'});
    }
  });
});

/* complete by rachel */
router.get(prefix + '/auth/startApp', function (req, res, next) {
  var authNumber = req.query.authNumber;
  var customerId = req.query.customerId;
  logger.info('[index.js - /auth/startApp] authNumber: ' + authNumber + ', customerId: ' + customerId);

  if (isParamNull(authNumber)) {
    logger.error('[index.js - /auth/startApp] 인증번호가 올바르지 않습니다.');
    util._error(res, {reason: '인증번호가 올바르지 않습니다.'});
    return;
  }

  if (isParamNull(customerId)) {
    logger.error('[index.js - /auth/startApp] 아이디가 올바르지 않습니다.');
    util._error(res, {reason: '아이디가 올바르지 않습니다.'});
    return;
  }

  model.user.selectUser({id: customerId}, function(results) {
    if (results.length > 0) {
      if (results[0].authNumber === authNumber) {
        util._success(res, {result: 'success', customerId: results[0].id});
      } else {
        logger.error('[index.js - /auth/startApp] 인증번호가 일치하지 않습니다. 정확한 번호를 입력해 주세요.');
        util._error(res, {reason: '인증번호가 일치하지 않습니다.\n정확한 번호를 입력해 주세요.'});
      }
    } else {
      logger.error('[index.js - /auth/startApp] 유저 검색도중 에러가 발생했습니다.');
      util._error(res, {reason: '유저 검색도중 에러가 발생했습니다.'});
    }
  }, function (error) {
    logger.error('[index.js - /auth/startApp] 유저 검색도중 에러가 발생했습니다.');
    util._error(res, {reason: '유저 검색도중 에러가 발생했습니다.'});
  });
});

/* complete by rachel */
router.post(prefix + '/event/user', function (req, res, next) {

  var data = req.body;
  var customerId = data.customerId;
  var param = {};
  var conditions = {id: customerId};
  logger.info('[index.js - /event/user] params: ' + JSON.stringify(data));

  if (isParamNull(customerId)) {
    logger.error('[index.js - /event/user] 아이디값이 올바르지 않습니다.');
    util._error(res, {reason: '아이디값이 올바르지 않습니다.'});
    return;
  }

  if (isParamNull(data.name) || isParamNull(data.address1) || isParamNull(data.address2) || isParamNull(data.postNo)) {
    logger.error('[index.js - /event/user] 입력된 유저정보가 올바르지 않습니다.');
    util._error(res, {reason: '입력된 유저정보가 올바르지 않습니다.'});
    return;
  }

  param.name = data.name;
  param.addr1 = data.address1;
  param.addr2 = data.address2;
  param.postNo = data.postNo;

  model.user.selectUser(conditions, function(results) {
    if (results[0] != undefined) {
      model.user.updateUser(conditions, param, function(results) {
        util._success(res, results);
      }, function (error) {
        util._error(res, {reason: '유저 업데이트 도중 에러가 발생했습니다.'});
      });
    } else {
      param.id = customerId;
      model.user.insertUser(param, function(results) {
        util._success(res, results);
      }, function (error) {
        util._error(res, {reason: '유저정보 등록 도중 에러가 발생했습니다.'});
      });
    }
  }, function (error) {
    util._error(res, {reason: '유저정보 불러오던 도중 에러가 발생했습니다.'});
  })
});

router.get(prefix + "/userInfo/:cid", function (req, res, next) {
  logger.info('[index.js - /userInfo/:cid] start');
  var id = req.params.cid;
  logger.info('[index.js - /userInfo/:cid] id: ' + id);

  if (isParamNull(id)) {
    util._error(res, {reason: "아이디 값이 잘못되었습니다."});
    return;
  }

  model.user.selectUser({id: id}, function (l) {
    util._success(res, l);
  }, function (e) {
    logger.error('[index.js - /userInfo/:cid] 유저정보 불러오던 도중 에러가 발생했습니다.');
    util._error(res, {reason: "유저정보 불러오던 도중 에러가 발생했습니다."});
  });
});

/* complete by rachel */
router.post(prefix + '/request/:quantity/:type', function (req, res, next) {
  logger.info('[index.js - /request/:quantity/:type] START');

  var status = 0;
  var quantity = req.params.quantity;
  var cardName = util._getCardName(req.body.cardName);
  var cardNumber = req.body.cardNumber;
  var cardExpiredAt = req.body.cardExpiredAt;
  var deliveryAt = req.body.deliveryAt;

  if (isParamNull(quantity)) {
    logger.error('[index.js - /userInfo/:cid] 수량정보가 잘못 입력 되었습니다.');
    util._error(res, {reason: '수량정보가 잘못 입력 되었습니다.'});
    return;
  }

  if (isParamNull(req.params.type)) {
    logger.error('[index.js - /userInfo/:cid] 신청한 타입 정보가 잘못 입력 되었습니다.');
    util._error(res, {reason: '신청한 타입 정보가 잘못 입력 되었습니다.'});
    return;
  }

  var requestData = {};
  requestData.status = status;
  requestData.modelId = req.params.type;
  requestData.eventId = req.body.eventId;
  requestData.paymentPlanId = req.body.paymentPlanId;

  model.user.selectUser({id: req.body.customerId}, function(results) {

    if (results.length === 0) {
      logger.error('[index.js - /userInfo/:cid] 유저를 찾을 수 없습니다.');
      util._error(res, {reason: '유저를 찾을 수 없습니다.'});
      return;
    }

    if (results.length > 1) {
      logger.error('[index.js - /userInfo/:cid] 해당 아이이로 검색된 또다른 중복 유저가 있습니다.');
      util._error(res, {reason: '해당 아이이로 검색된 또다른 중복 유저가 있습니다.'});
      return;
    }

    if (req.body.customerId != results[0].id) {
      logger.error('[index.js - /userInfo/:cid] 전송된 아이디와 검색된 아이디가 일치하지 않습니다.');
      util._error(res, {reason: '전송된 아이디와 검색된 아이디가 일치하지 않습니다.'});
      return;
    }

    var customer = results[0];
    requestData.customerId = customer.id;

    var phoneNumber = results[0].phoneNumber;
    var content = "스위처 한 달 무료체험\n"
      + "신청해 줘서 고마워요 :-)\n\n"
      + "지금 앱을 설치 하시면\n"
      + "예정 배송일 확인과\n"
      + "잘못 선택한 스위처 타입(구)\n"
      + "변경이 가능해요.\n\n"
      + "아이폰 : http://apple.co/24KZWTj\n"
      + "안드로이드: play.google.com/store/apps/details?id=kr.switcher.switcherm";

    model.request.selectRequest({eventId: requestData.eventId, customerId: requestData.customerId}, function(results) {
      var requestByCustomer = results;

      model.request.selectRequest({'eventId': requestData.eventId}, function(results) {
        var requests = results;

        model.event.selectEventProduct({'eventId': requestData.eventId}, function(results) {

          var cnt = requests.length;
          var maxCnt = (function (results) {
            var quantity = 0;
            for (var i=0; i<results.length; i++) {
              quantity += results[i].quantity * 1;
            }

            return quantity;
          })(results);

          if (cnt < maxCnt) {
            if (requestByCustomer.length > 0) {
              logger.error('[index.js - /userInfo/:cid] 기존신청 내역이 존재합니다. 하나만 신청할 수 있습니다.');
              util._error(res, {reason: '기존신청 내역이 존재합니다. 하나만 신청할 수 있습니다.'});
            } else {
              model.request.insertRequest(requestData, function (results) {
                var requestResults = results;
                var requestId = requestResults[0].id;

                var deliveryData = {};
                deliveryData.invoice = "-";
                deliveryData.status = 4;
                deliveryData.requestId = requestId;
                deliveryData.type = req.params.type;
                deliveryData.postNo = customer.postNo;
                deliveryData.addr1 = customer.addr1;
                deliveryData.addr2 = customer.addr2;

                model.delivery.insertDelivery(deliveryData, function (results) {
                  console.log('[index.js - /userInfo/:cid] send SMS phoneNumber: ' + phoneNumber);
                  model.card.insertCard({requestId: requestId, name: cardName, number: cardNumber, expiredAt: cardExpiredAt}, function(results) {
                    var creditCardId = results[0].id;
                    model.request.updateRequest({id: requestId}, {creditCardId: creditCardId}, function(results) {
                      smsUtil.sendLMS(res, requestResults, [phoneNumber], '스위처 신청완료', content);
                    })
                  }, function(error) {
                    util._error(res, error);
                  });
                }, function (error) {
                  util._error(res, error);
                });
              }, function (error) {
                util._error(res, error);
              });
            }
          } else {
            util._error(res, {error: 'max'});
          }
        });
      });
    });
  }, function (e) {
    util._error(res, e);
  });
});

router.post(prefix + '/tempMember/insert', function (req, res, next) {
  logger.info('[index.js - /tempMember/insert] start');

  var d = new Date();
  var dformat = [d.getFullYear(), d.getMonth() + 1, d.getDate()].join('/') + ' ' +
    [d.getHours(), d.getMinutes(), d.getSeconds()].join(':');

  var content = "스위처 대기 신청 감사해요!\n"
    + "다음 주 월요일 오픈 전에\n"
    + "SMS로 다시 알려 드릴게요.";

  var insert = function (data) {
    db.info.save(data, function (error, result) {
      logger.info('[index.js - /tempMember/insert] db.info.save error: ' + error);
      logger.info('[index.js - /tempMember/insert] db.info.save result: ' + result);

      if (!error) {
        smsUtil.sendSMS(res, null, [data.phoneNumber], content);
      }
    });
  };

  var today = [d.getFullYear(), d.getMonth() + 1, d.getDate()].join('/');
  var phoneNumber = req.body.phoneNumber;
  db.info.find({phoneNumber: phoneNumber, date: {$regex: today}}, function (err, docs) {

    if (docs.length > 0) {
      util._success(res, {result: 'duplicated'});
      return;
    }

    var insert_data = {_id: '', phoneNumber: phoneNumber, campaign: req.body.campaign, date: dformat};
    db.info.find(function (err, docs) {

      var list = docs;
      var no = list.length + 1;

      insert_data._id = no;
      if (insert_data.campaign == undefined) {
        insert_data.campaign = 'no_set';
      }

      insert(insert_data);
    });

  });
});

router.get(prefix + '/number/list', function (req, res, next) {
  logger.info('[index.js - /number/list] start');
  db.info.find(function (err, docs) {

    var list = docs;
    var conf = {};

    conf.name = "userlist";
    conf.cols = [
      {
        caption: 'no',
        type: 'string',
        beforeCellWrite: function (row, cellData) {
          return cellData.toUpperCase();
        },
        width: 28
      },
      {
        caption: 'campaign',
        type: 'string',
        width: 28
      },
      {
        caption: 'phoneNumber',
        type: 'string',
        width: 30
      },
      {
        caption: 'date',
        type: 'string',
        width: 40
      }
    ];
    conf.rows = [];

    for (var index = 0; index < list.length; index++) {
      var row = [];
      row.push(index + "");
      row.push(list[index].campaign || "no_set");
      row.push(list[index].phoneNumber || "no_set");
      row.push(list[index].date || "no_set");
      conf.rows.push(row);
      row = [];
    }

    console.log(conf);
    var result = nodeExcel.execute(conf);
    res.setHeader('Content-Type', 'application/vnd.openxmlformats');
    res.setHeader("Content-Disposition", "attachment; filename=" + "Report.csv");
    res.end(result, 'binary');
  });
});

/* complete by rachel */
router.post(prefix + '/eventinfo/card', function (req, res, next) {
  var data = req.body;
  var id = data.customerId;
  var type = data.type;
  var param = {};
  var phoneNumber;
  logger.info('[index.js - /eventinfo/card] params: ' + JSON.stringify(data));

  if (isParamNull(id)) {
    logger.error('[index.js - /eventinfo/card] 아이디값이 올바르지 않습니다.');
    util._error(res, {reason: '아이디값이 올바르지 않습니다.'});
    return;
  }

  if (isParamNull(type)) {
    logger.error('[index.js - /eventinfo/card] 요청한 스위처 type이 올바르지 않습니다.');
    util._error(res, {reason: '요청한 스위처 type이 올바르지 않습니다.'});
    return;
  }

  if (isParamNull(data.cardCmpNumber) || isParamNull(data.cardExpiredAt) || !util.checkCreditCardIsValid(data.cardNumber)) {
    logger.error('[index.js - /eventinfo/card] 요청한 카드정보가 올바르지 않습니다. card number: ' + data.cardNumber);
    util._error(res, {reason: '요청한 카드정보가 올바르지 않습니다.'});
    return;
  }

  param.number = data.cardNumber;
  param.name = util._getCardName(data.cardCmpNumber);
  param.expiredAt = data.cardExpiredAt;

  model.user.selectUser({id: id}, function(results) {
    console.log('id: ' + id + ', id: ' + results[0].id + ', id: ' + results.id);
    if (id != results[0].id) {
      util._error(res, {reason: '요청한 아이디와 검색된 아이디가 일치하지 않습니다.'});
      return;
    }

    phoneNumber = results[0].phoneNumber;
    param.phoneNumber = phoneNumber;

    if (data.utm_source.length <= 0) {
      util._success(res, param);
      return;
    }

    var campaignData = {
      eventId: data.eventid,
      source: data.utm_source,
      medium: data.utm_medium,
      campaign: data.utm_campaign,
      phoneNumber: phoneNumber
    };
    model.campaign.insertCampaign(campaignData, function (results) {
      util._success(res, param);
    }, function (error) {
      util._error(res, error);
    });
  }, function (error) {
    util._error(res, error);
  });
});

router.get(prefix + '/:filename', function (req, res, next) {
  logger.info('[index.js - /:filename] start');
  var fileName = req.params.filename;
  var filepath = __dirname + "/../" + fileName;
  var resData = "";

  lineReader.eachLine(filepath, function (line, last) {

    resData += line;
    if (last) {
      res.setHeader('content-type', 'text/plan');
      res.write(resData);
    } else {
      resData += "\n";
    }
  });

});

router.post(prefix + "/check/cardNumber", function (req, res, next) {

  var cardNumber = req.body.cardNumber,
    cardExpDate = req.body.cardExpDate,
    reqParams = {
      api_key: "hgEY70BdDgoJYVOwj5CHsRDQt5a6IieQLQv+Q2rA6nnW+wXP57fH2ZkvUBJW0c9/eF1Rp5QRZ+qjzJ+Knc8r1A==",
      mid: "tpaytest1m",
      goods_nm: "스위처",
      amt: 1000,
      moid: "",
      mall_user_id: "",
      buyer_nm: "",
      buyer_auth_num: "",
      buyer_tel: "",
      buyer_email: "",
      rcvr_nm: "",
      rcvr_cp: "",
      buyer_addr: "",
      buyer_post_no: "",
      card_code: "03",
      card_num: cardNumber,
      card_exp: cardExpDate,
      card_pwd: "",
      card_cvc: "",
      card_quota: "",
      card_interest: ""
    },
    options = {
      host: "webtx.tpay.co.kr",
      port: 443,
      method: "POST",
      path: "/api/v1/payments",
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    },
    body = querystring.stringify(reqParams);

  options.headers["Content-Length"] = body.length;

  util._request(options, body, function (okRes) {
    util._success(res, okRes);
  }, function (errRes) {
    util._error(res, {reason: "카드정보 확인도중 에러가 발생했습니다."});
  });
});

/*
  by Rachel for Purchase A/B Testing
 */
router.get(prefix + '/purchases/:pageNumber', function (req, res, next) {
  var pageNumber = req.params.pageNumber;
  console.log('[purchase/index] pageNumber START: ' + pageNumber);
  res.render('purchases/' + pageNumber, { title: '스위처' });
});

router.put(prefix + '/purchases/:pageNumber', function (req, res, next) {
  var pageNumber = req.params.pageNumber;

  var date = new Date();
  var dateFormat = [date.getFullYear(), date.getMonth() + 1, date.getDate()].join('/') + ' ' +
    [date.getHours(), date.getMinutes(), date.getSeconds()].join(':');
  var today = [date.getFullYear(), date.getMonth() + 1, date.getDate()].join('/');

  purchaseDB.priceTests.find({pageNumber: pageNumber}, function (error, documents) {
    if (documents.length <= 0) {
      var data = {
        pageNumber: pageNumber,
        visitorCount: 1,
        phoneNumberCount: 0
      };

      purchaseDB.priceTests.save(data, function (error, results) {
        util._success(res, {status: 'success'});
      });
    } else {
      var id = documents[0]._id;
      var visitorCount = documents[0].visitorCount;

      purchaseDB.priceTests.update({_id: id}, {$set: {visitorCount: (visitorCount * 1) + 1}}, function (error, results) {
        util._success(res, {status: 'success'});
      });
    }
  });
});

router.post(prefix + '/purchases/:pageNumber', function (req, res, next) {
  var pageNumber = req.body.pageNumber;
  var phoneNumber = req.body.phoneNumber;

  var date = new Date();
  var dateFormat = [date.getFullYear(), date.getMonth() + 1, date.getDate()].join('/') + ' ' +
    [date.getHours(), date.getMinutes(), date.getSeconds()].join(':');
  var today = [date.getFullYear(), date.getMonth() + 1, date.getDate()].join('/');

  purchaseDB.awaiters.save({pageNumber: pageNumber, phoneNumber: phoneNumber, createdAt: dateFormat}, function (error, results) {
    purchaseDB.priceTests.find({pageNumber: pageNumber}, function (error, documents) {
      var id = documents[0]._id;
      var phoneNumberCount = documents[0].phoneNumberCount;

      purchaseDB.priceTests.update({_id: id}, {$set: {phoneNumberCount: (phoneNumberCount * 1) + 1}}, function (error, results) {
        util._success(res, {status: 'success'});
      });
    });
  });
});

router.get(prefix + '/purchases/page/result', function (req, res, next) {
  purchaseDB.priceTests.find().sort({pageNumber: 1}, function(err, documents) {
    util._success(res, {list: documents});
  });
});





module.exports = router;
