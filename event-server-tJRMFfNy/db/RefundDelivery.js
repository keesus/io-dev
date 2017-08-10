/**
 * Created by 1001188 on 2016. 3. 9..
 */

var Sequelize = require('sequelize');
var db = require('../config/db');

var RefundDelivery = db.define('RefundDelivery', {

    id : {
        type : Sequelize.INTEGER(11),
        allowNull : false,
        primaryKey : true,
        autoIncrement: true
    },
    invoice : {
        type : Sequelize.STRING(255),
        allowNull : false
    },
    status : {
        type : Sequelize.STRING(45),
        allowNull : false
    },
    type : {
        type : Sequelize.STRING(45),
        allowNull : false
    }
});

module.exports = RefundDelivery;