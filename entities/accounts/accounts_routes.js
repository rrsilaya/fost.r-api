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

/* view all accounts (users or shelters) */
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
router.get('/viewMyInfo',function(req,res){
    if(req.session.accountType == 'shelter'){
        controller.viewUserInfo(req.session.body.Username,function(err,results){
            if (err) return res.status(500).json(err);  // server error
            res.json(results); // returns accounts of users
        });

    }else if(req.session.accountType == 'user'){
        controller.viewShelterInfo(req.session.body.Username,function(err,results){
            if (err) return res.status(500).json(err);  // server error
            res.json(results); // returns accounts of users
        })
    }


});

/* update certain info of accounts (only if logged in) */
router.put('/updateShelterInfo', function(req, res){

        var Username = req.session.body.Username;
        var changes = req.body;
        controller.updateShelterInfo(Username, changes, function(err, results){
            if (err) return res.status(500).json(err);  // server error
            res.json(results); // returns results
        }); 
   
});

router.put('/updateUserInfo', function(req, res){
        var Username = req.session.body.Username;
        var changes = req.body;
        controller.updateUserInfo(Username, changes, function(err, results){
            if (err) return res.status(500).json(err);  // server error
            res.json(results); // returns pets of specified user
        }); 
});

/* deletion of accounts (only if logged in) */
router.delete('/deleteShelterAccount', function(req, res){
        var Username = req.session.body.Username;
        controller.deleteShelterAccount(Username, function(err, results){
            if (err) return res.status(500).json(err);  // server error
            if (!results) return res.status(500).json({message: 'unable to delete'});
            res.status(204).json(null);
        }); 
});

router.delete('/deleteUserAccount', function(req, res){
        var Username = req.session.body.Username;
        controller.deleteUserAccount(Username, function(err, results){
            if (err) return res.status(500).json(err);  // server error
            if (!results) return res.status(500).json({message: 'unable to delete'});
            res.status(204).json(null);
        }); 
});

module.exports = router;