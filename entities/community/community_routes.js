const express = require('express');
const router = express.Router();
var fileUpload = require('express-fileupload'); // for file upload
var mv = require('mv'); // for file upload; won't work when declared as const
const validator = require('express-validator');
var shortid = require('shortid');
shortid.characters(
  '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ$@'
);
// default has "-"" and "_" ; this sets the characters to only the entered characters (https://www.npmjs.com/package/shortid)
var controller = require('./community_controller');
var notify = require('./../notifications/notifications_controllers');

router.use(validator()); // express-validator
router.use(fileUpload()); // express-fileupload

router.use(function(req, res, next) {
  console.log('getting request...');
  next();
});

/************************* POSTS *******************************/

// Sorting

// newest to oldest
router.get('/sortByTimeDesc', function(req, res) {
  controller.sortByTimeDesc(function(err, posts) {
    if (err) res.status(500).json(err);
    res.status(200).json(posts);
  });
});

// oldest to newest
router.get('/sortByTimeAsc', function(req, res) {
  controller.sortByTimeAsc(function(err, posts) {
    if (err) res.status(500).json(err);
    res.status(200).json(posts);
  });
});

// most to least commented
router.get('/sortByCommentsDesc', function(req, res) {
  controller.sortByCommentsDesc(function(err, posts) {
    if (err) res.status(500).json(err);
    res.status(200).json(posts);
  });
});

// least to most commented
router.get('/sortByCommentsAsc', function(req, res) {
  controller.sortByCommentsAsc(function(err, posts) {
    if (err) res.status(500).json(err);
    res.status(200).json(posts);
  });
});

// most to least voted
router.get('/sortByVotesDesc', function(req, res) {
  controller.sortByVotesDesc(function(err, posts) {
    if (err) res.status(500).json(err);
    res.status(200).json(posts);
  });
});

// least to most voted
router.get('/sortByVotesAsc', function(req, res) {
  controller.sortByVotesAsc(function(err, posts) {
    if (err) res.status(500).json(err);
    res.status(200).json(posts);
  });
});

/* view a post given its uuid ; shows all comments and votes on the post*/
router.get('/:post_uuid', function(req, res, next) {
  var post_uuid = req.params.post_uuid;
  controller.viewPost(post_uuid, function(err, post) {
    if (err) return res.status(500).json(err);
    else {
      // server error
      //res.send(post,comments); // returns pets of specified user
      controller.viewAllComments(post_uuid, function(err, comments) {
        if (err) return res.status(500).json(err);
        else {
          // server error
          controller.showAllVotesPost(post_uuid, function(err, votes) {
            if (err) res.status(500).json(err);
            res.status(200).send([post, comments, votes]);
          });
        }
      });
    }
  });
});

router.put('/:post_uuid', function(req, res) {
  // will only be used for votes
  var post_uuid = req.params.post_uuid;
  var User = req.session.body.Username;
  controller.checkIfVotedPost(User, post_uuid, function(err, rows) {
    if (err) {
      res.status(500).send(err);
      console.log('checkIfVotedPost some err');
    } else if (!rows) {
      controller.voteToPost(User, post_uuid, function(err, rows2) {
        if (err) {
          console.log('voteToPost err');
          res.status(500).send(err);
        } else if (rows2) {
          /*notify the user */
          var query = 'SELECT * FROM posts WHERE post_uuid = ?';
          //returns Username of user who owns the post
          notify.getUser(query, post_uuid, function(err, results) {
            if (err) console.log(err);
            else if (
              results.affectedRows !== 0 &&
              results[0].Posted_by !== req.session.body.Username
            ) {
              var newNotif = {
                notif_for: results[0].Posted_by,
                notif_message: req.session.body.Username + ' voted your post. ',
                notif_url: 'api/community/' + post_uuid,
                date_created: new Date()
              };
              //add to notifications table
              //when 'notif_for' is logged in,he/she will received this notification
              notify.addNotif(newNotif, function(err, results) {
                if (err) console.log(err);
                //else if(results.affectedRows!==0) //res.status(200).send(newComment);
              });
            }
          });
          res.status(201).send(null);
        }
      });
    } else if (rows) {
      controller.unvoteToPost(User, post_uuid, function(err, rows2) {
        if (err) {
          console.log('unvoteToPost err');
          res.status(500).send(err);
        } else if (rows2) {
          res.status(201).send(null);
        }
      });
    }
  });
});

