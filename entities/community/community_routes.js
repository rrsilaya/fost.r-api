const express=require('express');
const router=express.Router(); 
var fileUpload = require('express-fileupload'); // for file upload
var mv = require('mv');                         // for file upload; won't work when declared as const
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
/************************* POSTS *******************************/

/*  views all post sorted by date
    comments are not shown

*/
router.get('/', function(req,res,next){
  if(req.session.body){
    controller.viewAllPosts(function(err,posts){
      if (err) return res.status(500).json(err);  // server error
      else res.json(posts); // returns all posts
    });
  }else res.status(403).json("Please log in or sign up first .");
  
  
});

/* view a post given its uuid ; shows all comments on the post*/
router.get('/:post_uuid/viewPost',function(req,res,next){
  if(req.session.body){
    var post_uuid=req.params.post_uuid;
    controller.viewPost(post_uuid,function(err,post){
      if (err) return res.status(500).json(err);  // server error
      else{
        //res.send(post,comments); // returns pets of specified user
        controller.viewAllComments(post_uuid,function(err,comments){
          if(err) return res.status(500).json(err);  // server error
          else {

            res.send([post,comments]);
          }
        });
      }
    });
    

  }else res.status(403).json("Please log in or sign up first .");

  
});

/*
view all post of a specific user/shelter ; 
'user' will be used for both user and shelter
does not show comments on the post
*/
router.get('/:user/viewPosts',function(req,res,next){
  if(req.session.body){
    var user=req.params.user;
    console.log(user);
    controller.viewPostsOf(user,function(err, posts){
        if (err) return res.status(500).json(err);  // server error
        else res.json(posts); // returns pets of specified user
    }); 
  }else res.status(403).json("Please log in or sign up first .");

});

/*delete a post given its uuid*/
router.delete('/:post_uuid/deletePost',function(req,res,next){
  if(req.session.body){
    var post_uuid=req.params.post_uuid;
    var user=req.session.body.Username;
    //delete post on db
    controller.deletePost(post_uuid,user,function(err,results){
      if (err) return res.status(500).json(err);  // server error
      else if (results.affectedRows==0) return res.status(500).json({message: 'unable to delete post'});
      else return res.status(200).json(results);
    });
    //delete all comments in db
    controller.deleteAllComments(post_uuid,function(err,results){
      if (err) return res.status(500).json(err);  // server error
      else if (results.affectedRows==0) return res.status(500).json({message: 'unable to delete comments'});
      else return res.status(200).json(results);
    })
  }else res.status(403).json("Please log in or sign up first .");
});

/*delete all posts of user*/
router.delete('/deleteAllMyPosts',function(req,res,next){
  if(req.session.body){
    var user=req.session.body.Username;
    controller.deleteAllPosts(user, function(err, results){
        if (err) return res.status(500).json(err);  // server error
        else if (results.affectedRow==0) return res.status(500).json({message: 'unable to delete'});
        else return res.status(200).end("All Your Posts were DELETED");    
    });
  }else res.status(403).json("Please log in or sign up first .");
  
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

/******************************************************************/


/*********************** COMMENTS ON POSTS ************************/

/* add comment to db if post_uuid is valid*/
router.post('/:post_uuid/addComment',function(req,res,next){
  if(req.session.body && req.body.comment_body){
    var comment_body=req.body.comment_body;
    var post_uuid=req.params.post_uuid;
    var user=req.session.body.Username;
    var today=new Date();
    var comment_uuid=shortid.generate();
    var image_urlpath;
    if(typeof req.files!=='undefined'){
      if(req.files.photo){
        var image=req.files.photo;
        var name=comment_uuid + '-attached-image-' + image.name;
        var image_urlpath = __dirname + '/images_attached_to_comments/' + name;
        var mime = req.files.photo.mimetype;
        if (mime.substring(0,5) === 'image'){
          image.mv(image_urlpath, function(err){
            if (err){
              image_urlpath=null;

              console.log('api err: not able to receive image');
            }  
          });
        }else {
          image_urlpath=null;

          console.log('file uploaded is not image');
        }

      }else if (!req.files.photo){
        image_urlpath=null;
        console.log("user did not attached an image");
      }
    }else{
      console.log("file is undefined");
      image_urlpath=null;
    }
    var newComment={
      "comment_uuid":comment_uuid,
      "commented_by": user,
      "comment_body" :comment_body,
      "image_urlpath":image_urlpath,
      "created_at": today,
      "updated_at":today,
      "post_uuid":post_uuid
    }

    controller.addComment(newComment,function(err,results){
      if(err) res.status(500).send(err);//server error
      else if(results.affectedRows!==0){
        res.status(201).json(newComment); // returns info of newly added post
        console.log("Comment Added!!!!");
      }
    });

  }else res.status(401).json("Please log in or sign up first .");
    
    
});
/* view all comments on a post given the post_uuid*/
router.get('/:post_uuid/viewAllComments',function(req,res,next){
  if(req.session.body){
      var post_uuid=req.params.post_uuid;
      controller.viewAllComments(post_uuid,function(err,comments){
        if(err) return res.status(500).json(err);  // server error
        else res.json(comments);
      });

  }else res.status(403).json("Post_uuid can be invalid or user is not logged in");
});

/*delete a comment in a post (iff comment is posted by user itself)*/
router.delete('/:post_uuid/:comment_uuid/deleteComment',function(req,res,next){
  if(req.session.body){
    var post_uuid=req.params.post_uuid;
    var comment_uuid=req.params.comment_uuid;
    var user=req.session.body.Username;
    controller.deleteComment(post_uuid,comment_uuid,user,function(err,results){
      if(err) return res.status(500).json(err);
      else if(results.affectedRows==0) return res.status(500).json("unable to delete comment");
      else res.json(results);
    });
  }else res.status(403).json("Post_uuid can be invalid or user is not logged in");
});
/*****************************************************************/

router.get('*', function(req, res, next) {
  if(req.session.body) res.redirect('/api/community/');
  else res.status(403).json("Please log in or sign up first .");
});

module.exports=router;