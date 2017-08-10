/**
 * Created by baecheolmin on 2016. 2. 18..
 */
/**
 * Created by baecheolmin on 15. 7. 26..
 */

var Sequelize = require('sequelize');
var db = require('../config/db');

var DataType = db.define('DataTypes',{
    id : {
        type : Sequelize.INTEGER(11),
        allowNull : false,
        primaryKey : true,
        autoIncrement: true
    },
    name : {
        type:Sequelize.STRING(45),
        allowNull : false
    },
    code : {
        type : Sequelize.STRING(45),
        allowNull : true
    },
    type : {
        type : Sequelize.STRING(45),
        allowNull : true
    },
    structure  : {
        type : Sequelize.TEXT,
        allowNull : true
    }
});

module.exports = DataType;