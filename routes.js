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
var login = require('./entities/login/login_routes');
var pets = require('./entities/pets/pets_routes');

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
router.use('/login', login);
router.use('/pets', pets);

router.get('/', function(req, res) {
  res.json({ message: 'to access api: localhost:3000/api/<route>' });   
});


router.get('/feed',function(req,res,next){
  if(req.session.body) res.json('This is the feed');
  else res.json({message: 'Sign in or Sign up to access feed'})
});

router.get('/logout',function(req,res,next){
  if(req.session.body){
    req.session.destroy();
    prompt="User logged out"
    res.status(200).redirect('/api');
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