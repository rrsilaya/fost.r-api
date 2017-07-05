var express = require('express');
var router = express.Router();

// Register
router.get('/signup', function(req, res, next) {
  	res.render('signup', { title: 'fost.r' });
});

module.exports = router;