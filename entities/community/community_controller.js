
const connection = require('./../../database/connection');
// contains all queries for community

/********* controllers for posts *************/
/*view a post with specified uuid*/
module.exports.viewPost=function(post_uuid,callback){
  connection.query('SELECT * FROM posts WHERE post_uuid = ? ',post_uuid,function(err, results){
    if (err) return callback(err);   // some error with query
    else return callback(null, results); // success
  });
}
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
    else return callback(null, results); // if successful
  });

}
//delete a single post given its uuid
module.exports.deletePost=function(post_uuid,user,callback){
  connection.query('DELETE FROM posts WHERE post_uuid = ? && Posted_by = ?', [post_uuid,user], function(err, results){
    if (err){
      console.log("there is an error");
      return callback(err);  // some error with query

    }else{
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

// vote a post
module.exports.votePost = function(post_uuid, callback){
  connection.query('UPDATE posts SET votes = votes+1 WHERE post_uuid = ?', post_uuid, function(err, results){
    if (err){
      console.log("there is an error");
      return callback(err);  // some error with query
    }else{
      console.log(results);
      return callback(null, results); // if successful
    }   
  });
}

/************ controllers for comments ******************/

//add a comment 
module.exports.addComment=function(newComment,callback){
  connection.query('INSERT INTO comments_on_posts SET ?', newComment, function(err, results){
    if (err) return callback(err);  // some error with query
    else return callback(null, results); // if successful
  });
}

//view a comment in the post
module.exports.viewComment=function(post_uuid,comment_uuid,callback){
  connection.query('SELECT * FROM comments_on_posts WHERE post_uuid = ? && comment_uuid = ?',[post_uuid,comment_uuid],function(err,results){
    if (err) return callback(err);   // some error with query
    else return callback(null, results); // success
  });
}

// vote a comment
module.exports.voteComment = function(post_uuid, comment_uuid, callback){
  connection.query('UPDATE comments_on_posts SET votes = votes+1 WHERE post_uuid = ? && comment_uuid = ?', [post_uuid,comment_uuid], function(err, results){
    if (err){
      console.log("there is an error");
      return callback(err);  // some error with query
    }else{
      console.log(results);
      return callback(null, results); // if successful
    }   
  });
}

//view all comments in a post

module.exports.viewAllComments=function(post_uuid,callback){
  connection.query('SELECT * FROM comments_on_posts WHERE post_uuid = ?',post_uuid,function(err,results){
    if (err) return callback(err);   // some error with query
    else return callback(null, results); // success
  });
}
//delete a comment in a post 

module.exports.deleteComment=function(post_uuid,comment_uuid,user,callback){
  connection.query('DELETE FROM comments_on_posts WHERE post_uuid =? && comment_uuid = ? && commented_by = ?',[post_uuid,comment_uuid,user],function(err,results){
    if (err) return callback(err);   // some error with query
    else return callback(null, results); // success
  });
}

//delete all comments in a post

module.exports.deleteAllComments=function(post_uuid,callback){
  connection.query('DELETE FROM comments_on_posts WHERE post_uuid = ? ',post_uuid,function(err,results){
      if (err) return callback(err);   // some error with query
      else return callback(null, results); // success
  });
}
