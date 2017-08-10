/**
 * Created by baecheolmin on 2016. 2. 18..
 */
/**
 * Created by baecheolmin on 2016. 1. 21..
 */
var Sequelize = require('sequelize');
var db = require('../config/db');

var RequestedDevice = db.define('RequestedDevice', {

    id : {
        type : Sequelize.INTEGER(11),
        allowNull : false,
        primaryKey : true,
        autoIncrement: true
    },
    inventory : {
        type : Sequelize.STRING(45),
        allowNull : true
    },
    macaddress : {
        type : Sequelize.STRING(45),
        allowNull : true
    }
});

module.exports = RequestedDevice;