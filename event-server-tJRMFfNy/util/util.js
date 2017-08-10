/**
 * Created by baecheolmin on 15. 8. 1..
 */

var logger = require('../config/log');
var https = require('https');
var http = require('http');
var request = require('request');
var config = require('../config/sms_conf');
var cardList = require('../config/cardlist');
var cardValidList = require('../config/cardValidList');
var Utils = {

    _promise : function(condition,data) {
        return new Promise(function(resolve,reject){

            if (condition) {
                resolve(data);
            } else {
                reject("fail");
            }
        })
    },
    _checkCardNumber : function (cardNumber) {

        var validNumber = cardNumber.substr(0,6);
        var isValid = false;
        var re;

        for (var i = 0; i < cardValidList.length; i++) {
                re = new RegExp(cardValidList[i]+"","g");
                if (!isValid) {
                    isValid = re.test(validNumber);
                }
        }

        return isValid;
    },

    checkCreditCardIsValid : function (cardNumber) {

        function valid_credit_card(value) {
            if (/[^0-9-\s]+/.test(value)) return false;

            var nCheck = 0, nDigit = 0, bEven = false;
            value = value.replace(/\D/g, "");

            for (var n = value.length - 1; n >= 0; n--) {
                var cDigit = value.charAt(n),
                    nDigit = parseInt(cDigit, 10);

                if (bEven) {
                    if ((nDigit *= 2) > 9) nDigit -= 9;
                }

                nCheck += nDigit;
                bEven = !bEven;
            }

            return (nCheck % 10) == 0;
        }

        return valid_credit_card(cardNumber);
    },

    _success : function(res,data) {

        var result = {};
        result.data = data;
        if ( res ) {
            logger.i("on util success",JSON.stringify(result));
            res.status(200).send(result);
        }
    },

    _error : function(res,err) {

        if ( res !== null ) {
            logger.e("on util error", JSON.stringify(err));
            res.status(err.status || 999).send(err);
            return;
        }

        throw err;
    },

    _requestTo : function (reqOpt, reqData, successCallback, errorCallback) {
        var option = {};
        option.url="http://"+reqOpt.host+reqOpt.path;
        option.headers = reqOpt.headers;
        option.body = reqData;
        request.post(option,function (e, r, user) {
            console.log(e);
            console.log(r);
            console.log(user);
        }, function(e) {
            console.log(e);
        });
    },

    _getDataValues : function (array) {

        var dataValuesArray = [];

        dataValuesArray = array.map(function (item) {

            return item.dataValues;
        });

        return dataValuesArray;

    },

    _getKeyByValue : function (obj, value) {

        for( var prop in obj ) {
            if( obj.hasOwnProperty( prop ) ) {
                if( obj[ prop ] === value )
                    return prop;
            }
        }
    },
    _getCardName : function (cardCode) {

        var name;

        for (var i = 0 ; i < cardList.length; i++) {

            if (cardList[i].code == cardCode) {
                name = cardList[i].name;
            }
        }

        return name;
    },
    _request : function (reqOpt, reqData, successCallback, errorCallback) {

        var body = reqData;
        var options = reqOpt;
        var protocol = reqOpt.port === 80 ? http : https;
        console.log(options);
        var req = protocol.request(options, function(res) {
            console.log(res.statusCode);
            var body = "";
            res.on('data', function(d) {
                body += d;
            });
            res.on('end', function(d) {
                if(res.statusCode>=200 && res.statusCode < 300) {
                    successCallback(body);
                }  else {
                    errorCallback(body);
                }
            });
        });
        req.write(body);
        req.end();
        req.on('error', function(e) {
            console.log(e);
            errorCallback(e);
        });

    },
    _serialize : function(obj) {
        var str = [];
        for(var p in obj)
            if (obj.hasOwnProperty(p)) {
                str.push(p + "=" + obj[p]);
            }
        return str.join("&");
    },
    base64 : function () {

        var _keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
        var _utf8_encode = function(string) {

        string = string.replace(/\r\n/g,"\n");

        var utftext = "";

            for (var n = 0; n < string.length; n++) {

                var c = string.charCodeAt(n);

                if (c < 128) {
                    utftext += String.fromCharCode(c);
                } else if((c > 127) && (c < 2048)) {
                    utftext += String.fromCharCode((c >> 6) | 192);
                    utftext += String.fromCharCode((c & 63) | 128);
                } else {
                    utftext += String.fromCharCode((c >> 12) | 224);
                    utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                    utftext += String.fromCharCode((c & 63) | 128);
                }
            }
            return utftext;
        },
        _utf8_decode = function (utftext) {
            var string = "";
            var i = 0;
            var c = 0;
            var c1 = 0;
            var c2 = 0;
            var c3 = 0;

            while ( i < utftext.length ) {
                c = utftext.charCodeAt(i);
                if (c < 128) {
                    string += String.fromCharCode(c);
                    i++;
                } else if((c > 191) && (c < 224)) {
                    c2 = utftext.charCodeAt(i+1);
                    string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
                    i += 2;
                } else {
                    c2 = utftext.charCodeAt(i+1);
                    c3 = utftext.charCodeAt(i+2);
                    string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
                    i += 3;
                }
            }
            return string;
        };

        return {
            encode : function (input) {

                var output = "";
                var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
                var i = 0;
                input = _utf8_encode(input);
                while (i < input.length) {
                    chr1 = input.charCodeAt(i++);
                    chr2 = input.charCodeAt(i++);
                    chr3 = input.charCodeAt(i++);

                    enc1 = chr1 >> 2;
                    enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
                    enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
                    enc4 = chr3 & 63;

                    if (isNaN(chr2)) {
                        enc3 = enc4 = 64;
                    } else if (isNaN(chr3)) {
                        enc4 = 64;
                    }

                    output = output +
                    _keyStr.charAt(enc1) + _keyStr.charAt(enc2) +
                    _keyStr.charAt(enc3) + _keyStr.charAt(enc4);
                }

                return output;
            },

            decode : function (input) {


                var output = "";
                var chr1, chr2, chr3;
                var enc1, enc2, enc3, enc4;
                var i = 0;

                input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

                while (i < input.length) {
                    enc1 = _keyStr.indexOf(input.charAt(i++));
                    enc2 = _keyStr.indexOf(input.charAt(i++));
                    enc3 = _keyStr.indexOf(input.charAt(i++));
                    enc4 = _keyStr.indexOf(input.charAt(i++));

                    chr1 = (enc1 << 2) | (enc2 >> 4);
                    chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
                    chr3 = ((enc3 & 3) << 6) | enc4;

                    output = output + String.fromCharCode(chr1);

                    if (enc3 != 64) {
                        output = output + String.fromCharCode(chr2);
                    }

                    if (enc4 != 64) {
                        output = output + String.fromCharCode(chr3);
                    }
                }

                output = _utf8_decode(output);

                return output;
            }
        };
    }

};

module.exports = Utils;