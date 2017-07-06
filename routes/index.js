var express = require('express');
var router = express.Router();
var session = require('express-session');

var controller = require('./../controllers/signup_login_controller');

var sess; 

/* for express-session */
router.use(session({
    secret:"fost.r_jpad",
    resave: false,
    saveUninitialized: false
})); 

/* GET home page. */
router.get('/', function(req, res, next) {
    sess = req.session;
    if (sess.body) res.redirect('/adopt');
    else {
      res.render('index', { title: 'fost.r' });
    }
});

router.get('/community', function(req, res, next) {
    sess = req.session;
    if (sess.body)  res.render('community', { title: 'fost.r' });
    else {
      res.redirect('/');
    }
});

router.get('/dates', function(req, res, next) {
    sess=req.session;
    if (sess.body)  res.render('dates', { title: 'fost.r' });
    else {
        res.redirect('/');
    }
   
});

router.get('/rescue', function(req, res, next) {
    sess=req.session;
    if (sess.body)  res.render('rescue', { title: 'fost.r' });
    else {
        res.redirect('/');
    } 
});

/* Login */
router.get('/login', function(req, res, next) {
  	sess = req.session;
    if (sess.body) res.redirect('/adopt');
    else res.render('login', { title: 'fost.r' });
});

router.get('/login_user', function(req, res, next) {
  	sess = req.session;
    if (sess.body) res.redirect('/adopt');
    else res.render('login_user', { title: 'fost.r' });
});

router.get('/login_shelter', function(req, res, next) {
  	sess = req.session;
    if (sess.body) res.redirect('/adopt');
    else res.render('login_shelter', { title: 'fost.r' });
});

/* signup */ 
router.get('/signup', function(req, res, next) {
  	sess = req.session;
    if (sess.body) res.redirect('/adopt');
    else res.render('signup', { title: 'fost.r' });
});

router.get('/signup_user', function(req, res, next) {
  	sess = req.session;
    if (sess.body) res.redirect('/adopt');
    else res.render('signup_user', { title: 'fost.r' });
});

router.get('/signup_shelter', function(req, res, next) {
  	sess = req.session;
    if (sess.body) res.redirect('/adopt');
    else res.render('signup_shelter', { title: 'fost.r' });
});

router.get('/adopt', function (req, res, next) {
    sess = req.session;
    if(sess.body){
        res.render('adopt', { 
            title: 'fost.r',
            Username: sess.body.Username,
            Password: sess.body.password 
        });
    }else{
        res.redirect('/');
    }
 });

// login_user post
router.post('/login_user', function (req, res, next){
    sess = req.session;
    if(!sess.body){
        var credentials = req.body;

        controller.loginUser(credentials, function(err, isMatch){
            if (err){
                console.log('There was an error in the login controller')
                throw err;  
            }
            if (isMatch){
                console.log('Successfully logged in');
                sess.body = credentials;
                res.redirect('/adopt');
            }else{
                res.redirect('login_user');
            }
        });
    }
    
});

// signup_user post
router.post('/signup_user', function(req, res, next) {


    var Username = req.body.Username;
    var firstname = req.body.firstname;
    var lastname = req.body.lastname;
    var birthday = req.body.birthday;
    var address = req.body.address;
    var contactnum = req.body.contactnum;
    var email = req.body.email;
    var password = req.body.password;

    // checks req.<field>; the following messages can be sent to the views
    // https://github.com/ctavan/express-validator
    req.checkBody('Username', 'Username is required').notEmpty();
    req.checkBody('firstname', 'First name is required').notEmpty();
    req.checkBody('lastname', 'Last name is required').notEmpty();
    req.checkBody('birthday', 'Birthday is required').notEmpty(); // birthday should be between 01-01-1917 and 12-31-2007 only
    req.checkBody('address', 'Address is required').notEmpty();
    req.checkBody('contactnum', 'Contact Number is required and should be numbers only').notEmpty().isInt();
    req.checkBody('email', 'Email is required').isEmail();
    req.checkBody('password', 'password is required').notEmpty();
    // req.checkBody('password', 'password is required').isLength({min: 6, max: 18}); // commented first for quick testing 

    var errors = req.validationErrors();

    // may pop error message upon rendering of the signup page again;
    // res.render('signup_user', {<name for errors>: errors}) instead of what is placed in the if-statement

    if (errors){
        console.log('There was an error in the field');
        res.redirect('/signup_user');
    }else{
        
        var today = new Date();

        var newUser = {
            "Username": Username,
            "firstname":firstname,
            "lastname": lastname,
            "birthday": birthday,
            "address": address,
            "contactnum": contactnum,
            "email": email,
            "password": password,
            "created_at": today,
            "updated_at": today  
        }

        controller.registerUser(newUser, function(err, callback){
            if (err){
                console.log(errors[0].msg);
                console.log('There was an error in the register controller');
                throw err;
            }
            switch(callback){
                case 'SIGNUP_SUCCESS':
                    errors = "Successfully signed up.";
                    console.log('Successfully created user');
                    res.redirect('/login'); 
                    break;
                case 'QUERRY ERROR':
                    console.log('Sorry, there was some error in the query.');
                    // errors = "There was some error in the processing. Please try again.";
                    res.redirect('/signup_user');
                case 'TAKEN_BOTH_ERR':
                    // console.log('Sorry, the email and username you entered are already taken.');
                    errors = "Email and username are already taken. Please use another.";
                    console.log(errors);
                    res.redirect('/signup_user');
                    break;
                case 'TAKEN_EA':
                    console.log('Sorry, the email address you entered is already taken');
                    // errors = "The email address you entered is already taken. Please use another.";
                    res.redirect('/signup_user');
                    break;
                case 'TAKEN_UN':
                    console.log('Sorry, the username you entered is already taken.');
                    // errors = "The username you entered is already taken. Please use another.";
                    res.redirect('/signup_user');
                    break;
            }
        });
    }
});

