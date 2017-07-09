var express = require('express');
var router = express.Router();

// Register
router.get('/community', function(req, res, next) {
  	res.render('community', { title: 'fost.r' });
});

module.exports = router;