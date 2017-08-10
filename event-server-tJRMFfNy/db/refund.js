/**
 * Created by baecheolmin on 2016. 2. 18..
 */
/**
 * Created by baecheolmin on 2016. 1. 21..
 */
var Sequelize = require('sequelize');
var db = require('../config/db');

var Refund = db.define('Refund', {

    id : {
        type : Sequelize.INTEGER(11),
        allowNull : false,
        primaryKey : true,
        autoIncrement: true
    },
    pKey : {
        type : Sequelize.STRING(45),
        allowNull : true
    },
    macaddress : {
        type : Sequelize.STRING(255),
        allowNull : true
    },
    requestId : {
        type : Sequelize.STRING(45),
        allowNull : true
    },
    addr1 : {
        type : Sequelize.STRING(45),
        allowNull : true
    },
    addr2 : {
        type : Sequelize.STRING(45),
        allowNull : true
    },
    postNo : {
        type : Sequelize.STRING(11),
        allowNull : true
    }
});

module.exports = Refund;