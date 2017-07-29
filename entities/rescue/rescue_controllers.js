const connection = require('./../../database/connection');
const fs = require('fs');
const resultHandler = function(err) {
  if (err) {
    console.log('unlink failed', err);
  } else {
    console.log('file deleted');
  }
};
/*all queries for rescue is here */

/* get user details */
module.exports.getUser = function(Username, callback) {
  connection.query('SELECT * FROM users WHERE Username = ?', Username, function(
    err,
    user
  ) {
    if (err)
      return callback(err); // some error with query
    else return callback(null, user); // success
  });
};
/* add a request for rescue to db*/
module.exports.addRescue = function(newRescue, callback) {
  connection.query('INSERT INTO rescue SET ? ', newRescue, function(
    err,
    results
  ) {
    if (err)
      return callback(err); // some error with query
    else return callback(null, results); // success
  });
};

/* view all requests sorted from newest to oldest*/
module.exports.viewAllRequests = function(callback) {
  connection.query('SELECT * FROM rescue ORDER BY updated_on DESC', function(
    err,
    results
  ) {
    if (err)
      return callback(err); // some error with query
    else return callback(null, results); // success
  });
};
/*view a request given its rescue_uuid*/
module.exports.viewRequest = function(rescue_uuid, callback) {
  connection.query(
    'SELECT * FROM rescue WHERE rescue_uuid = ?',
    rescue_uuid,
    function(err, results) {
      if (err)
        return callback(err); // some error with query
      else return callback(null, results); // success
    }
  );
};
/*view a request given its rescue_uuid*/
module.exports.viewMyRequest = function(rescue_uuid, Username, callback) {
  connection.query(
    'SELECT * FROM rescue WHERE rescue_uuid = ? && sender_Username = ? ',
    [rescue_uuid, Username],
    function(err, results) {
      if (err)
        return callback(err); // some error with query
      else return callback(null, results); // success
    }
  );
};

/* delete a request given that the request is posted by the user and its rescue_uuid is specified*/
module.exports.deleteRequest = function(
  rescue_uuid,
  sender_Username,
  callback
) {
  //delete the file
  connection.query(
    'SELECT * FROM rescue WHERE rescue_uuid = ? && sender_Username = ? ',
    [rescue_uuid, sender_Username],
    function(err, results) {
      if (results[0].rescue_imgurl)
        fs.unlink(results[0].rescue_imgurl, resultHandler);
    }
  );
  //delete request
  connection.query(
    'DELETE FROM rescue WHERE rescue_uuid = ? && sender_Username = ?',
    [rescue_uuid, sender_Username],
    function(err, results) {
      if (err)
        return callback(err); // some error with query
      else return callback(null, results); // success
    }
  );
};

/*update a request given that the request is posted by the user and its rescue_uuid is specified*/
module.exports.updateRequest = function(
  rescue_uuid,
  Username,
  update,
  callback
) {
  connection.query(
    'UPDATE rescue SET rescue_body = ? ,rescue_imgurl = ? WHERE rescue_uuid = ? && sender_Username = ?',
    [update.rescue_body, update.rescue_imgurl, rescue_uuid, Username],
    function(err, results) {
      if (err)
        return callback(err); // some error with query
      else return callback(null, results); // success
    }
  );
};

/*see all request a user has submitted*/
module.exports.viewUserRequests = function(Username, callback) {
  connection.query(
    'SELECT * FROM rescue WHERE sender_Username = ?',
    Username,
    function(err, results) {
      if (err)
        return callback(err); // some error with query
      else return callback(null, results); // success
    }
  );
};
/*delete all my request*/
module.exports.deleteAllMyRequests = function(Username, callback) {
  connection.query(
    'DELETE FROM rescue WHERE sender_Username = ?',
    Username,
    function(err, results) {
      if (err)
        return callback(err); // some error with query
      else return callback(null, results); // success
    }
  );
};
