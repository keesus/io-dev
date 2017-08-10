var express = require('express');
var router = express.Router();
var util = require('../util/util');
var model = require('../model/index');
var config = require('../config/sms_conf');
var mongojs = require('mongojs');
var db = mongojs("temporaryUser",['info']);
var fs = require('fs');
var lineReader = require('line-reader');
var nodeExcel = require('excel-export');
var querystring = require('querystring');
var prefix = "/event";
/* GET home page. */
router.get(prefix+'/checkUser', function(req, res, next) {
  var eventId;
  var max;

  var userCnt;
  model.event.selectEvent({"status":1}, function(l) {

    if (l.length > 0) {

      eventId = l[0].id;

      model.event.selectEventPrd({"EventId":eventId}, function (r) {
        console.log(r[0].quentity);
        max = r[0].quentity;
        model.request.selectRequest({"EventId":eventId}, function(userlist) {
          //max = userlist.length;
          userCnt = userlist.length;
          //res.render('index',{data:{max:max,userCnt:userCnt,eventId:eventId}});
          res.status(200).send({data:{max:max,userCnt:userCnt,eventId:eventId}});
        });
      });

    } else {
      //res.render('index',{max:"no data"});
      res.status(200).send({max:"no data"});
    }
  });
});

//
//router.get('/pay', function ( req,res,next ) {
//
//    res.render('pay');
//});

router.get(prefix+'/eventInfo', function (req,res,next) {

  var eventId;
  var max;
  var userCnt;

  model.event.selectEvent({"status":1}, function(l) {

    if (l.length > 0) {

      eventId = l[0].id;
     
      model.event.selectEventPrd({"EventId":eventId}, function (r) {
        
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
                  "0002" : oneTypeQuentity,
                  "0003" : twoTypeQuentity
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
                 "0002" : oneTypeQuentity,
                 "0003" : twoTypeQuentity
              };
            
        })(r);
        
        model.request.selectRequest({"EventId":eventId}, function(userlist) {
          
          userCnt = userlist.length;
          
          divideQuentity = (function (list) {
            var oneTypeQuentity =0, twoTypeQuentity = 0;

            if (list.length === 0) {
                return {
                  "0002" : oneTypeQuentity,
                  "0003" : twoTypeQuentity
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
              "0002" : oneTypeQuentity,
              "0003" : twoTypeQuentity
            };
          })(userlist);
          
          
          util._success(res,{max:max,userCnt:userCnt,eventId:eventId,divideMax : typesMax, divideQuentity : divideQuentity});
        }, function (e) {
          util._success(res,{error:"no event"});
        });
      }, function (e) {
         util._success(res,{error:"no event"});
      });

    } else {
      util._success(res,{error:"no event"});
    }
  });
});

/* 
  qa전용
*/
router.get(prefix+'/member/eventInfo', function (req,res,next) {

  var eventId;
  var max;
  var userCnt;

  model.event.selectEvent({"status":8}, function(l) {

    if (l.length > 0) {

      eventId = l[0].id;
     
      model.event.selectEventPrd({"EventId":eventId}, function (r) {
        
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
                  "0002" : oneTypeQuentity,
                  "0003" : twoTypeQuentity
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
                 "0002" : oneTypeQuentity,
                 "0003" : twoTypeQuentity
              };
            
        })(r);
        
        model.request.selectRequest({"EventId":eventId}, function(userlist) {
          
          userCnt = userlist.length;
          
          divideQuentity = (function (list) {
            var oneTypeQuentity =0, twoTypeQuentity = 0;

            if (list.length === 0) {
                return {
                  "0002" : oneTypeQuentity,
                  "0003" : twoTypeQuentity
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
              "0002" : oneTypeQuentity,
              "0003" : twoTypeQuentity
            };
          })(userlist);
          
          
          util._success(res,{max:max,userCnt:userCnt,eventId:eventId,divideMax : typesMax, divideQuentity : divideQuentity});
        }, function (e) {
          util._success(res,{error:"no event"});
        });
      }, function (e) {
         util._success(res,{error:"no event"});
      });

    } else {
      util._success(res,{error:"no event"});
    }
  });
});