// login_shelter post
router.post('/login_shelter', function (req, res, next){
    sess = req.session;
    if(!sess.body){
        var credentials = req.body;
        controller.loginShelter(credentials, function(err, isMatch){
        if (err){
            console.log('There was an error in the login controller')
            throw err;  
        }
        if (isMatch){
            console.log('Successfully logged in');
            sess.body = req.body;
            res.redirect('/adopt');
        }else{
            res.redirect('/login_shelter');
        }
        });
    }
});

// signup_shelter post
router.post('/signup_shelter', function(req, res, next) {
    var Username = req.body.Username;
    var shelter_name = req.body.shelter_name;
    var address = req.body.address;
    var contactnum = req.body.contactnum;
    var email = req.body.email;
    var password = req.body.password;

    // checks req.<field>; the following messages can be sent to the views
    // https://github.com/ctavan/express-validator
    req.checkBody('Username', 'Username is required').notEmpty();
    req.checkBody('shelter_name', 'Shelter name is required').notEmpty();
    req.checkBody('address', 'Address is required').notEmpty();
    req.checkBody('contactnum', 'Contact Number is required and should be numbers only').notEmpty().isInt();
    req.checkBody('email', 'Email is required').isEmail();
    req.checkBody('password', 'password is required').notEmpty();
    // req.checkBody('password', 'password is required').isLength({min: 6, max: 18}); // commented first for quick testing 

    var errors = req.validationErrors();

    // may pop error message upon rendering of the signup page again;
    // res.render('signup_user', {<name for errors>: errors}) instead of what is placed in the if-statement

    if (errors){
        console.log('There was an error in the field');
        console.log(errors[0].msg);
        res.render('signup_shelter');
    }else{
        var today = new Date();

        var newShelter = {
            "Username": Username,
            "shelter_name":shelter_name,
            "address": address,
            "contactnum": contactnum,
            "email": email,
            "password": password,
            "created_at": today,
            "updated_at": today  
        }

        controller.registerShelter(newShelter, function(err, callback){
            if (err){
                console.log('There was an error in the register controller');
                throw err;
            }
            switch(callback){
                case 'SIGNUP_SUCCESS':
                    // errors = "Successfully signed up.";
                    console.log('Successfully created user');
                    res.redirect('/login'); 
                    break;
                case 'QUERRY ERROR':
                    console.log('Sorry, there was some error in the query.');
                    // errors = "There was some error in the processing. Please try again.";
                    res.redirect('/signup_shelter');
                case 'TAKEN_BOTH_ERR':
                    console.log('Sorry, the email and username you entered are already taken.');
                    // errors = "Email and username are already taken. Please use another.";
                    res.redirect('/signup_shelter');
                    break;
                case 'TAKEN_EA':
                    console.log('Sorry, the email address you entered is already taken');
                    // errors = "The email address you entered is already taken. Please use another.";
                    res.redirect('/signup_shelter');
                    break;
                case 'TAKEN_UN':
                    console.log('Sorry, the username you entered is already taken.');
                    // errors = "The username you entered is already taken. Please use another.";
                    res.redirect('/signup_shelter');
                    break;
            }
        });
    }
});

router.get('/logout', function(req, res, next) {
    req.session.destroy();  
    res.redirect('/');
    console.log('Successfully logged out/ destroyed session');
});

router.get('*', function(req, res, next) {
    res.redirect('/');
});

module.exports = router;
