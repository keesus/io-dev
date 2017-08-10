/**
 * Created by Rachel on 2016. 6. 29..
 */

var Sequelize = require('sequelize');
var db = require('../config/db');

var Delivery = db.define('Delivery',{

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
    invoice : {
        type : Sequelize.STRING(255),
        allowNull : true
    },
    postNo : {
        type : Sequelize.INTEGER(45),
        allowNull : true
    },
    addr1 : {
        type : Sequelize.STRING(255),
        allowNull : true
    },
    addr2 : {
        type : Sequelize.STRING(255),
        allowNull : true
    },
    status: {
        type : Sequelize.STRING(45),
        allowNull : true
    },
    createdAt: {
        type : Sequelize.DATE,
        allowNull : false
    },
    deliveryAt: {
        type : Sequelize.DATE,
        allowNull : true
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


module.exports = Delivery;
