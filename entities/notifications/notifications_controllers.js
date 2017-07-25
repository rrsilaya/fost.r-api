const connection = require('./../../database/connection');
// contains all queries for notifications
/********* controllers for notifications *************/


//add a notification to table
module.exports.addNotif=function(newNotif,callback){
  connection.query('INSERT INTO notifications SET ?',newNotif,function(err,results){
    if(err) return callback(err);
    else return callback(null,results)
  });
}
//view all notifications for a specific user
module.exports.viewNotif=function(user,callback){
  connection.query('SELECT * FROM notifications WHERE notif_for = ? ORDER BY date_created DESC',user,function(err,results){
    if(err) return callback(err);
    else return callback(null,results);
  });
}
//get username for notif_for (community)
module.exports.getUser=function(query,uuid,callback){
  connection.query(query ,uuid,function(err, results){
    if (err) return callback(err);   // some error with query
    else return callback(null, results); // success
  });
}