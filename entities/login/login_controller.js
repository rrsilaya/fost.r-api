const connection = require('./../../database/connection');
const bcrypt = require('bcryptjs');

// https://www.npmjs.com/package/bcryptjs
module.exports.loginUser = function(credentials, callback){
    var Username = credentials.Username;
    var password = credentials.password;

    connection.query('SELECT * FROM users WHERE Username = ?', [Username], function (error, results, fields) {
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

module.exports.loginShelter = function(credentials, callback){
    var Username = credentials.Username;
    var password = credentials.password;

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