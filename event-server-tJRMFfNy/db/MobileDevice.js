/**
 * Created by baecheolmin on 2016. 2. 18..
 */
/**
 * Created by baecheolmin on 2016. 1. 21..
 */
var Sequelize = require('sequelize');
var db = require('../config/db');

var MobileDevice = db.define('MobileDevice', {

    id : {
        type : Sequelize.INTEGER(11),
        allowNull : false,
        primaryKey : true,
        autoIncrement: true
    },
    type : {
        type : Sequelize.STRING(45),
        allowNull : true
    },
    pushKey : {
        type : Sequelize.STRING(45),
        allowNull : true
    }
});

module.exports = MobileDevice;