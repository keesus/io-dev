/**
 * Created by Rachel on 2016. 9. 7..
 */

var Sequelize = require('sequelize');
var db = require('../config/db');

var Event = db.define('Event',{

    id : {
        type : Sequelize.INTEGER(11),
        allowNull : false,
        primaryKey : true,
        autoIncrement: true
    },
    name : {
        type : Sequelize.STRING(255),
        allowNull : true
    },
    status : {
        type : Sequelize.STRING(45),
        allowNull : true
    },
    sellingStartAt: {
        type : Sequelize.DATE,
        allowNull : true
    },
    sellingEndAt: {
        type : Sequelize.DATE,
        allowNull : true
    },
    deliveryAt: {
        type : Sequelize.DATE,
        allowNull : true
    },
    endAt: {
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


module.exports = Event;