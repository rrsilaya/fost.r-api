
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
module.exports.voteToPost = function(post_uuid, callback){
  var today = new Date(); // updated_at which could be useful for notifications later on 
  connection.query('UPDATE posts SET votes = votes+1 WHERE post_uuid = ?', post_uuid, (err, results)=>{
    if (err){
      console.log('voteToPost error');
      return callback(err);  // some error with query
    }else{
      connection.query('UPDATE posts SET updated_at = ? WHERE post_uuid =?', [today, post_uuid], (err, results)=>{
        if (err){
          console.log('error upon updating updated_at');
          return callback(err);
        }else{ 
          console.log('updated updated_at');
          callback(null, results);} // if successful
      });
    }   
  });
}

//unvote a post
module.exports.unvoteToPost = function(post_uuid, callback){
  var today = new Date();
  connection.query('UPDATE posts SET votes = votes-1 WHERE post_uuid = ?', post_uuid, function(err, results){
    if (err){
      console.log('unvoteToPost err');
      callback(err);
    }else callback(null, results); //returns mysql query; if successful
  });
}

/***** controllers for votes_for_posts **********/
module.exports.showAllVotesPost = function(post_uuid, callback){
  connection.query('SELECT * FROM votes_for_posts WHERE post_uuid = ?', post_uuid, function(err, results){
    if (err) callback(err);
    else{
      console.log('showing votes for ' + post_uuid);
      callback(null, results);
    }
  });
}

//check if voted already
module.exports.checkIfVotedPost = function(User, post_uuid, callback){
  connection.query('SELECT * FROM votes_for_posts WHERE post_uuid = ? && voted_by = ?', [post_uuid, User], function(err, results){
  if (err) callback(err);
  else if (results.length > 0){
    console.log(User + ' has already voted ' + post_uuid);
    callback(null, results);
  }else{
    console.log(User + ' has not yet voted ' + post_uuid);
    callback(null, null);
  }
  });
}

module.exports.votePost = function(vote, callback){
  connection.query('INSERT INTO votes_for_posts SET ?', vote, function(err,results){
    if (err){ 
      console.log('votePost err!');
      callback(err);
    }callback(null, results) // mysql query
  });
}

module.exports.unvotePost = function(vote, callback){
  connection.query('DELETE FROM votes_for_posts WHERE voted_by = ? && post_uuid = ?', [vote.voted_by, vote.post_uuid], function(err, results){
    if (err){
      console.log('unvotePost err');
      callback(err);
    }callback(null, results);
  });
}
/************ controllers for comments ******************/

//add a comment 
module.exports.addComment=function(newComment,callback){
  var today = new Date(); // updated_at which could be useful for notifications later on
  var update = {
    "updated_at":today
  }
  var post_uuid = newComment.post_uuid;
  connection.query('INSERT INTO comments_on_posts SET ?', newComment, function(err, results){
    if (err) return callback(err);  // some error with query
    else {
      connection.query('SELECT * FROM posts WHERE post_uuid = ? ', post_uuid,function(err, results){
        console.log('searching the post to update updated_at');
        if (err){
          console.log('some error on updating');
          return callback(err);
        }
        if (results){
          if (results.Posted_by !== newComment.commented_by){
            connection.query('UPDATE posts set ? WHERE post_uuid = ?', [update, post_uuid], function(err, results){
              console.log('updating the post\'s updated_at');
              if (err){
                console.log('some error on updating 2');
                return callback(err);
              }console.log(results);
            });
          }
        }
      });
      return callback(null, results); // if successful
    }
  });
}

//view a comment in the post
module.exports.viewComment=function(post_uuid,comment_uuid,callback){
  connection.query('SELECT * FROM comments_on_posts WHERE post_uuid = ? && comment_uuid = ?',[post_uuid,comment_uuid],function(err,results){
    if (err) return callback(err);   // some error with query
    else return callback(null, results); // success
  });
}

/***** controllers for votes_for_posts **********/
module.exports.showAllVotesComment = function(comment_uuid, callback){
  connection.query('SELECT * FROM votes_for_comments WHERE post_uuid = ?', comment_uuid, function(err, results){
    if (err) callback(err);
    else{
      console.log('showing votes for ' + comment_uuid);
      callback(null, results);
    }
  });
}

//check if voted already
module.exports.checkIfVotedComment = function(User, comment_uuid, callback){
  connection.query('SELECT * FROM votes_for_comments WHERE comment_uuid = ? && voted_by = ?', [post_uuid, User], function(err, results){
  if (err) callback(err);
  else if (results.length > 0){
    console.log(User + ' has already voted ' + comment_uuid);
    callback(null, results);
  }else{
    console.log(User + ' has not yet voted ' + comment_uuid);
    callback(null, null);
  }
  });
}

// vote a comment
module.exports.voteComment = function(post_uuid, comment_uuid, callback){
  var today = new Date(); // updated_at which could be useful for notifications later on
  connection.query('UPDATE comments_on_posts SET votes = votes+1 WHERE post_uuid = ? && comment_uuid = ?', [post_uuid, comment_uuid], (err, results)=>{
    if (err){
      console.log("there is an error");
      return callback(err);  // some error with query
    }else{
      connection.query('UPDATE comments_on_posts SET updated_at = ? WHERE post_uuid = ? && comment_uuid = ?', [today, post_uuid, comment_uuid], (err, results)=>{
        if (err){
          console.log('error updating updated_at');
          callback(err);
        }else callback(null, results); // if successful
      });
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
