/**
 * Created by baecheolmin on 2016. 2. 18..
 */

var Sequelize = require('sequelize');
var db = require('../config/db');

var History = db.define('History', {

    id : {
        type : Sequelize.INTEGER(11),
        allowNull : false,
        primaryKey : true,
        autoIncrement: true
    },
    deviceID : {
        type : Sequelize.STRING(45),
        allowNull : false
    },
    lastUser : {
        type : Sequelize.STRING(45),
        allowNull : false
    },
    currentUser : {
        type : Sequelize.STRING(45),
        allowNull : false
    },
    reason : {
        type : Sequelize.STRING,
        allowNull : true
    }
});

module.exports = History;