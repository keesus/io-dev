/**
 * Created by Rachel on 2016. 6. 14..
 */

var Sequelize = require('sequelize');
var db = require('../config/db');

var Customer = db.define('Customer',{

    id : {
        type : Sequelize.INTEGER(11),
        allowNull : false,
        primaryKey : true,
        autoIncrement: true
    },
    name : {
        type : Sequelize.STRING(45),
        allowNull : true
    },
    phoneNumber : {
        type : Sequelize.STRING(45),
        allowNull : true
    },
    authNumber : {
        type : Sequelize.STRING(45),
        allowNull : true
    },
    postNo: {
        type : Sequelize.STRING(45),
        allowNull : true
    },
    addr1: {
        type : Sequelize.STRING(45),
        allowNull : true
    },
    addr2: {
        type : Sequelize.STRING(255),
        allowNull : true
    },
    email: {
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


module.exports = Customer;