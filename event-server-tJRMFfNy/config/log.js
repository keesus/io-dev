var winston = require('winston');

var customLevel = {
    levels: {
        debug: 0,
        warn: 1,
        error: 2,
        info: 3
    },
    colors: {
        debug: 'blue',
        info: 'green',
        warn: 'yellow',
        error: 'red'
    }
};

winston.setLevels(customLevel.levels);

var ErrorLogger = new (winston.Logger)({
    exitOnError : false,
    transports : [
        new (winston.transports.File)({
            filename : 'logger/error.log',
            level : 'error',
            maxsize : 102400,
            handleException : true,
            json : false
        })
    ]
});

var WarnLogger = new (winston.Logger)({
    exitOnError : false,
    transports : [
        new (winston.transports.File)({
            filename : 'logger/warn.log',
            level : 'warn',
            maxsize : 1024000,
            maxFiles : 10,
            handleExceptions : false,
            json : false
        })
    ]
});

var InfoLogger = new (winston.Logger)({
   exitOnError : false,
    transports : [
        new (winston.transports.File)({
            filename : 'logger/info.log',
            level : 'info',
            maxsize : 1024000,
            maxFiles : 10,
            handleExceptions : false,
            json : false
        })
    ]
});


var logger = function() {};
logger.prototype.e = ErrorLogger.error;
logger.prototype.w = WarnLogger.warn;
logger.prototype.i = InfoLogger.info;

//logger.setLevels(customLevel.levels);

module.exports = new logger();