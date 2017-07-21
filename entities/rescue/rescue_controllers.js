const connection = require('./../../database/connection');

/*all queries for rescue is here */

/* get user details */
module.exports.getUser=function(Username,callback){
  connection.query('SELECT * FROM users WHERE Username = ?',Username,function(err,user){
    if (err) return callback(err);   // some error with query
    else return callback(null, user); // success
  });
}
/* add a request for rescue to db*/
module.exports.addRescue=function(newRescue,callback){
  connection.query('INSERT INTO rescue SET ? ',newRescue,function(err,results){
    if (err) return callback(err);   // some error with query
    else return callback(null, results); // success
  });
}
/* view all requests sorted from newest to oldest*/
module.exports.viewAllRequests=function(callback){
  connection.query('SELECT * FROM rescue ORDER BY updated_on DESC',function(err,results){
    if (err) return callback(err);   // some error with query
    return callback(null, results); // success
  })
}