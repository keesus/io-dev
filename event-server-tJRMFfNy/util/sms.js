/**
 * Created by Rachel on 2016. 7. 8..
 */

var requestUtil = require('./request');
var util = require('./util');

var utils = {
  
  sendSMS: function(res, responseData, receivers, content) {
    
    var credential = 'Basic '+new Buffer('IO_SWITCHER' + ':' + 'f7070dceb2ef11e5b2b70cc47a1fcfae').toString('base64');
    var option = {
      host: 'api.bluehouselab.com',
      port: 443,
      path: '/smscenter/v1.0/sendsms',
      method: 'POST',
      headers: {
        'Authorization': credential,
        'Content-Type': 'application/json; charset=utf-8'
      }
    };

    var data = {
      sender: '0262129272',
      receivers: receivers,
      content: content
    };

    option.headers['Content-Length'] = Buffer.byteLength(JSON.stringify(data));
    requestUtil._request(option, JSON.stringify(data), function(body) {
      if(responseData === null || responseData == 'null') {
        util._success(res, {result: 'success'});
      } else {
        util._success(res, data);
      }
    }, function() { util._success(res, {result: 'error'}); })
  },

  sendLMS: function(res, responseData, receivers, subject, content) {

    var credential = 'Basic '+new Buffer('IO_SWITCHER' + ':' + 'f7070dceb2ef11e5b2b70cc47a1fcfae').toString('base64');
    var option = {
      host: 'api.bluehouselab.com',
      port: 443,
      path: '/smscenter/v1.0/sendlms',
      method: 'POST',
      headers: {
        'Authorization': credential,
        'Content-Type': 'application/json; charset=utf-8'
      }
    };

    var data = {
      sender: '0262129272',
      receivers: receivers,
      content: content,
      subject: subject
    };

    option.headers['Content-Length'] = Buffer.byteLength(JSON.stringify(data));
    requestUtil._request(option, JSON.stringify(data), function(body) {
      if(responseData === null || responseData == 'null') {
        util._success(res, {result: 'success'});
      } else {
        util._success(res, data);
      }
    }, function() { util._success(res, {result: 'error'}); })
  }

};


module.exports = utils;