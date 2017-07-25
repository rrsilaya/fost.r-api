const express=require('express');
const router=express.Router();
var controller = require('./accounts_controller');
const validator = require('express-validator');
var fileUpload = require('express-fileupload'); // for file upload

/* users and shelters accounts handling will all be here */

router.use(validator());      // express-validator

router.use(fileUpload());     // express-fileupload

router.use(function(req, res, next) {
    // do logging
    console.log('accounts middleware. getting request..');
    next();
});

/*  view all accounts (users or shelters) 
    ideally only used during development
*/
router.get('/viewShelters', function(req, res){
    controller.viewAllShelters(function(err, shelters){
        if (err) return res.status(500).json(err);  // server error
        res.json(shelters); // returns accounts of shelters
    });
});

router.get('/viewUsers', function(req, res){
    controller.viewAllUsers(function(err, users){
        if (err) return res.status(500).json(err);  // server error
        res.json(users); // returns accounts of users
    });
});


/*view basic info */
router.get('/MyAccount',function(req,res){
    var Username = req.session.body.Username;
    if(req.session.body.accountType == 'user'){
        controller.viewUserInfo(Username, function(err,results){
            if (err) return res.status(500).json(err);  // server error
            res.status(200).json(results); // returns accounts of users
        });

    }else if(req.session.body.accountType == 'shelter'){
        controller.viewShelterInfo(Username, function(err,results){
            if (err) return res.status(500).json(err);  // server error
            res.status(200).json(results); // returns accounts of users
        })
    }
});

/* update certain info of accounts (only if logged in) */
router.put('/MyAccount', function(req, res){
    var Username = req.session.body.Username;
    var changes = req.body;
    if(req.session.body.accountType == 'user'){
        controller.updateUserInfo(Username, changes, function(err, results){
            if (err) return res.status(500).json(err);  // server error
            res.status(201).json(results); // returns pets of specified user
        }); 
    }else if(req.session.body.accountType == 'shelter'){
        controller.updateShelterInfo(Username, changes, function(err, results){
            if (err) return res.status(500).json(err);  // server error
            res.status(201).json(results); // returns results
        }); 
    }
});

/* deletion of accounts (only if logged in) */
router.delete('/MyAccount', function(req, res){
    var Username = req.session.body.Username;
    if(req.session.body.accountType == 'user'){
        controller.deleteUserAccount(Username, function(err, results){
            if (err) return res.status(500).json(err);  // server error
            if (!results) return res.status(500); // unable to delete
            res.status(204).json(null); // call logout after
        }); 
    }else if(req.session.body.accountType == 'shelter'){
        controller.deleteShelterAccount(Username, function(err, results){
            if (err) return res.status(500).json(err);  // server error
            if (!results) return res.status(500); //unable to delete
            res.status(204).json(null); // call logout after
        }); 
    }
});

module.exports = router;