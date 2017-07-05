var express = require('express');
var router = express.Router();

// Login
router.get('/login', function(req, res, next) {
  	res.render('login', { title: 'fost.r' });
});

module.exports = router;