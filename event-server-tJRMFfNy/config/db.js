/**
 * Created by rachel on 16. 10. 5..
 */

var sequelize = require('sequelize');

module.exports = new sequelize('switcher', 'switcher', '!bobbers7', {

  host : 'io-switcher-prod.ccxpdsv7tuxs.ap-northeast-2.rds.amazonaws.com',
  port : 3306,
  dialect : 'mysql',
  pool : {
    max : 100,
    min : 0,
    idle : 10000
  },
  omitNull: true,
  timezone: '+09:00'
});