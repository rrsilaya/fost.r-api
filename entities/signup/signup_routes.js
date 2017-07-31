const express = require('express');
const router = express.Router();
const validator = require('express-validator');
const session = require('express-session');
var mv = require('mv');
var fileUpload = require('express-fileupload');
var sizeOf = require('image-size'); // get image dimensions
const connection = require('./../../database/connection');
const controller = require('./signup_controller');

router.use(validator()); // express-validator
router.use(fileUpload()); // express-fileupload


router.use(function(req, res, next) {
  console.log('signup routes getting request...');
  next();
});

router.post('/shelterUsername', function(req, res) {
  // assuming that request has a Username
  controller.usernameCheckerShelter(req.body.Username, function(err, results) {
    if (err) {
      console.log('some error with checker');
      res.status(500).json(err);
    }
    if (!results) res.status(200).send(null);
    else if (results) res.status(400).send(null);
  });
});

router.post('/shelterEmail', function(req, res) {
  // assuming that request has a email
  controller.emailCheckerShelter(req.body.email, function(err, results) {
    if (err) {
      console.log('some error with checker');
      res.status(500).json(err);
    }
    if (!results) res.status(200).send(null);
    else if (results) res.status(400).send(null);
  });
});

router.post('/shelter', function(req, res, next) {
  // console.log(req.files);
  if (
    typeof req.body.Username !== 'undefined' &&
    typeof req.body.shelter_name !== 'undefined' &&
    typeof req.body.address !== 'undefined' &&
    typeof req.body.contactnum !== 'undefined' &&
    typeof req.body.email !== 'undefined' &&
    typeof req.body.password !== 'undefined' &&
    typeof req.files.file !== 'undefined' 
   
  ) {
    // checks req.<field>; the following messages can be sent to the views
    // https://github.com/ctavan/express-validator
    req.checkBody('Username', 'Username is required').notEmpty();
    req.checkBody('shelter_name', 'Shelter name is required').notEmpty();
    req.checkBody('address', 'Address is required').notEmpty();
    req
      .checkBody(
        'contactnum',
        'Contact Number is required and should be numbers only'
      )
      .notEmpty();
    req.checkBody('email', 'Email is required').isEmail();
    req.checkBody('password', 'password is required').notEmpty();
    // req.checkBody('password', 'password is required').isLength({min: 6, max: 18}); // commented first for quick testing

    var errors = req.validationErrors();
    if (errors || !req.files.file) res.status(400).json(errors);
    else {
      const file = req.files.file; //use later for file-upload
      var proofname = req.body.Username + '-proof-' + file.name;
      var uploadpath =__dirname +'/shelter_docs/'+proofname;
      var today = new Date();
      var newShelter = {
        Username: req.body.Username,
        shelter_name: req.body.shelter_name,
        address: req.body.address,
        contactnum: req.body.contactnum,
        email: req.body.email,
        password: req.body.password,
        created_at: today,
        updated_at: today
      };

      if (req.files.icon) {
        const icon = req.files.icon; //use later for file-upload
        var mime = req.files.icon.mimetype;
        var name = newShelter.Username + '-' + icon.name;
        var url = __dirname +'/icons/shelters/'+ name;
        if (mime.substring(0, 5) === 'image') {
          icon.mv(url, function(err) {
            if (err) {
              console.log('api err: not able to receive image');
            } else {
              newShelter.icon_url = '/signup/icons/shelters/' + name;
              var dimensions = sizeOf(url);
              newShelter.icon_width = dimensions.width;
              newShelter.icon_height = dimensions.height;
            }
          });
        } else console.log('image only for icons');
      }
      file.mv(uploadpath, function(err) {
        if (err) {
          console.log(err);
          console.log('File not uploaded, please try again');
          res.status(500).redirect('/api/signup');
        } else newShelter.file_path ='/signup/shelter_docs/' + proofname;
      });
      controller.registerShelter(newShelter, function(err, callback) {
        if (err) {
          console.log('There was an error in the register controller');
          res.status(500).json(err);
        }
        switch (callback) {
          case 'SIGNUP_SUCCESS':
            errors = 'Successfully signed up.';
            console.log(errors);
            console.log(newShelter);
            res.status(201).json(newShelter);
            break;
          case 'QUERRY_ERR':
            errors = 'Sorry, there was some error in the query.';
            console.log(errors);
            return res.status(500).json(err);
            break;
          case 'TAKEN_BOTH_ERR':
            errors =
              'Sorry, the email and username you entered are already taken.';
            console.log(errors);
            return res.status(400).json(callback);
            break;
          case 'TAKEN_EA':
            errors = 'Sorry, the email address you entered is already taken';
            console.log(errors);
            return res.status(400).json(err);
            break;
          case 'TAKEN_UN':
            errors = 'Sorry, the username you entered is already taken.';
            console.log(errors);
            return res.status(400).json(err);
            break;
        }
      });
    }
  } else res.status(400).json({ message: 'invalid input' });
});

