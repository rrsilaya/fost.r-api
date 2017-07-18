const express=require('express');
const router=express.Router();
const validator = require('express-validator');
const session=require('express-session');
var mv = require('mv'); 
var fileUpload = require('express-fileupload');
const connection = require('./../../database/connection');
const controller = require('./signup_controller');

router.use(validator());      // express-validator
router.use(fileUpload());     // express-fileupload


router.use(function(req, res, next) {
    // do logging
    console.log('sending request...');
    next(); // make sure we go to the next routes and don't stop here
});

router.get('/', (req, res)=>{
  res.json({message: 'SIGNUP_AS_USER_OR_SHELTER'});
});

router.get('/user', (req, res)=>{
  res.json({message: 'get api/signup/user'});
});

router.get('/shelter', (req, res)=>{
  res.json({message: 'get api/signup/shelter'});
});

router.post('/shelter',function(req,res,next){
  if(!req.session.body){
    // console.log(req.files.file);
    if(
    typeof req.body.Username!== 'undefined' &&
    typeof req.body.shelter_name!=='undefined' &&
    typeof req.body.address!=='undefined' &&
    typeof req.body.contactnum!=='undefined' &&
    typeof req.body.email!=='undefined' &&
    typeof req.body.password!=='undefined' && 
    typeof req.files.file!=='undefined'
    ){
    
      // checks req.<field>; the following messages can be sent to the views
      // https://github.com/ctavan/express-validator
      req.checkBody('Username', 'Username is required').notEmpty();
      req.checkBody('shelter_name', 'Shelter name is required').notEmpty();
      req.checkBody('address', 'Address is required').notEmpty();
      req.checkBody('contactnum', 'Contact Number is required and should be numbers only').notEmpty().isInt();
      req.checkBody('email', 'Email is required').isEmail();
      req.checkBody('password', 'password is required').notEmpty();
      // req.checkBody('password', 'password is required').isLength({min: 6, max: 18}); // commented first for quick testing 

      var errors = req.validationErrors();
      if(errors || !req.files.file){
        res.status(400).json({message: 'please enter correct inputs in fields'});
      }else{

      const file=req.files.file; //use later for file-upload
      var name = req.body.Username + '-proof-' + file.name;
      var uploadpath=__dirname + '/shelter_docs/'+ name;

        var today=new Date();
        var newShelter={
          "Username":req.body.Username,
          "shelter_name":req.body.shelter_name,
          "address":req.body.address,
          "contactnum":req.body.contactnum,
          "email":req.body.email,
          "password":req.body.password,
          "created_at": today,
          "updated_at":today,
          "file_path":uploadpath
        }

        controller.registerShelter(newShelter, function(err, callback){
            if (err){
                console.log('There was an error in the register controller');
                res.status(500).json(err);
            }

            switch(callback){
                case 'SIGNUP_SUCCESS':
                    errors = "Successfully signed up.";
                    
                    console.log(errors);
                    file.mv(uploadpath, function(err){
                        if (err){
                          console.log(err);
                          console.log('File not uploaded, please try again');
                          res.status(500).redirect('/api/signup');
                        }});
                    //  note: produces error: file.mv is not a function
                    console.log(newShelter);
                    res.status(201).redirect('/api/feed');

                    break;
                case 'QUERRY ERROR':
                    errors = "Sorry, there was some error in the query.";
                    console.log(errors);                    
                    return res.status(400).json(errors);
                    break;
                case 'TAKEN_BOTH_ERR':
                    errors = "Sorry, the email and username you entered are already taken.";
                    console.log(errors);                    
                    return res.status(400).json(errors);
                    break;
                case 'TAKEN_EA':
                    errors="Sorry, the email address you entered is already taken"
                    console.log(errors);                    
                    return res.status(400).json(errors);
                    break;
                case 'TAKEN_UN':
                    errors="Sorry, the username you entered is already taken."
                    console.log(errors);                    
                    return res.status(400).json(errors);
                    break;
            }
        });
      }
    }else{
      res.status(500).json('registration failed');
    }
  }else if(req.session.body){
    res.redirect('/api/feed');
  }
});

router.post('/user',function(req,res,next){

  if(!req.session.body){
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
        res.status(400).json(errors);
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
                res.status(500).json(err);
            }
            switch(callback){
                case 'SIGNUP_SUCCESS':
                    errors = "Successfully signed up.";
                    console.log(errors);
                    console.log(newUser);
                    //return res.status(200).json(newUser);
                    res.status(201).redirect('/api/feed');
                    // res.redirect('/api/feed');
                    break;
                case 'QUERRY ERROR':
                    errors = "Sorry, there was some error in the query.";
                    console.log(errors);                    
                    return res.status(400).json(errors);
                    break;
                case 'TAKEN_BOTH_ERR':
                    errors = "Sorry, the email and username you entered are already taken.";
                    console.log(errors);                    
                    return res.status(400).json(errors);
                    break;
                case 'TAKEN_EA':
                    errors="Sorry, the email address you entered is already taken"
                    console.log(errors);                    
                    return res.status(400).json(errors);
                    break;
                case 'TAKEN_UN':
                    errors="Sorry, the username you entered is already taken."
                    console.log(errors);                    
                    return res.status(400).json(errors);
                    break;
            }
        });
      }
    }else{
      return res.status(400).json('registration failed');
    }

  }else{
    res.redirect('/api/feed');
  }
});


module.exports = router;