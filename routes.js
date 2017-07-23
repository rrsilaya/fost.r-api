// this will import all of the routes needed 
const express=require('express');
const router=express.Router();
const validator = require('express-validator');
const session=require('express-session');
const connection=require('./database/connection');

var signup = require('./entities/signup/signup_routes');
var login = require('./entities/login/login_routes');
var pets = require('./entities/pets/pets_routes');
var community=require('./entities/community/community_routes');

router.use(validator());

/* for express-session */
router.use(session({
    secret:"fost.r_jpad",
    resave: true,
    saveUninitialized: true
})); 

//https://scotch.io/tutorials/build-a-restful-api-using-node-and-express-4
// middleware to use for all requests; check if logged in
router.use('/signup', signup);
router.use('/login', login);

router.use(function(req, res, next) {
    if (req.session.body){
      next();
      var isAuth = true; 
    } 
    else res.status(403).send(null);
});

router.use('/pets', pets);
router.use('/community',community);

router.get('/', function(req, res) {
  res.json({ message: 'to access api: localhost:3000/api/<route>' });   
});


router.get('/feed',function(req,res,next){
  res.json('This is the feed');
});

router.get('/logout',function(req,res,next){
  req.session.destroy();
  prompt="User logged out"
  res.status(200).return(null);
  console.log(prompt);
});

router.get('*', function(req, res, next) {
  res.redirect('/api/');
});

module.exports=router;