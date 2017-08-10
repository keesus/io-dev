/**
 * Created by Rachel on 2016. 9. 22..
 */

var Sequelize = require('sequelize');
var db = require('../config/db');

var Campaign = db.define('Campaign',{
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
  phoneNumber : {
    type : Sequelize.STRING(45),
    allowNull : true
  },
  source : {
    type : Sequelize.STRING(255),
    allowNull : true
  },
  medium  : {
    type : Sequelize.STRING(45),
    allowNull : true
  },
  campaign  : {
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

module.exports = Campaign;