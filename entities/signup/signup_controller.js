const connection = require('./../../database/connection');
const bcrypt = require('bcryptjs'); // https://www.npmjs.com/package/bcryptjs

module.exports.usernameCheckerUser = function(Username, callback) {
  connection.query(
    'SELECT * FROM users where Username = ?',
    Username,
    (err, results) => {
      if (err) callback(err);
      if (results.length > 0) {
        console.log('Username is already used! usernameChecker');
        callback(null, true);
      } else callback(null, false);
    }
  );
};

module.exports.emailCheckerUser = function(email, callback) {
  connection.query(
    'SELECT * FROM users where email = ?',
    email,
    (err, results) => {
      if (err) callback(err);
      if (results.length > 0) {
        console.log('email is already used! emailChecker');
        callback(null, true);
      } else callback(null, false);
    }
  );
};

module.exports.registerUser = function(newUser, callback) {
  bcrypt.genSalt(10, function(err, salt) {
    bcrypt.hash(newUser.password, salt, function(err, hash) {
      newUser.password = hash;
      // console.log('hashed password: ' + hash);
      connection.query('SELECT * FROM shelters where Username = ?',newUser.Username,(err, results) => {
          if (err) callback(err);
          if (results.length > 0) {
            callback(null, 'TAKEN_UN_SHELTERS');
          } else {
            connection.query(
              'SELECT * FROM users where Username = ? OR email = ?',
              [newUser.Username, newUser.email],
              function(err, results, fields) {
                if (results.length == 2) {
                  callback(null, 'TAKEN_BOTH_ERR');
                } else if (results.length == 1) {
                  if (
                    newUser.Username == results[0].Username &&
                    newUser.email == results[0].email
                  )
                    callback(null, 'TAKEN_BOTH_ERR');
                  else if (newUser.Username == results[0].Username)
                    callback(null, 'TAKEN_UN');
                  else if (newUser.email == results[0].email)
                    callback(null, 'TAKEN_EA');
                } else {
                  connection.query('INSERT INTO users SET ?', newUser, function(err) {
                    console.log(err);
                    if (err) callback(null, 'QUERY_ERR');
                    else callback(null, 'SIGNUP_SUCCESS');
                  });
                }
              }
            );
          }
      });   
    });
  });
};

module.exports.usernameCheckerShelter = function(Username, callback) {
  connection.query(
    'SELECT * FROM shelters where Username = ?',
    Username,
    (err, results) => {
      if (err) callback(err);
      if (results.length > 0) {
        console.log('Username is already used! usernameChecker');
        callback(null, true);
      } else callback(null, false);
    }
  );
};

module.exports.emailCheckerShelter = function(email, callback) {
  connection.query(
    'SELECT * FROM shelters where email = ?',
    email,
    (err, results) => {
      if (err) callback(err);
      if (results.length > 0) {
        console.log('email is already used! emailChecker');
        callback(null, true);
      } else callback(null, false);
    }
  );
};

module.exports.registerShelter = function(newShelter, callback) {
  bcrypt.genSalt(10, function(err, salt) {
    bcrypt.hash(newShelter.password, salt, function(err, hash) {
      newShelter.password = hash;
      // console.log('hashed password: ' + hash);
      connection.query(
        'SELECT * FROM users where Username = ?',
        newShelter.Username,
        (err, results) => {
          if (err) callback(err);
          if (results.length > 0) {
            callback(null, 'TAKEN_UN_USERS');
          } else {
            connection.query(
              'SELECT * FROM shelters where Username = ? OR email = ?',
              [newShelter.Username, newShelter.email],
              function(err, results, fields) {
                if (results.length == 2) {
                  callback(null, 'TAKEN_BOTH_ERR');
                } else if (results.length == 1) {
                  if (
                    newShelter.Username == results[0].Username &&
                    newShelter.email == results[0].email
                  )
                    callback(null, 'TAKEN_BOTH_ERR');
                  else if (newShelter.Username == results[0].Username)
                    callback(null, 'TAKEN_UN');
                  else if (newShelter.email == results[0].email)
                    callback(null, 'TAKEN_EA');
                } else {
                  connection.query('INSERT INTO shelters SET ?', newShelter, function(
                    err
                  ) {
                    if (err) callback(null, 'QUERY_ERR');
                    else callback(null, 'SIGNUP_SUCCESS');
                  });
                }
              }
            );
          }
        }
      );
    });
  });
};
