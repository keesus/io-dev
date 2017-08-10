/**
 * Created by baecheolmin on 2016. 2. 18..
 */
/**
 * Created by baecheolmin on 2016. 1. 21..
 */
var Sequelize = require('sequelize');
var db = require('../config/db');

var Product = db.define('Product', {

    id : {
        type : Sequelize.INTEGER(11),
        allowNull : false,
        primaryKey : true,
        autoIncrement: true
    },
    productName : {
        type : Sequelize.STRING(255),
        allowNull : false
    },
    version : {
        type : Sequelize.STRING(45),
        allowNull : true
    }
});

module.exports = Product;