/**
 * Created by baecheolmin on 2016. 2. 18..
 */
/**
 * Created by baecheolmin on 2016. 1. 21..
 */
var Sequelize = require('sequelize');
var db = require('../config/db');

var PaymentPlan = db.define('PaymentPlan', {

    id : {
        type : Sequelize.INTEGER(11),
        allowNull : false,
        primaryKey : true,
        autoIncrement: true
    },
    price : {
        type : Sequelize.STRING(255),
        allowNull : false
    },
    status : {
        type : Sequelize.STRING(45),
        allowNull : true
    },
    description : {
        type : Sequelize.STRING(255),
        allowNull : true
    },
    title : {
        type : Sequelize.STRING(45),
        allowNull : false
    }
});

module.exports = PaymentPlan;