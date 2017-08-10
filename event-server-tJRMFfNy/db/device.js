/**
 * Created by baecheolmin on 2016. 2. 18..
 */
/**
 * Created by baecheolmin on 15. 7. 26..
 */

var Sequelize = require('sequelize');
var db = require('../config/db');

var Device = db.define('Device',{
    /*
        productID
     */
    id : {
        type : Sequelize.INTEGER(11),
        allowNull : false,
        primaryKey : true,
        autoIncrement: true
    },
    status : {
        type : Sequelize.STRING(45),
        allowNull : true
    },
    nextPaymentDetail : {
        type : Sequelize.STRING(45),
        allowNull : true
    },
    serialNumber : {
        type : Sequelize.STRING(255),
        allowNull : true
    },
    macaddress : {
        type : Sequelize.STRING(255),
        allowNull : true
    },
    hashingShareCode : {
        type : Sequelize.STRING(255),
        allowNull : true
    },
    shareCode : {
        type : Sequelize.STRING(255),
        allowNull : true
    },
    pKey : {
        type : Sequelize.STRING(255),
        allowNull : true
    }

});

module.exports = Device;