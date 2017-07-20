const express=require('express');
const router=express.Router();
var controller = require('./accounts_controller');

/* users and shelters accounts handling will all be here */

router.use(validator());      // express-validator

router.use(fileUpload());     // express-fileupload

router.use(function(req, res, next) {
    // do logging
    console.log('sending request...');
    next(); // make sure we go to the next routes and don't stop here
});

router.get('/', function(req, res, next){
    res.json({message:'get /api/accounts'});
}); 

/* update certain info of accounts (only if logged in) */
router.put('/:Username/updateShelterInfo', function(req, res){
    if (req.session.body){
        var Username = req.params.Username;
        var changes = req.body;
        controller.updateShelterInfo(Username, changes, function(err, results){
            if (err) return res.status(500).json(err);  // server error
            res.json(results); // returns results
        }); 
    }else res.status(403).json({message: 'login first before updating'});
});

router.put('/:Username/updateUserInfo', function(req, res){
    if(req.session.body){
        var Username = req.params.Username;
        var changes = req.body;
        controller.updateUserInfo(Username, changes, function(err, results){
            if (err) return res.status(500).json(err);  // server error
            res.json(results); // returns pets of specified user
        }); 
    }else res.status(403).json({message: 'login first before updating'});
});

/* deletion of accounts (only if logged in) */
router.put('/:Username/deleteShelterAccount', function(req, res){
    if (req.session.body){
        var Username = req.params.Username;
        controller.deleteShelterAccount(Username, function(err, results){
            if (err) return res.status(500).json(err);  // server error
            if (!results) return res.status(500).json({message: 'unable to delete'});
            res.status(204).json(null);
        }); 
    }else res.status(403).json({message: 'login first before updating'});
});

router.put('/:Username/deleteUserAccount', function(req, res){
    if(req.session.body){
        var Username = req.params.Username;
        controller.deleteUserAccount(Username, function(err, results){
            if (err) return res.status(500).json(err);  // server error
            if (!results) return res.status(500).json({message: 'unable to delete'});
            res.status(204).json(null);
        }); 
    }else res.status(403).json({message: 'login first before updating'});
});

module.exports = router;