router.post('/userUsername', function(req, res) {
  // assuming that request has a Username
  controller.usernameCheckerUser(req.body.Username, function(err, results) {
    if (err) {
      console.log('some error with checker');
      res.status(500).json(err);
    }
    if (!results) res.status(200).send(null);
    else if (results) res.status(400).send(null);
  });
});

router.post('/userEmail', function(req, res) {
  // assuming that request has a email
  controller.emailCheckerUser(req.body.email, function(err, results) {
    if (err) {
      console.log('some error with checker');
      res.status(500).json(err);
    }
    if (!results) res.status(200).send(null);
    else if (results) res.status(400).send(null);
  });
});
router.post('/user', function(req, res, next) {
  if (
    typeof req.body.Username !== 'undefined' &&
    typeof req.body.firstname !== 'undefined' &&
    typeof req.body.lastname !== 'undefined' &&
    typeof req.body.birthday !== 'undefined' &&
    typeof req.body.address !== 'undefined' &&
    typeof req.body.contactnum !== 'undefined' &&
    typeof req.body.email !== 'undefined' &&
    typeof req.body.password !== 'undefined'
  ) {
    // checks req.<field>; the following messages can be sent to the views
    // https://github.com/ctavan/express-validator
    req.checkBody('Username', 'Username is required').notEmpty();
    req.checkBody('firstname', 'First name is required').notEmpty();
    req.checkBody('lastname', 'Last name is required').notEmpty();
    req.checkBody('birthday', 'Birthday is required').notEmpty();
    req.checkBody('address', 'Address is required').notEmpty();
    req
      .checkBody(
        'contactnum',
        'Contact Number is required and should be numbers only'
      )
      .notEmpty();
    req.checkBody('email', 'Email is required').isEmail();
    req.checkBody('password', 'password is required').notEmpty();
    // req.checkBody('password', 'password is required').isLength({min: 6, max: 18}); // commented first for quick testing

    var errors = req.validationErrors();
    if (errors) {
      res.status(400).json(errors);
    } else {
      var today = new Date();
      var newUser = {
        Username: req.body.Username,
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        birthday: req.body.birthday,
        address: req.body.address,
        contactnum: req.body.contactnum,
        email: req.body.email,
        password: req.body.password,
        created_at: today,
        updated_at: today
      };
      if (req.files) {
        const icon = req.files.icon; //use later for file-upload
        var mime = req.files.icon.mimetype;
        var name = newUser.Username + '-' + icon.name;
        var url = __dirname + '/icons/users/' + name;
        console.log('here');
        if (mime.substring(0, 5) === 'image') {
          icon.mv(url, function(err) {
            if (err) {
              console.log('api err: not able to receive image');
            } else {
              newUser.icon_url = '/signup/icons/users/' +name;
              var dimensions = sizeOf(url);
              newUser.icon_width = dimensions.width;
              newUser.icon_height = dimensions.height;
            }
          });
        } else console.log('image only for icons');
      }
      controller.registerUser(newUser, function(err, callback) {
        if (err) {
          console.log('There was an error in the register controller');
          res.status(500).json(err);
        }
        switch (callback) {
          case 'SIGNUP_SUCCESS':
            errors = 'Successfully signed up.';
            console.log(errors);
            console.log(newUser);
            res.status(201).json(newUser);
            break;
          case 'QUERRY_ERR':
            errors = 'Sorry, there was some error in the query.';
            console.log(errors);
            return res.status(400).json(errors);
            break;
          case 'TAKEN_BOTH_ERR':
            errors =
              'Sorry, the email and username you entered are already taken.';
            console.log(errors);
            return res.status(400).json(errors);
            break;
          case 'TAKEN_EA':
            errors = 'Sorry, the email address you entered is already taken.';
            console.log(errors);
            return res.status(400).json(errors);
            break;
          case 'TAKEN_UN':
            errors = 'Sorry, the username you entered is already taken.';
            console.log(errors);
            return res.status(400).json(errors);
            break;
        }
      });
    }
  } else res.status(400).json({ message: 'invalid input' });
});

router.get('*', function(req, res, next) {
  if (req.session.body) res.redirect('/api/feed');
});

module.exports = router;