/*
view all post of a specific user/shelter ; 
'user' will be used for both user and shelter
does not show comments on the post
*/
router.get('/:user/viewPosts', function(req, res, next) {
  var user = req.params.user;
  console.log(user);
  controller.viewPostsOf(user, function(err, posts) {
    if (err)
      return res.status(500).json(err); // server error
    else res.json(posts); // returns posts of specified user
  });
});

/*delete a post given its uuid*/
router.delete('/:post_uuid', function(req, res, next) {
  var post_uuid = req.params.post_uuid;
  var user = req.session.body.Username;
  //delete post on db
  controller.deletePost(post_uuid, user, function(err, results) {
    if (err) return res.status(500).json(err);
    else if (results.affectedRows == 0)
      // server error
      return res.status(500);
    else return res.status(204).end();
  });
});

/*delete all posts of user and comments on the posts*/
router.delete('/deleteAllMyPosts', function(req, res, next) {
  var user = req.session.body.Username;
  controller.deleteAllPosts(user, function(err, results) {
    if (err) return res.status(500).json(err);
    else if (results.affectedRow == 0)
      // server error
      return res.status(500);
    else return res.status(204).end();
  });
});

router.post('/addPost', function(req, res, next) {
  var post_uuid = shortid.generate();
  var today = new Date();
  if (typeof req.files !== 'undefined') {
    if (req.files.photo) {
      var image = req.files.photo;
      var name = post_uuid + '-attached-image-' + image.name;
      var image_urlpath = __dirname + '/images_attached_to_posts/' + name;
      var mime = req.files.photo.mimetype;
      if (mime.substring(0, 5) === 'image') {
        image.mv(image_urlpath, function(err) {
          if (err) {
            console.log('api err: not able to receive image');
          }
        });
      } else {
        console.log('file uploaded is not image');
      }
    } else if (!req.files.photo) {
      image_urlpath = null;
    }
  } else {
    var image_urlpath = null;
    console.log('file is undefined');
  }
  var newPost = {
    Posted_by: req.session.body.Username,
    post_title: req.body.post_title,
    text_post: req.body.text_post,
    post_uuid: post_uuid,
    image_urlpath: image_urlpath,
    votes: 0,
    comments: 0,
    created_at: today,
    updated_at: today
  };
  controller.addPost(newPost, function(err, results) {
    if (err) res.status(500).send(err);
    else {
      //server error
      res.status(201).json(results); // returns info of newly added post
      console.log('POSTED!!!!');
    }
  });
});

/******************************************************************/

/*********************** COMMENTS ON POSTS ************************/

