const express=require('express');
const router=express.Router();
const validator = require('express-validator');
const session=require('express-session');
const connection = require('./../../database/connection');
const controller = require('./login_controller');

router.use(function(req, res, next){
    if(!req.session.body)next(); // make sure we go to the next routes and don't stop here
    else res.redirect('/api/feed');
});

router.get('/', function(req, res) {
  res.json({message: 'get /api/login'});
});

router.get('/user', function(req, res) {
  res.json({message: 'get /api/login/user'});
});

router.get('/shelter', function(req, res) {
  res.json({message: 'get /api/login/shelter'});
});

router.post('/user',function(req,res,next) {

  console.log("Enter key-value pairs necessary in body");
  if(typeof req.body.Username !== 'undefined' && typeof req.body.password!=='undefined'){
    var credentials=req.body;
    controller.loginUser(credentials,function(err,isMatch){
      if(err){
        console.log(err);
        res.status(500).send(err);
      }else if (isMatch){
        req.session.body=credentials;
        //res.status(200).send(credentials);
        console.log(credentials);
        res.redirect('/api/feed');
      }else{
        console.log('Invalid credentials.');
        res.status(404).json({message:'Invalid credentials.'});
      }
    });
  }
});

router.post('/shelter',function(req,res,next) {

  console.log("Enter key-value pairs necessary in body");
  if(typeof req.body.Username !== 'undefined' && typeof req.body.password!=='undefined'){
    var credentials=req.body;
    controller.loginShelter(credentials,function(err,isMatch){
      if(err){
        console.log(err);
        res.status(500).send(err);
      }else if (isMatch){
        req.session.body=credentials;
        console.log('Successfully logged in');
        res.status(200).redirect('/api/feed');
      }else{
        console.log('Invalid credentials.');
        res.status(404).json({message:'Invalid credentials.'});
      }
    });
  }
});

router.get('*', function(req, res, next) {
  res.redirect('/api/feed');
});

module.exports = router;