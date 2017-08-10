/**
 * Created by Rachel on 2016. 6. 30..
 */

var Sequelize = require('sequelize');
var db = require('../config/db');

var CreditCard = db.define('CreditCard',{

    id : {
        type : Sequelize.INTEGER(11),
        allowNull : false,
        primaryKey : true,
        autoIncrement: true
    },
    requestId : {

        type : Sequelize.INTEGER(11),
        allowNull : true
    },
    name : {
        type : Sequelize.STRING(45),
        allowNull : true
    },
    number : {
        type : Sequelize.STRING(255),
        allowNull : true
    },
    expiredAt: {
        type : Sequelize.STRING(45),
        allowNull : true
    },
    createdAt: {
        type : Sequelize.DATE,
        allowNull : false
    },
    updatedAt: {
        type : Sequelize.DATE,
        allowNull : false
    },
    deletedAt: {
        type : Sequelize.DATE,
        allowNull : true
    }
});


module.exports = CreditCard;