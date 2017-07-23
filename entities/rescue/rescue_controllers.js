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
    else return callback(null, results); // success
  });
}
/*view a request given its rescue_uuid*/
module.exports.viewRequest=function(rescue_uuid,callback){
  connection.query('SELECT * FROM rescue WHERE rescue_uuid = ?',rescue_uuid,function(err,results){
    if (err) return callback(err);   // some error with query
    else return callback(null, results); // success
  });
}

/* delete a request given that the request is posted by the user and its rescue_uuid is specified*/
module.exports.deleteRequest=function(rescue_uuid,sender_Username,callback){
  connection.query('DELETE FROM rescue WHERE rescue_uuid = ? && sender_Username = ?',[rescue_uuid,sender_Username],function(err,results){
    if (err) return callback(err);   // some error with query
    else return callback(null, results); // success
  });
}

/*update a request given that the request is posted by the user and its rescue_uuid is specified*/
module.exports.updateRequest=function(rescue_uuid,Username,update,callback){
  connection.query('UPDATE rescue SET rescue_body = ? ,rescue_imgurl = ? WHERE rescue_uuid = ? && sender_Username = ?',[update.rescue_body,update.rescue_imgurl,rescue_uuid,Username],function(err,results){
    if (err) return callback(err);   // some error with query
    else return callback(null, results); // success
  });
}

/*see all request a user has submitted*/
module.exports.viewUserRequests=function(Username,callback){
  connection.query('SELECT * FROM rescue WHERE sender_Username = ?',Username,function(err,results){
    if (err) return callback(err);   // some error with query
    else return callback(null, results); // success
  });
}
/*delete all my request*/
module.exports.deleteAllMyRequests=function(Username,callback){
 connection.query('DELETE FROM rescue WHERE sender_Username = ?',Username,function(err,results){
    if (err) return callback(err);   // some error with query
    else return callback(null, results); // success
  });
}
/*add comment on a request given its rescue_uuid*/

/*delete my comment */

