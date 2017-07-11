var express = require('express');
var router = express.Router();

// Adopt

router.get('/adopt', function(req, res, next) {
    res.render('adopt', { title: 'adopt' });
});

module.exports = router;