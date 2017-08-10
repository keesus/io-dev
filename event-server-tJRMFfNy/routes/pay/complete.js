/**
 * Created by 1001188 on 2016. 3. 26..
 */
/**
 * Created by 1001188 on 2016. 3. 26..
 */
/**
 * Created by 1001188 on 2016. 3. 26..
 */
var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('pay/complete', { title: 'Express' });
});

module.exports = router;
