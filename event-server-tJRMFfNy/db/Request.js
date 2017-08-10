/**
 * Created by Rachel on 2016. 6. 29..
 */

var Sequelize = require('sequelize');
var db = require('../config/db');

var Request = db.define('Request',{

    id : {
        type : Sequelize.INTEGER(11),
        allowNull : false,
        primaryKey : true,
        autoIncrement: true
    },
    eventId : {
        type : Sequelize.INTEGER(11),
        allowNull : true
    },
    modelId : {
        type : Sequelize.INTEGER(11),
        allowNull : true
    },
    switcherId : {
        type : Sequelize.INTEGER(11),
        allowNull : true
    },
    customerId : {
        type : Sequelize.INTEGER(11),
        allowNull : true
    },
    paymentPlanId : {
        type : Sequelize.INTEGER(11),
        allowNull : true
    },
    creditCardId : {
        type : Sequelize.INTEGER(11),
        allowNull : true
    },
    status : {
        type : Sequelize.STRING(45),
        allowNull : true
    },
    firstPayAt: {
        type : Sequelize.DATE,
        allowNull : true
    },
    nextPayAt: {
        type : Sequelize.DATE,
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


module.exports = Request;