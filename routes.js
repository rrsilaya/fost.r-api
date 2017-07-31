// this will import all of the routes needed
const express = require('express');
const router = express.Router();
const validator = require('express-validator');
const session = require('express-session');
const connection = require('./database/connection');
var signup = require('./entities/signup/signup_routes');
var login = require('./entities/login/login_routes');
var pets = require('./entities/pets/pets_routes');
var community = require('./entities/community/community_routes');
var rescue = require('./entities/rescue/rescue_routes');
var accounts = require('./entities/accounts/accounts_routes');
var notify = require('./entities/notifications/notifications_controllers');
const path=require('path');

router.use(validator());

/* for express-session */
router.use(
  session({
    secret: 'fost.r_jpad',
    resave: true,
    saveUninitialized: true
  })
);

//https://scotch.io/tutorials/build-a-restful-api-using-node-and-express-4
// middleware to use for all requests; check if logged in
router.use('/signup', signup);
router.use('/login', login);

router.use(function(req, res, next) {
  if (req.session.body) {
    var isAuth = true;
    next();
  } else res.status(403).send(null);
});

router.get('/session', function(req, res, next) {
  return res
    .status(200)
    .send([req.session.body.accountType, req.session.body.Username]);
});

router.use('/accounts', accounts);
router.use('/pets', pets);
router.use('/community', community);
router.use('/rescue', rescue);


router.get('/', function(req, res) {
  res.json({ message: 'to access api: localhost:3000/api/<route>' });
});

router.get('/notifications', function(req, res, next) {
  notify.viewNotif(req.session.body.Username, function(err, results) {
    if (err) res.status(500).send(err);
    else if (results.length)
      //server error
      res.status(200).json(results);
    else res.status(204).send(null);
  });
});

router.get('/feed', function(req, res, next) {
  console.log('Feed');
  res.status(200).end();
});

router.get('/logout', function(req, res, next) {
  req.session.destroy();
  prompt = 'User logged out';
  res.status(200).send(null);
  console.log(prompt);
});

module.exports = router;