/* 사용하는 부분이 없음 */ 
// router.get(prefix+'/card', function(req, res, next) {
//   var eventId;
//   var max;
//   var userCnt;
//   model.event.selectEvent({"status":1}, function(l) {

//     if (l.length > 0) {

//       eventId = l[0].id;

//       model.event.selectEventPrd({"EventId":eventId}, function (r) {
//         max = r[0].quentity;
//         model.request.selectRequest({"EventId":eventId}, function(userlist) {
//           max = userlist.length;
//           userCnt = userlist.length;
//           //res.render('pay/card',{max:max,userCnt:userCnt,eventId:eventId});
//           util._success(res,{max:max,userCnt:userCnt,eventId:eventId});
//         });
//       });

//     } else {
//       //res.render('pay/card',{max:"no data"});
//       util._error(res,{max:"no data"});
//     }
//   });
// });

router.get(prefix+'/complete', function(req, res, next) {

  if (req.query.id == undefined || req.query.id == null || req.query.id == "") {
    util._error(res,{reason:"아이디 값이 잘못되었습니다."});
    return;
  }

  model.user.selectUser({id:req.query.id}, function (l) {
    if (l.length > 0) {
      util._success(res,{ name: l[0].name, phoneNumber:l[0].phoneNumber, address:l[0].addr1+" "+l[0].addr2 });
    } else {
      util._error(res,{reason:"유저의 정보를 찾을 수 없습니다."});
    }
  }, function (e) {
    util._error(res,{reason:"유저의 정보를 확인하던 도중 에러가 발생했습니다."});
  });

});
/**
 * 사용하지 않는 부분
 */
// router.get(prefix+'/free', function (req,res,next) {

//   var eventId;
//   var max;
//   var userCnt;

//   model.event.selectEvent({"status":1}, function(l) {

//     if (l.length > 0) {

//       eventId = l[0].id;

//       model.event.selectEventPrd({"EventId":eventId}, function (r) {
//         max = r[0].quentity;
//         model.request.selectRequest({"EventId":eventId}, function(userlist) {
//           max = userlist.length;
//           userCnt = userlist.length;
//           //res.render('pay/free',{max:max,userCnt:userCnt,eventId:eventId});
//           util._success(res,{max:max,userCnt:userCnt,eventId:eventId});
//         });
//       });

//     } else {
//         util._success(res,{max:"no data"});
//         //res.render('pay/free',{max:"no data"});
//     }
//   });
// });
/**
 * 사용하지 않는 부분
 */
// router.get(prefix+'/device', function(req, res, next) {

//   var eventId;
//   var max;
//   var userCnt;

//   model.event.selectEvent({"status":1}, function(l) {

//     if (l.length > 0) {

//       eventId = l[0].id;

//       model.event.selectEventPrd({"EventId":eventId}, function (r) {
//         max = r[0].quentity;
//         model.request.selectRequest({"EventId":eventId}, function(userlist) {
//           max = userlist.length;
//           userCnt = userlist.length;
//           util._success(res,{max:max,userCnt:userCnt,eventId:eventId});
//         });
//       });

//     } else {
//       //res.render('pay/device',{max:"no data"});
//       util._success(res,{max:"no data"});
//     }
//   });
// });
/**
 * 사용하지 않는 부분
 */
// router.get(prefix+'/plan', function(req, res, next) {
//   var eventId;
//   var max;
//   var userCnt;
//   model.event.selectEvent({"status":1}, function(l) {

//     if (l.length > 0) {

//       eventId = l[0].id;

//       model.event.selectEventPrd({"EventId":eventId}, function (r) {
//         max = r[0].quentity;
//         model.request.selectRequest({"EventId":eventId}, function(userlist) {
//           max = userlist.length;
//           userCnt = userlist.length;
//           //res.render('pay/plan',{max:max,userCnt:userCnt,eventId:eventId});
//           util._success(res,{max:max,userCnt:userCnt,eventId:eventId});
//         });
//       });

