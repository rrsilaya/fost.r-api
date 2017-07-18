const connection = require('./../../database/connection');
// contains all queries for community



//add posts to 'post' table in 'fostr' db
module.exports.addPost=function(newPost,callback){
  connection.query('INSERT INTO posts SET ?', newPost, function(err, results){
    if (err) return callback(err);  // some error with query
    return callback(null, results); // if successful
  });
}
//view all posts; will serve like the feed for the community page
module.exports.viewAllPosts=function(callback){
  connection.query('SELECT * FROM posts ORDER BY created_at DESC', function(err, results){
    if (err) return callback(err);   // some error with query
    return callback(null, results); // success
  });
}
