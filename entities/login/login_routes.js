const express=require('express');
const router=express.Router();
const validator = require('express-validator');
const session=require('express-session');
const connection = require('./../../database/connection');
const controller = require('./login_controller');

router.use(function(req, res, next){

  console.log("Enter key-value pairs necessary in body");
  next();
});

router.post('/user',function(req,res,next) {
  if(typeof req.body.Username !== 'undefined' && typeof req.body.password!=='undefined'){
    var credentials=req.body;
    controller.loginUser(credentials,function(err,isMatch){
      if(err){
        console.log(err);
        res.status(500).send(err);
      }else if (isMatch){
        req.session.body=credentials;
        req.session.body.accountType = 'user';
        console.log('Successfully logged in');
        res.status(200).send(req.session.body.accountType);
      }else{
        console.log('Invalid credentials.');
        res.status(404);
      }
    });
  }
});

router.post('/shelter',function(req,res,next) {
  if(typeof req.body.Username !== 'undefined' && typeof req.body.password!=='undefined'){
    var credentials=req.body;
    controller.loginShelter(credentials, function(err,isMatch){
      if(err){
        console.log(err);
        res.status(500).send(err);
      }else if (isMatch){
        req.session.body=credentials;
        req.session.body.accountType = 'shelter';
        console.log('Successfully logged in');
        res.status(200).send(req.session.body.accountType);
      }else{
        console.log('Invalid credentials.');
        res.status(404);
      }
    });
  }
});

router.get('*', function(req, res, next) {
  if(req.session.body) res.redirect('/api/feed');
});

module.exports = router;