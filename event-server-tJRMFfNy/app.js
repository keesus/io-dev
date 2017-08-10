var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var cors = require('cors');
var routes = require('./routes/index');
var users = require('./routes/users');
var device = require('./routes/pay/device');
var card = require('./routes/pay/card');
var complete = require('./routes/pay/complete');
var plan = require('./routes/pay/plan');
var user = require('./routes/pay/user');

/*
 * db
 */

/*var creditcarddb = require('./db/creditcard'),
    customerdb = require('./db/customer'),
    dataTypedb = require('./db/DataType'),
    deliverydb = require('./db/delivery'),
    devicedb = require('./db/Device'),
    eventdb = require('./db/event'),
    eventProductdb = require('./db/eventproduct'),
    mobileDevicedb = require('./db/MobileDevice'),
    paymentdb = require('./db/Payment'),
    paymentPlandb = require('./db/PaymentPlan'),
    permanetdatadb = require('./db/PermanentData'),
    productdb = require('./db/Product'),
    refunddb = require('./db/refund'),
    requestedDevicedb = require('./db/RequestedDevice'),
    refundDeliverydb = require('./db/RefundDelivery'),
    requestdb = require('./db/request');*/

var app = express();

// view engine setup
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(cors());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'event_web')));
// app.use('/event/purchases/bower_components', express.static(__dirname + '/bower_components'));
// app.use('/event/purchases/css', express.static(__dirname + '/views/css'));
// app.use('/event/purchases/js', express.static(__dirname + '/views/js'));
// app.use('/event/purchases/img', express.static(__dirname+'/views/img'));

app.use('/', routes);
//app.use('/users', users);
//app.use('/device', device);
//app.use('/user', user);
//app.use('/plan', plan);
//app.use('/complete', complete);
//app.use('/card',card);

app.set('views', path.join(__dirname, 'event_web'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}


/*//db relation
refunddb.hasMany(refundDeliverydb);
eventdb.belongsToMany(productdb,{through:eventProductdb});
productdb.belongsToMany(eventdb,{through:eventProductdb});

customerdb.hasMany(requestdb);
requestdb.hasMany(requestedDevicedb);

customerdb.belongsToMany(eventdb,{through:requestdb});
eventdb.belongsToMany(customerdb,{through:requestdb});

requestdb.hasOne(deliverydb);

devicedb.hasMany(requestedDevicedb);

//delivery - eventdb 연동

customerdb.hasMany(mobileDevicedb,{as:'customer',foreignKey:'phoneNumber'});
customerdb.hasMany(creditcarddb,{as:'customer',foreignKey:'phoneNumber'});
customerdb.hasMany(deliverydb,{as:'customer',foreignKey:'phoneNumber'});
customerdb.hasMany(devicedb,{as:'customer', foreignKey:'phoneNumber'});

creditcarddb.belongsToMany(paymentPlandb,{through:paymentdb});
paymentPlandb.belongsToMany(creditcarddb,{through:paymentdb});
devicedb.hasMany(paymentdb,{as:'device',foreignKey:'deviceid'});

paymentPlandb.hasMany(devicedb);
productdb.hasMany(devicedb);

devicedb.hasMany(permanetdatadb);
dataTypedb.hasMany(permanetdatadb);

paymentdb.belongsToMany(deliverydb,{through:refunddb});
deliverydb.belongsToMany(paymentdb,{through:refunddb});


//deliverydb.hasMany(eventdb);

//db sync
creditcarddb.sync();
customerdb.sync();
dataTypedb.sync();
deliverydb.sync();
devicedb.sync();
eventdb.sync();
eventProductdb.sync();
mobileDevicedb.sync();
paymentdb.sync();
paymentPlandb.sync();
permanetdatadb.sync();
productdb.sync();
refunddb.sync();
requestdb.sync();
requestedDevicedb.sync();
refundDeliverydb.sync();*/

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