//     } else {
//       //res.render('pay/plan',{max:"no data"});
//       util._success(res,{max:"no data"});
//     }
//   });
// });
/**
 * 사용하지 않는 부분
 */
// router.get(prefix+'/user', function(req, res, next) {
//   var eventId;
//   var max;
//   var userCnt;
//   model.event.selectEvent({"status":1}, function(l) {

//     if (l.length > 0) {

//       eventId = l[0].id;

//       model.event.selectEventPrd({"EventId":eventId}, function (r) {
//         max = r[0].quentity;
//         model.request.selectRequest({"EventId":eventId}, function(userlist) {
//           max = userlist.length;
//           userCnt = userlist.length;
//           //res.render('pay/user',{max:max,userCnt:userCnt,eventId:eventId});
//           util._success(res,{max:max,userCnt:userCnt,eventId:eventId});
//         });
//       });

//     } else {
//       //res.render('pay/user',{max:"no data"});
//       util._success(res,{max:"no data"});
//     }
//   });
// });
//router.get('/terms', function (req,res,next) {
//
//  res.render('terms');
//});

router.post(prefix+'/auth/number', function (req, res, next) {

  console.log(1);
  var makeAuthString = function (currentDate) {

    var str1 = currentDate.substr(0,4);
    var str2 = currentDate.substr(currentDate.length-4,4);

    return ((str1*str2)+"").substr(0,4);

  };

  var phoneNumber = req.body.phoneNumber,
      authDate = new Date().getTime()+"",
      authStr = makeAuthString(authDate),
      credential = 'Basic '+new Buffer(config.appid+':'+config.apiKey).toString('base64');

  /*var customerid = new Date().getMilliseconds();
  customerid = ((customerid * new Date().getDate())+"");*/
  var customerid = new Date().getTime();
  customerid = "C" + customerid + phoneNumber.substring(phoneNumber.length-2, phoneNumber.length);
  console.log('[index.js - /auth/number] customerid: ' + customerid + ', phonenumber: ' + phoneNumber);

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
    "sender"     : config.sender,
    "receivers"  : [phoneNumber],
    "content"    : config.prefix + authStr + config.end
  };

  reqOpt.headers['Content-Length'] = Buffer.byteLength(JSON.stringify(reqData));
  /*
   * user table에 row 생성, 인증번호도 field로 등록
   * */
  model.user.insertUser({
    id : customerid,
    phoneNumber : phoneNumber,
    authNumber  : authStr
  },function(result) {

    util._request(reqOpt,JSON.stringify(reqData),function (okBody) {
      util._success(res,{id : customerid});
    }, function (errorBody) {
      console.log(errorBody);
      util._error(res,errorBody);
    });

  },function(insertError) {
    console.log(insertError);

    if (insertError["result"] === "id-duplicated") {
      util._error(res,'신청 버튼을 다시 눌러주세요!');
    } else if (insertError["result"] === "pn-duplicated") {

      model.user.updateUser({
        phoneNumber:phoneNumber
      },{
        authNumber  : authStr
      }, function (updateResult) {

        model.user.selectUser({phoneNumber:phoneNumber}, function (l) {

          util._request(reqOpt,JSON.stringify(reqData),function(okBody) {
            console.log(12345667);
            util._success(res,{id :l[0].id});
          }, function(errorBody) {
            console.log(errorBody);
            util._error(res,errorBody);
          });

        }, function (e) {
          util._error(res,e);
        });

      }, function (errorResult) {
        console.log(55);
        util._error(res,errorResult);
      });

    } else {
      util._error(res,insertError);
    }

  });
});

