/**
 * Created by baecheolmin on 2016. 2. 18..
 */
/**
 * Created by baecheolmin on 2016. 1. 21..
 */
var Sequelize = require('sequelize');
var db = require('../config/db');

var Payment = db.define('Payment', {

    id : {
        type : Sequelize.INTEGER(11),
        allowNull : false,
        primaryKey : true,
        autoIncrement: true
    },
    price : {
        type : Sequelize.STRING(45),
        allowNull : false
    }
});

module.exports = Payment;