// this will import all of the routes needed 
const express=require('express');
const router=express.Router();
const validator = require('express-validator');
const session=require('express-session');
const connection=require('./database/connection');
const controller=require('./entities/users_and_shelters/signup_login_controller');
//const fileUpload = require('express-fileupload');
//const mv = require('mv'); 
//router.use(fileUpload());
var signup = require('./entities/signup/signup_routes');


router.use(validator());
/* for express-session */
router.use(session({
    secret:"fost.r_jpad",
    resave: true,
    saveUninitialized: true
})); 

//https://scotch.io/tutorials/build-a-restful-api-using-node-and-express-4
// middleware to use for all requests
router.use(function(req, res, next) {
    // do logging
    console.log('Sending request...');
    next(); // make sure we go to the next routes and don't stop here
});

router.use('/signup', signup);

router.get('/', function(req, res) {
  res.json({ message: 'Hello World' });   
});

router.get('/login', function(req, res) {
  res.json
});

router.post('/login/user',function(req,res,next) {

  if (!req.session.body){
    console.log("Enter keyy-value pairs necessary in body");
    if(typeof req.body.Username !== 'undefined' && typeof req.body.password!=='undefined'){
      var credentials=req.body;
      controller.loginUser(credentials,function(err,isMatch){
        if(err){
          console.log(err);
          res.status(404).send(err);
        }else if (isMatch){
          req.session.body=credentials;
          //res.status(200).send(credentials);
          console.log(credentials);
          res.redirect('/api/adopt');

        }else{
          console.log('Something went wrong.');
        }
      });
    }
  }else if(req.session.body){
    //res.status(200).send(req.session.body);
    res.redirect('/api/adopt');
  }
  
});

router.get('/feed',function(req,res,next){
  if(req.session.body) res.json('This is the feed');
  else res.json({message: 'Sign in or Sign up to access adopt page'})
});

router.post('/login/shelter',function(req,res,next) {

  if (!req.session.body){
    console.log("Enter key-value pairs necessary in body");
    if(typeof req.body.Username !== 'undefined' && typeof req.body.password!=='undefined'){
      var credentials=req.body;
      controller.loginShelter(credentials,function(err,isMatch){
        if(err){
          console.log(err);
          res.status(404).send(err);
        }else if (isMatch){
          req.session.body=credentials;
          //res.status(200).send(credentials);
          console.log(credentials);
          // res.redirect('/api/feed');
          res.status(200).redirect('/api/feed');
        }else{
          console.log('Something went wrong.');
        }
      });
    }
  }else if(req.session.body){
    //res.status(200).send(req.session.body);
    res.redirect('/api/feed');

  }
  
});


router.get('/logout',function(req,res,next){
  if(req.session.body){
    req.session.destroy();
    prompt="User logged out"
    res.status(200).send(prompt);
    console.log(prompt);
  }else{
    console.log('cannot perform function');
    res.redirect('/api/');
  }
  
});

router.get('*', function(req, res, next) {
  if(req.session.body) res.redirect('/api/feed');
  else res.redirect('/api/');
});

module.exports=router;