router.get(prefix+'/auth/startApp', function (req,res,next) {

  var authNumber = req.query.authNumber,
      id = req.query.id;

  model.user.selectUser({id: id}, function (list) {
    console.log(list[0].authNumber === authNumber);
    if (list[0].authNumber === authNumber) {
      util._success(res,{result:"success",id:list[0].id});
    } else {
      util._error(res,{result: "not matched number"});
    }

  }, function (err) {
    util._error(res,err);
  })

});

router.post(prefix+'/event/user', function( req,res,next ) {
  var id = req.body.customerId;
  var data = req.body;
  var param = {};
  var wp = {id:id};

  param.name = data.name;
  param.addr1 = data.address1;
  param.addr2 = data.address2;
  param.postNo = data.postNo;

  model.user.selectUser(wp, function (list) {

    if (list[0] != undefined) {

      model.user.updateUser(wp,param, function (list) {
        util._success(res,list);
      }, function (err) {
        util._error(res,err);
      });

    } else {

      param.id = id;

      model.user.insertUser(param, function (list) {
        util._success(res,list);
      }, function (err) {
        util._error(res,err);
      });
    }
  }, function (err) {
    util._error(res,err);
  })
});

router.get(prefix+"/userInfo/:cid", function (req,res,next) {

  var id = req.params.cid;

  model.user.selectUser({id:id},function (l) {
     util._success(res,l);
  }, function (e) {
     util._success(res,e);
  });
});


router.post(prefix+'/request/:quantity/:type', function (req,res,next) {
  var id = (function () {
       var requestid = new Date().getTime();
        return "R"+requestid;
      })(),
      status = 0,
      quantity = req.params.quantity;

  var param = {};

  param.id = id;
  param.quantity = quantity;
  param.status = status;
  param.type = req.params.type;
  param.EventId = req.body.eventid;
  param.paymentPlan = req.body.paymentPlan;

  var dParam = {};
  dParam.invoice = "-";
  dParam.quantity = quantity;
  dParam.status = 0;
  dParam.RequestId = id;
  dParam.type = req.params.type;

  var pdParam = {};
  pdParam.RequestId = id;
  pdParam.inventory = quantity;

  model.user.selectUser({id:req.body.customerId}, function (l) {
    console.log(l);
    param.CustomerPhoneNumber = l[0].phoneNumber;
    dParam.phoneNumber = l[0].phoneNumber;
    var rl;
    model.request.selectRequest({EventId:param.EventId,CustomerPhoneNumber:param.CustomerPhoneNumber}, function (rl) {
	rl = rl;
	model.request.selectRequest({"EventId":param.EventId}, function(userlist) {
     model.event.selectEventPrd({"EventId":param.EventId}, function (r) {
        
        var cnt = userlist.length;
        var maxCnt = (function (res) {
              var quentity = 0;
              
              for (var i = 0; i < res.length; i++) {
                 quentity += res[i].quentity*1;
              }
              
              return quentity;
        })(r);
        
        if (cnt < maxCnt) {
                  if (rl.length >0) {
                      util._error(res,{reason:"기존신청 내역이 존재합니다. 하나만 신청할 수 있습니다."})
                  } else {
                      model.request.insertRequest(param, function (list) {
                          model.delivery.insertDeliveryData(dParam, function (r) {
                            model.request.insertRequestDevice(pdParam, function (resp) {
                            util._success(res,list);
                            }, function (err) {
                              util._error(res,err);
                            });
                          }, function (err) {
                              util._error(res,err);
                          });
                      }, function (err) {
                          util._error(res,err);
                      });
                  }		


        } else {
          util._error(res,{error:"max"});
        }	
     });
	});


    });
  }, function (e) {
    util._error(res,e);
  });
});

