var crypto = require('crypto');
var algorithm = "aes256";

var Ciphers = function (authKey) {

    var result = Math.floor(Math.random() * 1000000)+100000;

    if(result>1000000){
        result = result - 100000;
    };
    this.key = authKey === undefined ? ""+result : authKey;
    this.ciphers = crypto.createCipher(algorithm, this.key);
    this.decCipher =  crypto.createDecipher(algorithm, this.key);
};

Ciphers.prototype.encodeData = function (data) {
    return this.ciphers.update(data, 'utf8', 'hex') + this.ciphers.final('hex');
};

Ciphers.prototype.decodeData = function (data) {
    return this.decCipher.update(data, 'hex', 'utf8') + this.decCipher.final('utf8');
};

Ciphers.prototype.getKey = function () {
    return this.key;
};

Ciphers.prototype.getHashingKey = function () {

    var milisecond = new Date().getMilliseconds();
    var month = (function (n) {

        var month = n+"";
        if (month.length === 1) {
            month = month+"0";
        };

        return month;

    })(new Date().getMonth());


    var hash = Math.floor((this.key * milisecond) / (month * 1000)) + "";

    if (hash.length < 4) {
        hash + Math.floor(Math.random()*9 + 1);
    } else if (hash.length > 4) {
        hash = hash.substr(0,4);
    }

    return hash;
};

module.exports = Ciphers;