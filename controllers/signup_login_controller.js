var connection = require('./../database/connection');
var bcrypt = require('bcryptjs');

// https://www.npmjs.com/package/bcryptjs
module.exports.registerUser = function(newUser, callback){
    bcrypt.genSalt(10, function(err, salt) {
    bcrypt.hash(newUser.password, salt, function(err, hash) {
        newUser.password = hash;
        // console.log('hashed password: ' + hash);
    connection.query('INSERT INTO users SET ?', newUser, function (err, results, fields) {
        if (err){
            console.log('Registration failed');
            console.log(err); 
        }else{
            console.log('Registration done'); 
        }
       // connection.end();
        });
    });
    });
}

module.exports.loginUser = function(credentials, callback){
    var Username = credentials.Username;
    var password = credentials.password;

    connection.query('SELECT * FROM users WHERE Username = ?', [Username], function (error, results, fields) {
      if (error) {
        // console.log('login failed; error with query');
        console.log(error);
        callback(null, false);
      }else{
        // console.log(results);
        if(results.length > 0){
            bcrypt.compare(password, results[0].password, function(err, isMatch) {
                if (err){
                    // console.log('err with bcrypt');
                    throw err;
                    callback(null, false);
                }   
                callback(null, true);
            });
        }else{
            // console.log('Username doesn\'t exist');
            callback(null, true);
        }
    }});
}

module.exports.registerShelter = function(newShelter, callback){
    bcrypt.genSalt(10, function(err, salt) {
    bcrypt.hash(newShelter.password, salt, function(err, hash) {
        newShelter.password = hash;
        // console.log('hashed password: ' + hash);
    connection.query('INSERT INTO shelters SET ?', newShelter, function (err, results, fields) {
        if (err) {
            console.log('Registration failed');
            console.log(err); 
        }else{
            console.log('Registration done'); 
        }
        //connection.end();
        });
    });
    });
}

module.exports.loginShelter = function(req, callback){
    var Username = req.Username;
    var password = req.password;

    connection.query('SELECT * FROM shelters WHERE Username = ?', [Username], function (error, results, fields) {
        if (error){
            // console.log('login failed; error with query');
            console.log(error);
            callback(null, false);
        }else{
            // console.log(results);
            if(results.length > 0){
                bcrypt.compare(password, results[0].password, function(err, isMatch) {
                    if (err){
                        // console.log('err with bcrypt');
                        throw err;
                        callback(null, false);
                    }
                    callback(null, true);
                });
            }else{
                // console.log('Username doesn\'t exist');  
                callback(null, true);
            }
        }});
}