router.post(prefix+'/tempMember/insert', function (req,res,next) {

  var d = new Date();
  var dformat = [d.getFullYear(),
               d.getMonth()+1,
               d.getDate()].join('/')+' '+
              [d.getHours(),
               d.getMinutes(),
               d.getSeconds()].join(':');
               
  var insert = function(data){
    db.info.save(
        data,function(error,result){
          console.log(error);
          console.log(result);
          if(!error)
            util._success(res,{result:"success"});
          // db.close();
        });
  };
  var insert_data = {_id:"",phoneNumber:req.body.phoneNumber,campaign:req.body.campaign,date:dformat};
  
  db.info.find(function (err,docs) {
    console.log("======================");
    var list = docs;
    var no = list.length +1;
    
    insert_data._id = no;
    if (insert_data.campaign == undefined) {
      insert_data.campaign = "no_set";
    }
    insert(insert_data);
  });
  
});

router.get(prefix+'/number/list', function (req,res,next) {
  
    db.info.find(function (err, docs) {
        
        var list = docs;
        var conf = {};
        
        conf.name="userlist";
        conf.cols = [
          {
            caption:'no',
            type:'string',
            beforeCellWrite:function (row,cellData) {
              return cellData.toUpperCase();
            },
            width:28
          },
          {
            caption:'campaign',
            type:'string',
            width:28
          },
          {
            caption:'phoneNumber',
            type:'string',
            width:30
          },
          {
            caption:'date',
            type:'string',
            width:40
          }
        ];
        conf.rows = [];
        
        for (var index = 0; index < list.length; index++) {
          var row = [];
          row.push(index+"");
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

router.post(prefix+'/eventinfo/card', function (req,res,next) {

  var id = req.body.customerId;
  var type = req.body.type;
  var data = req.body;
  var param = {};
  var phoneNumber;
  param.cardNumber = data.cardNumber;
  param.name = util._getCardName(data.cardCmpNumber);
  param.type = type;
  param.expireDate = data.expDate;

  model.user.selectUser({id:id}, function (l) {
    phoneNumber = l[0].phoneNumber;
    param.phoneNumber = phoneNumber;

    model.card.selectCard({phoneNumber:phoneNumber}, function (list) {

      model.card.insertCard(param, function (list) {
        util._success(res,list);
      }, function (err) {
        util._error(res,err);
      });

    }, function (err) {
      util._error(res,err);
    });
  }, function (e) {
    util._error(res,e);
  });


});

router.get(prefix+'/:filename', function (req,res,next) {

  var fileName = req.params.filename;
  var filepath =__dirname+"/../"+fileName;
  var resData = "";
  console.log("1");

  lineReader.eachLine(filepath, function(line, last) {

    console.log(line);
    resData +=line;
    console.log(last);
    if (last) {
      res.setHeader('content-type', 'text/plan');
      res.write(resData);
    } else {
      resData +="\n";
    }
  });

});

router.post(prefix+"/check/cardNumber", function (req,res,next) {

    var cardNumber = req.body.cardNumber;
    var cardExpDate = req.body.cardExpDate;
    var reqParams = {
        api_key:"hgEY70BdDgoJYVOwj5CHsRDQt5a6IieQLQv+Q2rA6nnW+wXP57fH2ZkvUBJW0c9/eF1Rp5QRZ+qjzJ+Knc8r1A==",
        mid:"tpaytest1m",
        goods_nm:"스위처",
        amt:1000,
        moid:"",
        mall_user_id:"",
        buyer_nm:"",
        buyer_auth_num:"",
        buyer_tel:"",
        buyer_email:"",
        rcvr_nm:"",
        rcvr_cp:"",
        buyer_addr: "",
        buyer_post_no:"",
         card_code:"03",
        card_num:cardNumber,
        card_exp:cardExpDate,
        card_pwd:"",
        card_cvc:"",
        card_quota:"",
        card_interest:""
    };
    var options = {
        host : "webtx.tpay.co.kr",
        port: 443,
        method: "POST",
        path : "/api/v1/payments",
        headers : {
            'Content-Type' : 'application/x-www-form-urlencoded'
        }
    };
    var body = querystring.stringify(reqParams);
    
    options.headers["Content-Length"] = body.length;

    util._request(options,body,function(okRes){
        util._success(res,okRes);
    },function(errRes) {
        util._error(res,errRes);
    });



});

module.exports = router;
