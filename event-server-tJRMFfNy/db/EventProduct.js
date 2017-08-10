/**
 * Created by Rachel on 2016. 9. 7..
 */

var Sequelize = require('sequelize');
var db = require('../config/db');

var EventProduct = db.define('EventProduct', {

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
    quantity : {
        type : Sequelize.STRING(11),
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

module.exports = EventProduct;