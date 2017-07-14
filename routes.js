
const express=require('express');
const router=express.Router();
const connection=require('./database/connection');
const controller=require('./entities/users_and_shelters/signup_login_controller');
const validator = require('express-validator');
router.use(validator());

//https://scotch.io/tutorials/build-a-restful-api-using-node-and-express-4
// middleware to use for all requests
router.use(function(req, res, next) {
    // do logging
    console.log('Sending request...');
    next(); // make sure we go to the next routes and don't stop here
});

router.get('/', function(req, res) {
  res.json({ message: 'Hello World' });   
});

router.post('/signup/user',function(req,res,next){
  if(
    typeof req.body.Username!== 'undefined' &&
    typeof req.body.firstname!=='undefined' &&
    typeof req.body.lastname!=='undefined' &&
    typeof req.body.birthday!=='undefined' &&
    typeof req.body.address!=='undefined' &&
    typeof req.body.contactnum!=='undefined' &&
    typeof req.body.email!=='undefined' &&
    typeof req.body.password!=='undefined'
    ){
    
    // checks req.<field>; the following messages can be sent to the views
    // https://github.com/ctavan/express-validator
    req.checkBody('Username', 'Username is required').notEmpty();
    req.checkBody('firstname', 'First name is required').notEmpty();
    req.checkBody('lastname', 'Last name is required').notEmpty();
    req.checkBody('birthday', 'Birthday is required').notEmpty(); // birthday should be between 01-01-1917 and 12-31-2007 only
    req.checkBody('address', 'Address is required').notEmpty();
    req.checkBody('contactnum', 'Contact Number is required and should be numbers only').notEmpty().isInt();
    req.checkBody('email', 'Email is required').isEmail();
    req.checkBody('password', 'password is required').notEmpty();
    // req.checkBody('password', 'password is required').isLength({min: 6, max: 18}); // commented first for quick testing 

    var errors =req.validationErrors();
    if(errors){
      res.json({message: errors})
    }else{
      var today=new Date();
      var newUser={
        "Username":req.body.Username,
        "firstname":req.body.firstname,
        "lastname":req.body.lastname,
        "birthday":req.body.birthday,
        "address":req.body.address,
        "contactnum":req.body.contactnum,
        "email":req.body.email,
        "password":req.body.password,
        "created_at": today,
        "updated_at":today
      }
       controller.registerUser(newUser, function(err, callback){
            if (err){
                console.log('There was an error in the register controller');
                res.status(500).send(err);
            }
            switch(callback){
                case 'SIGNUP_SUCCESS':
                    errors = "Successfully signed up.";
                    console.log(errors);
                    return res.status(200).send(newUser);
                    break;
                case 'QUERRY ERROR':
                    console.log('Sorry, there was some error in the query.');                    
                    return res.status(404).send(errors);
                    break;
                case 'TAKEN_BOTH_ERR':
                    console.log('Sorry, the email and username you entered are already taken.');
                    return res.status(404).send(errors);
                    break;
                case 'TAKEN_EA':
                    console.log('Sorry, the email address you entered is already taken');
                    return res.status(404).send(errors);

                    break;
                case 'TAKEN_UN':
                    console.log('Sorry, the username you entered is already taken.');
                    return res.status(404).send(errors);
                    break;
            }
        });
    }


    


  }else{
    return res.status(500).send('sorry');
  }


});

module.exports=router;