/**
 * Created by baecheolmin on 2016. 2. 18..
 */

var Sequelize = require('sequelize');
var db = require('../config/db');

var CreditCardCompany = db.define('CreditCardCompany', {

    id : {
        type : Sequelize.INTEGER(11),
        allowNull : false,
        primaryKey : true,
        autoIncrement: true
    },
    status : {
        type : Sequelize.STRING(45),
        allowNull : false
    }
});

module.exports = CreditCardCompany;