const express=require('express');
const router=express.Router(); 
var fileUpload = require('express-fileupload'); // for file upload
var mv = require('mv');                         // for file upload; won't work when declared as consta
var sizeOf = require('image-size');             // get image dimensions
const validator = require('express-validator');
var shortid = require('shortid');
shortid.characters('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ$@'); 
// default has "-"" and "_" ; this sets the characters to only the entered characters (https://www.npmjs.com/package/shortid)
var controller = require('./community_controller');

router.use(validator());      // express-validator
router.use(fileUpload());     // express-fileupload
router.use(function(req, res, next) {
    // do logging
    console.log('sending request...');
    next(); // make sure we go to the next routes and don't stop here
});

router.get('/', function(req, res, next){
    res.json({message:'get /api/community'});
});


/* views all post sorted by date*/
router.get('/feed', function(req,res,next){
  controller.viewAllPosts(function(err,posts){
    if (err) return res.status(500).json(err);  // server error
    else res.json(posts); // returns all posts
  });
});

/*view all post of a specific user/shelter ; 'user' will be used for both user and shelter*/
router.get('/:user/viewPosts',function(req,res,next){
  var user=req.params.user;
  console.log(user);
  controller.viewPostsOf(user,function(err, posts){
        if (err) return res.status(500).json(err);  // server error
        res.json(posts); // returns pets of specified user
    }); 
});

router.post('/addPost',function(req,res,next){

  if(req.session.body){
    console.log(req.body);
    var post_uuid=shortid.generate();
    var today=new Date();
    var image_urlpath;

    console.log(req.files);
    if(typeof req.files!=='undefined'){
      if(req.files.photo){
        var image=req.files.photo;
        var name = post_uuid + '-attached-image-' + image.name;
        var image_urlpath = __dirname + '/images_attached_to_posts/' + name;
        var mime = req.files.photo.mimetype;
        if (mime.substring(0,5) === 'image'){
          image.mv(image_urlpath, function(err){
            if (err){
              console.log('api err: not able to receive image');  
            }  
          });
        }else{
          console.log('file uploaded is not image');
        }
      }else if(!req.files.photo){
        image_urlpath = null;
       
      }
    }else{
      image_urlpath = null;

      console.log('file is undefined');
    }
    var newPost={
      "Posted_by": req.session.body.Username,
      "post_title": req.body.post_title,
      "text_post": req.body.text_post,
      "post_uuid": post_uuid,
      "image_urlpath":image_urlpath,
      "created_at": today,
      "updated_at":today
    }
    controller.addPost(newPost,function(err,results){
      if(err) res.status(500).send(err);//server error
      else{
        res.status(201).json(results); // returns info of newly added post
        console.log("POSTED!!!!");
        }
    });
   
  }else{
    console.log("Please sign in or sign up first");
    res.redirect('/api/');
  }
});

router.get('*', function(req, res, next) {
  if(req.session.body) res.redirect('/api/community/feed');
  else res.redirect('/api/community/');
});

module.exports=router;