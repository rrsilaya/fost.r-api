const connection = require('./../../database/connection');
const fs=require('fs');
const path =require('path');
// contains all queries for community




/* view posts of a specific user*/
module.exports.viewPostsOf=function(user,callback){
  connection.query('SELECT * FROM posts WHERE Posted_by = ? ORDER BY created_at DESC',user,function(err, results){
    if (err) return callback(err);   // some error with query
    return callback(null, results); // success
  });
}

//view all posts; will serve like the feed for the community page
module.exports.viewAllPosts=function(callback){
  connection.query('SELECT * FROM posts ORDER BY created_at DESC', function(err, results){
    if (err) return callback(err);   // some error with query
    return callback(null, results); // success
  });
}
//deletes all posts of current user logged in 
module.exports.deleteAllPosts=function(user,callback){
  connection.query('DELETE FROM posts WHERE Posted_by = ?', user, function(err, results){
    if (err) return callback(err);  // some error with query
    console.log(results);
    return callback(null, results); // if successful
  });

}
module.exports.deletePost=function(post_uuid,callback){
  connection.query('DELETE FROM posts WHERE post_uuid = ?', post_uuid, function(err, results){
    if (err) return callback(err);  // some error with query
    else{
      console.log(results);
      return callback(null, results); // if successful
    }
    
  });
}

//add posts to 'post' table in 'fostr' db
module.exports.addPost=function(newPost,callback){
  connection.query('INSERT INTO posts SET ?', newPost, function(err, results){
    if (err) return callback(err);  // some error with query
    return callback(null, results); // if successful
  });
}


