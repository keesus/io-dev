/**
 * Created by baecheolmin on 2016. 2. 18..
 */
/**
 * Created by baecheolmin on 2016. 1. 21..
 */
var Sequelize = require('sequelize');
var db = require('../config/db');

var PermanentData = db.define('PermanentData', {

    id : {
        type : Sequelize.INTEGER(11),
        allowNull : false,
        primaryKey : true,
        autoIncrement: true
    },
    dataValue : {
        type : Sequelize.STRING(255),
        allowNull : false
    }
});

module.exports = PermanentData;