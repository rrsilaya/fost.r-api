const connection = require('./../../database/connection');
const bcrypt = require('bcryptjs'); // for the password; ideally only the password's length should be passed

//https://stackoverflow.com/questions/36659612/how-does-node-js-fs-unlink-works
const fs = require('fs');
const resultHandler = function(err) {
  if (err) {
    console.log('unlink failed', err);
  } else {
    console.log('file deleted');
  }
};

module.exports.countAllUsers = function(callback) {
  connection.query('SELECT COUNT(*) as count FROM users', (err, count) => {
    if (err) callback(err);
    return callback(null, count[0].count);
  });
};

module.exports.countAllShelters = function(callback) {
  connection.query('SELECT COUNT(*) as count FROM shelters', (err, count) => {
    if (err) callback(err);
    return callback(null, count[0].count);
  });
};

/* viewing all accounts (users or shelters)*/
module.exports.viewAllUsers = function(page_number, callback) {
  var offset;
  var number = parseInt(page_number);
  if (number === 1) offset = 0;
  else offset = number * 15;

  connection.query('SELECT * FROM users', function(err, results) {
    if (err) return callback(err); // some error with query
    return callback(null, results); // if successful
  });
};

module.exports.viewAllShelters = function(page_number, callback) {
  var offset;
  var number = parseInt(page_number);
  if (number === 1) offset = 0;
  else offset = number * 15;

  connection.query('SELECT * FROM shelters', function(err, results) {
    if (err) return callback(err); // some error with query
    return callback(null, results); // if successful
  });
};

/* viewing account information of an account */
module.exports.viewUserInfo = function(Username, callback) {
  connection.query('SELECT * FROM users where Username = ?', Username, function(
    err,
    results
  ) {
    if (err) return callback(err); // some error with query
    return callback(null, results); // if successful
  });
};

module.exports.viewShelterInfo = function(Username, callback) {
  connection.query(
    'SELECT * FROM shelters where Username = ?',
    Username,
    function(err, results) {
      if (err) return callback(err); // some error with query
      return callback(null, results); // if successful
    }
  );
};

/* updating account infos */
module.exports.updateUserInfo = function(Username, changes, callback) {
  connection.query(
    'UPDATE users SET ? WHERE Username = ?',
    [changes, Username],
    function(err, results) {
      if (err) return callback(err); // some error with query
      return callback(null, changes); // if successful
    }
  );
};

module.exports.updateShelterInfo = function(Username, changes, callback) {
  connection.query(
    'UPDATE shelters SET ? WHERE Username = ?',
    [changes, Username],
    function(err, results) {
      if (err) return callback(err); // some error with query
      return callback(null, changes); // if successful
    }
  );
};

/* deleting account given the Username */
module.exports.deleteUserAccount = function(Username, callback) {
  //delete icon
  connection.query('SELECT * FROM users where Username = ?', Username, function(
    err,
    results
  ) {
    if (results[0].icon_url) fs.unlink(results[0].icon_url, resultHandler);
  });
  connection.query('DELETE FROM users WHERE Username = ?', Username, function(
    err,
    results
  ) {
    if (err) return callback(err); // some error with query
    console.log(results);
    return callback(null, results); // if successful
  });
};

module.exports.deleteShelterAccount = function(Username, callback) {
  //delete icon and proof
  connection.query(
    'SELECT * FROM shelters where Username = ?',
    Username,
    function(err, results) {
      if (results.affectedRows !== 0) {
        fs.unlink(results[0].icon_url, resultHandler);
        fs.unlink(results[0].file_path, resultHandler);
      }
    }
  );
  connection.query(
    'DELETE FROM shelters WHERE Username = ?',
    Username,
    function(err, results) {
      if (err) return callback(err); // some error with query
      console.log(results);
      return callback(null, results); // if successful
    }
  );
};
