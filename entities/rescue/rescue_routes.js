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
var controller = require('./rescue_controllers');
var notify = require('./../notifications/notifications_controllers');

router.use(validator()); // express-validator
router.use(fileUpload()); // express-fileupload

//display all requests for rescue
router.get('/', function(req, res, next) {
  if (req.session.body.accountType === 'shelter') {
    controller.viewAllRequests(function(err, requests) {
      if (err)
        return res.status(500).json(err); // server error
      else res.status(200).json(requests); // returns all posts
    });
  } else if (req.session.body.accountType === 'user') {
    controller.viewUserRequests(req.session.body.Username, function(
      err,
      requests
    ) {
      if (err)
        return res.status(500).json(err); // server error
      else res.status(200).json(requests); // returns request
    });
  }
});
//view all request a user has submitted
router.get('/viewMyRequests', function(req, res, next) {
  if (req.session.body.accountType === 'user') {
    controller.viewUserRequests(req.session.body.Username, function(
      err,
      requests
    ) {
      if (err)
        return res.status(500).json(err); // server error
      else res.status(200).json(requests); // returns request
    });
  }
});

//view a request
router.get('/:rescue_uuid', function(req, res, next) {
  var rescue_uuid = req.params.rescue_uuid;

  if (req.session.body.accountType === 'shelter') {
    // since shelters are the only one who can view the rescue requests; the account also has to be checked (added the accountType variable to login as well)
    controller.viewRequest(rescue_uuid, function(err, request) {
      if (err) return res.status(500).json(err); // server error
      res.status(200).json(request); // returns specific post
    });
  } else if (req.session.body.accountType === 'user') {
    //user can only view a request he/she posted
    controller.getSender(rescue_uuid, function(err, sender) {
      if (err) res.status(403).end();
      else if (sender) {
        var newNotif = {
          notif_for: sender[0].sender_Username,
          notif_message:
            req.session.body.Username +
            ' resolved your request for animal rescue. ',
          notif_url: 'api/rescue/' + rescue_uuid,
          date_created: new Date()
        };
        //add to notifications table
        //when 'notif_for' is logged in,he/she will received this notification
        notify.addNotif(newNotif, function(err, results) {
          if (err) console.log(err);
          else console.log(sender[0].sender_Username + 'will be notified');
        });
        if (sender[0].sender_Username === req.session.body.Username) {
          controller.viewRequest(rescue_uuid, function(err, request) {
            if (err) return res.status(500).json(err); // server error
            res.status(200).json(request); // returns specific post
          });
        } else res.status(403).json(null);
      }
    });
  }
});

//delete a request
router.delete('/:rescue_uuid', function(req, res, next) {
  var rescue_uuid = req.params.rescue_uuid;

  if (req.session.body.accountType === 'user') {
    controller.deleteRequest(rescue_uuid, req.session.body.Username, function(
      err,
      results
    ) {
      if (err) return res.status(500).json(err);
      else if (results.affectedRows == 0) {
        // server error
        return res.status(500);
        console.log('unable to delete request');
      } else res.status(204).end(); // deleted request
    });
  } else if (req.session.body.accountType === 'shelter') {
    //if shelter resolved the request
    //get sender username
    controller.getSender(rescue_uuid, function(err, sender) {
      if (err) res.status(403).end();
      else if (sender) {
        //notify sender

        //delete request
        controller.deleteRequest(
          rescue_uuid,
          sender[0].sender_Username,
          function(err, results) {
            if (err) return res.status(500).json(err);
            else if (results.affectedRows == 0) {
              // server error
              return res.status(500);
              console.log('unable to delete request');
            } else res.status(204).end(); // deleted request
          }
        );
      }
    });
  }
});

//view all request of a user
router.get('/:user/viewAllRequests', function(req, res, next) {
  if (req.session.body.accountType === 'shelter') {
    var user = req.params.user;
    controller.viewUserRequests(user, function(err, requests) {
      if (err)
        return res.status(500).json(err); // server error
      else res.status(200).json(requests); // returns request
    });
  }
});

//add a rescue request to db
router.post('/submit_a_rescue_request', function(req, res, next) {
  if (req.body.rescue_body && req.session.body.accountType === 'user') {
    var today = new Date();
    var rescue_uuid = shortid.generate();
    var rescue_imgurl, imgurl;

    //select user details
    controller.getUser(req.session.body.Username, function(err, user) {
      if (err) res.status(403).send('cannot get user details');
      else if (user.length !== 1) res.status(403).send('user not found');
      else {
        var contactnum_sender = user[0].contactnum;
        var address_sender = user[0].address;
        var email_sender = user[0].email;
        if (typeof req.files !== 'undefined') {
          if (req.files.photo) {
            var image = req.files.photo;
            var name = rescue_uuid + '_' + image.name;
            rescue_imgurl = __dirname + '/rescue-images/' + name;
            imgurl = '/rescue/rescue-images/' + name;
            var mime = req.files.photo.mimetype;
            if (mime.substring(0, 5) === 'image') {
              image.mv(rescue_imgurl, function(err) {
                if (err) {
                  //imgurl = null;
                  console.log('api err: not able to receive image');
                }
              });
            } else {
              //imgurl = null;
              console.log('file uploaded is not image');
            }
          } else if (!req.files.photo) {
            //imgurl = null;
          }
        } else {
          //imgurl=null;
          console.log('file is undefined');
        }
        var newRescue = {
          rescue_uuid: rescue_uuid,
          rescue_body: req.body.rescue_body,
          rescue_imgurl: imgurl,
          rescue_abspath: rescue_imgurl,
          sender_Username: req.session.body.Username,
          date_submitted: today,
          contactnum_sender: contactnum_sender,
          email_sender: email_sender,
          address_sender: address_sender,
          updated_on: today
        };
      }
      controller.addRescue(newRescue, function(err, results) {
        if (err) res.status(500).send(err);
        else if (results.affectedRows == 1) res.status(201).json(newRescue);
        else res.status(400);
      });
    });
  }
});

router.get('*', function(req, res, next) {
  res.redirect('/api/rescue/');
});

module.exports = router;
