const express=require('express');
const router=express.Router(); 
var fileUpload = require('express-fileupload'); // for file upload
var mv = require('mv');                         // for file upload; won't work when declared as const
const validator = require('express-validator');
var shortid = require('shortid');
shortid.characters('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ$@'); 
// default has "-"" and "_" ; this sets the characters to only the entered characters (https://www.npmjs.com/package/shortid)
var controller = require('./rescue_controllers');

router.use(validator());      // express-validator
router.use(fileUpload());     // express-fileupload

router.use(function(req, res, next) {
    // do logging
    console.log('sending request...');
    next(); // make sure we go to the next routes and don't stop here
});
//display all requests for rescue 
router.get('/',function(req,res,next){
  if(req.session.body){
    controller.viewAllRequests(function(err,requests){
      if (err) return res.status(500).json(err);  // server error
      else res.json(requests); // returns all posts
    });
  }else res.status(403).json("Please log in or sign up first .");
});
//view a request given the rescue_uuid
/*
router.get('/:rescue_uuid/viewRequest')
//add a rescue request to db*/
router.post('/submit_a_rescue_request',function(req,res,next){
  if(req.session.body && req.body.rescue_body){
    var today=new Date();
    var rescue_uuid=shortid.generate();
    var rescue_imgurl;

    //select user details
    controller.getUser(req.session.body.Username,function(err,user){
      if(err) res.status(403).send("cannot get user details");
      else if (user.length!==1)  res.status(403).send("user not found");
      else {
        var contactnum_sender=user[0].contactnum;
        var address_sender=user[0].address;
        var email_sender=user[0].email;
        if(typeof req.files!=='undefined'){
          if(req.files.photo){
            var image=req.files.photo;
            var name = rescue_uuid + '-attached-image-' + image.name;
            rescue_imgurl = __dirname + '/rescue-images/' + name;
            var mime = req.files.photo.mimetype;
            if (mime.substring(0,5) === 'image'){
              image.mv(rescue_imgurl, function(err){
                if (err){
                  rescue_imgurl = null;
                  console.log('api err: not able to receive image');  
                }    
              });
            }else{
              rescue_imgurl = null;
              console.log('file uploaded is not image');
          }
        }else if(!req.files.photo){
          rescue_imgurl = null;
        }
      }else{
        rescue_imgurl = null;
        console.log('file is undefined');
      }

      var newRescue={
        "rescue_uuid" : rescue_uuid,
        "rescue_body" : req.body.rescue_body,
        "rescue_imgurl": rescue_imgurl,
        "sender_Username" : req.session.body.Username,
        "date_submitted" : today ,
        "contactnum_sender" : contactnum_sender,
        "email_sender": email_sender,
        "address_sender" : address_sender,
        "updated_on": today
      }

      controller.addRescue(newRescue,function(err,results){
        if(err) res.status(500).send(err);
        else if (results.affectedRows==1) res.json(newRescue);
        else res.status(403).send("unable to submit request");
      });

    }

  });
    
    
  }else res.status(403).json("Please log in or sign up first .")
});

router.get('*', function(req, res, next) {
  if(req.session.body) res.redirect('/api/rescue/');
  else res.status(403).json("Please log in or sign up first .");
});

module.exports=router;