/* add comment to db if post_uuid is valid*/
router.post('/:post_uuid', function(req, res, next) {
  if (req.body.comment_body) {
    var comment_title = req.body.comment_title;
    var comment_body = req.body.comment_body;
    var post_uuid = req.params.post_uuid;
    var user = req.session.body.Username;
    var today = new Date();
    var comment_uuid = shortid.generate();
    var image_urlpath;
    if (typeof req.files !== 'undefined') {
      if (req.files.photo) {
        var image = req.files.photo;
        var name = comment_uuid + '-attached-image-' + image.name;
        var image_urlpath = __dirname + '/images_attached_to_comments/' + name;
        var mime = req.files.photo.mimetype;
        if (mime.substring(0, 5) === 'image') {
          image.mv(image_urlpath, function(err) {
            if (err) {
              image_urlpath = null;
              console.log('api err: not able to receive image');
            }
          });
        } else {
          image_urlpath = null;
          console.log('file uploaded is not image');
        }
      } else if (!req.files.photo) {
        image_urlpath = null;
        console.log('user did not attached an image');
      }
    } else {
      console.log('file is undefined');
      image_urlpath = null;
    }
    var newComment = {
      comment_title: comment_title,
      comment_uuid: comment_uuid,
      commented_by: user,
      comment_body: comment_body,
      image_urlpath: image_urlpath,
      votes: 0,
      created_at: today,
      updated_at: today,
      post_uuid: post_uuid
    };

    controller.addComment(newComment, function(err, results) {
      if (err) res.status(500).send(err);
      else if (results.affectedRows !== 0) {
        //server error
        console.log('Comment Added!!!!');
        /*notify the user */
        //define query
        var query = 'SELECT * FROM posts WHERE post_uuid = ?';
        //returns Username of user who owns the post
        notify.getUser(query, post_uuid, function(err, results) {
          if (err) console.log(err);
          else if (
            results.affectedRows !== 0 &&
            results[0].Posted_by !== req.session.body.Username
          ) {
            //server error
            var newNotif = {
              notif_for: results[0].Posted_by,
              notif_message:
                req.session.body.Username + ' commented on your post. ',
              notif_url: 'api/community/' + post_uuid,
              date_created: new Date()
            };
            //add to notifications table
            //when 'notif_for' is logged in,he/she will received this notification
            notify.addNotif(newNotif, function(err, results) {
              if (err) console.log(err);
              else if (results.affectedRows !== 0)
                //server error
                console.log('user will be notified');
            });
          }
        });
        res.status(201).send(newComment); // returns info of newly added post
      }
    });
  } else {
    res.status(403);
    console.log('Login or signup first.');
  }
});

/* view a comment (required : post_uuid && comment_uuid */
router.get('/:post_uuid/:comment_uuid', function(req, res, next) {
  var post_uuid = req.params.post_uuid;
  var comment_uuid = req.params.uuid;
  controller.viewComment(post_uuid, comment_uuid, function(err, comment) {
    if (err)
      return res.status(500).json(err); // server error
    else res.status(200).json(comment);
  });
});

// vote a comment given post uuid and comment uuid
router.put('/:post_uuid/:comment_uuid', function(req, res) {
  // will only be used for votes
  var post_uuid = req.params.post_uuid;
  var comment_uuid = req.params.comment_uuid;
  controller.voteComment(post_uuid, comment_uuid, function(err, results) {
    if (err) return res.status(500).json(err);
    else if (results.affectedRows !== 0) {
      /*notify the user */
      //define query
      var query = 'SELECT * FROM comments_on_posts WHERE comment_uuid = ?';
      //returns Username of user who owns the post
      notify.getUser(query, comment_uuid, function(err, results) {
        if (err) console.log(err);
        else if (
          results.affectedRows !== 0 &&
          results[0].commented_by !== req.session.body.Username
        ) {
          //server error
          var newNotif = {
            notif_for: results[0].commented_by,
            notif_message:
              req.session.body.Username + ' voted on your comment. ',
            notif_url: 'api/community/' + post_uuid + '/' + comment_uuid,
            date_created: new Date()
          };
          console.log(newNotif);
          //add to notifications table
          //when 'notif_for' is logged in,he/she will received this notification
          notify.addNotif(newNotif, function(err, results) {
            if (err) console.log(err); //server error
            //else if(results.affectedRows!==0) res.status(200).send(newComment);
          });
        }
      });
      res.status(201).json(results);
    }
  });
});

/*delete a comment in a post (iff comment is posted by user itself)*/
router.delete('/:post_uuid/:comment_uuid', function(req, res, next) {
  var post_uuid = req.params.post_uuid;
  var comment_uuid = req.params.comment_uuid;
  var user = req.session.body.Username;
  controller.deleteComment(post_uuid, comment_uuid, user, function(err,results){
    if (err) return res.status(500).json(err);
    else if (results.affectedRows == 0) return res.status(500);
    else res.status(204).end();
  });
});

/* view all comments on a post given the post_uuid*/
router.get('/:post_uuid/viewAllComments', function(req, res, next) {
  var post_uuid = req.params.post_uuid;
  controller.viewAllComments(post_uuid, function(err, comments) {
    if (err)
      return res.status(500).json(err); // server error
    else res.json(comments);
  });
});

/*****************************************************************/

router.get('*', function(req, res, next) {
  res.status(302).redirect('/api/community/');
});

module.exports = router;