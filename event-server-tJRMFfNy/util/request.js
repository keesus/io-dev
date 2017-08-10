/**
 * Created by Rachel on 2016. 7. 7..
 */

var https = require('https');
var http = require('http');
var winston = require('winston');
var moment = require('moment');

var common = require('./common');

var logger = new (winston.Logger)({
    transports: [
        new (winston.transports.Console)({
            timestamp: function(){
                return moment().format("YYYY-MM-DD HH:mm:ss");
            }
        })
    ]
});


var request = {

    _request : function(option, data, success, error) {
        logger.info('[request.js - _request] function start');

        var params = [option, data, success, error];
        var paramIsEmpty = common.checkParamsAreEmpty(params);
        if(paramIsEmpty) {
            logger.error('[request.js - _request] params include an undefined or null param');
            throw new Error('params include an undefined or null param');
        }

        var protocol = option.port  === 443 ? https : http;
        var request = protocol.request(option, function(response) {

            var body = '';

            response.on('data', function(resData) {
                body += resData;
            });

            response.on('end', function(resData) {
                console.log('[body] ' + JSON.stringify(body));
                if(response.statusCode >= 200 && response.statusCode < 300) {
                    success(body);
                } else {
                    var errorMsg = 'http/https request error. statusCode : ' + response.statusCode;
                    error(new Error(errorMsg));
                }
            });

        }).on('error', function(error) {
            var errorMsg = 'http/https request error.';
            error(new Error(errorMsg));
        });

        request.write(data);
        request.end();
        request.on('error', function(err) {
            var errorMsg = 'http/https request error. error : ' + err;
            error(new Error(errorMsg));
        });
    }

};

module.exports = request;