const connection = require('./../../database/connection');
//https://stackoverflow.com/questions/36659612/how-does-node-js-fs-unlink-works

const fs = require('fs');
const resultHandler = function(err) {
  if (err) {
    console.log('unlink failed', err);
  } else {
    console.log('file deleted');
  }
};

// contains all queries for community

/********* controllers for posts *************/
/*view a post with specified uuid*/
module.exports.viewPost = function(post_uuid, callback) {
  connection.query(
    'SELECT * FROM posts WHERE post_uuid = ? ',
    post_uuid,
    function(err, results) {
      if (err) return callback(err);
      else {
        // some error with query
        console.log('showing post: ' + post_uuid);
        console.log(results);
        return callback(null, results); // success
      }
    }
  );
};

/* view posts of a specific user*/
module.exports.viewPostsOf = function(user, callback) {
  connection.query(
    'SELECT * FROM posts WHERE Posted_by = ? ORDER BY created_at DESC',
    user,
    function(err, results) {
      if (err) return callback(err); // some error with query
      return callback(null, results); // success
    }
  );
};

module.exports.countAllPosts = function(callback) {
  connection.query('SELECT COUNT(*) as count FROM posts', (err, count) => {
    if (err) callback(err);
    callback(null, count[0].count); // this will return an integer of the count of all the posts
  });
};

// newest to oldest
module.exports.sortByTimeDesc = function(page_number, callback) {
  var number = parseInt(page_number);
  var offset = (number-1 )* 10;
  connection.query(
    'SELECT * FROM posts ORDER BY created_at DESC LIMIT 10 OFFSET ?',
    offset,
    function(err, results) {
      if (err) return callback(err); // some error with query
      return callback(null, results); // success; has results on that page
    }
  );
};

// oldest to newest
module.exports.sortByTimeAsc = function(page_number, callback) {
  var number = parseInt(page_number);
  var offset = (number-1 )* 10;
  connection.query(
    'SELECT * FROM posts ORDER BY created_at LIMIT 10 OFFSET ?',
    offset,
    function(err, results) {
      if (err) return callback(err); // some error with query\
      return callback(null, results); // success; has results on that page
    }
  );
};

// most to least commented
module.exports.sortByCommentsDesc = function(page_number, callback) {
  var number = parseInt(page_number);
  var offset = (number-1 )* 10;
  connection.query(
    'SELECT * FROM posts ORDER BY comments DESC LIMIT 10 OFFSET ?',
    offset,
    function(err, results) {
      if (err) return callback(err); // some error with query
      return callback(null, results); // success; has results on that page
    }
  );
};

// least to most commented
module.exports.sortByCommentsAsc = function(page_number, callback) {
  var number = parseInt(page_number);
  var offset = (number-1 )* 10;
  connection.query(
    'SELECT * FROM posts ORDER BY comments LIMIT 10 OFFSET ?',
    offset,
    function(err, results) {
      if (err) return callback(err); // some error with query
      return callback(null, results); // success; has results on that page
    }
  );
};

// most to least voted
module.exports.sortByVotesDesc = function(page_number, callback) {
  var number = parseInt(page_number);
  var offset = (number-1 )* 10;
  connection.query(
    'SELECT * FROM posts ORDER BY votes DESC LIMIT 10 OFFSET ?',
    offset,
    function(err, results) {
      if (err) return callback(err); // some error with query
      return callback(null, results); // success; has results on that page
    }
  );
};

// least to most voted
module.exports.sortByVotesAsc = function(page_number, callback) {
  var number = parseInt(page_number);
  var offset = (number-1 )* 10;
  connection.query(
    'SELECT * FROM posts ORDER BY votes LIMIT 10 OFFSET ?',
    offset,
    function(err, results) {
      if (err) return callback(err); // some error with query
      return callback(null, results); // success; has results on that page
    }
  );
};

//delete a single post given its uuid
module.exports.deletePost = function(post_uuid, user, callback) {
  //delete image attached to post
  connection.query(
    'SELECT * FROM posts WHERE post_uuid = ? ',
    post_uuid,
    function(err, results) {
      if (
        results.affectedRows !== 0 &&
        typeof results[0].img_abspath !== 'undefined'
      ) {
        fs.unlink(
          JSON.parse(JSON.stringify(results[0].img_abspath)),
          resultHandler
        );
        connection.query(
          'DELETE FROM posts WHERE post_uuid = ? && Posted_by = ?',
          [post_uuid, user],
          function(err, results) {
            if (err) {
              console.log('there is an error');
              return callback(err); // some error with query
            } else {
              //console.log(results);
              return callback(null, results); // if successful
            }
          }
        );
      }
    }
  );
};

//add posts to 'post' table in 'fostr' db
module.exports.addPost = function(newPost, callback) {
  connection.query('INSERT INTO posts SET ?', newPost, function(err, results) {
    if (err) return callback(err); // some error with query
    return callback(null, results); // if successful
  });
};

// vote a post
module.exports.voteToPost = function(User, post_uuid, callback) {
  var today = new Date(); // updated_at which could be useful for notifications later on
  var vote = {
    voted_by: User,
    post_uuid: post_uuid
  };
  connection.query(
    'UPDATE posts SET votes = votes+1 WHERE post_uuid = ?',
    post_uuid,
    (err, results) => {
      if (err) {
        console.log('voteToPost error');
        return callback(err); // some error with query
      } else {
        connection.query(
          'UPDATE posts SET updated_at = ? WHERE post_uuid =?',
          [today, post_uuid],
          (err, results) => {
            if (err) {
              console.log('error upon updating updated_at');
              return callback(err);
            } else {
              console.log('updated updated_at');
              console.log('inserting INTO votes table');
              connection.query(
                'INSERT INTO votes_for_posts SET ?',
                vote,
                function(err, results) {
                  if (err) {
                    console.log('votePost err!');
                    callback(err);
                  }
                  callback(null, results); // mysql query; successful
                }
              );
            }
          }
        );
      }
    }
  );
};

//unvote a post
module.exports.unvoteToPost = function(User, post_uuid, callback) {
  var today = new Date();
  connection.query(
    'UPDATE posts SET votes = votes-1 WHERE post_uuid = ?',
    post_uuid,
    function(err, results) {
      if (err) {
        console.log('unvoteToPost err');
        callback(err);
      } else {
        connection.query(
          'DELETE FROM votes_for_posts WHERE voted_by = ? && post_uuid = ?',
          [User, post_uuid],
          function(err, results) {
            if (err) {
              console.log('unvotePost err');
              callback(err);
            }
            callback(null, results); // mysql query; successful
          }
        );
      }
    }
  );
};

/***** controllers for votes_for_posts **********/
module.exports.showAllVotesPost = function(post_uuid, callback) {
  connection.query(
    'SELECT * FROM votes_for_posts WHERE post_uuid = ?',
    post_uuid,
    function(err, results) {
      if (err) callback(err);
      else {
        console.log('showing votes for ' + post_uuid);
        console.log(results[0]);
        callback(null, results);
      }
    }
  );
};

//check if voted already
module.exports.checkIfVotedPost = function(User, post_uuid, callback) {
  connection.query(
    'SELECT * FROM votes_for_posts WHERE post_uuid = ? && voted_by = ?',
    [post_uuid, User],
    function(err, results) {
      if (err) callback(err);
      else if (results.length > 0) {
        console.log(User + ' has already voted ' + post_uuid);
        callback(null, results);
      } else {
        console.log(User + ' has not yet voted ' + post_uuid);
        callback(null, null);
      }
    }
  );
};

/************ controllers for comments ******************/

//add a comment
module.exports.addComment = function(newComment, callback) {
  var today = new Date(); // updated_at which could be useful for notifications later on
  var update = {
    updated_at: today
  };
  var post_uuid = newComment.post_uuid;
  connection.query('INSERT INTO comments_on_posts SET ?', newComment, function(
    err,
    results
  ) {
    if (err) return callback(err);
    else {
      // some error with query
      connection.query(
        'SELECT * FROM posts WHERE post_uuid = ? ',
        post_uuid,
        function(err, results) {
          if (err) {
            console.log('some error on updating');
            return callback(err);
          }
          if (results) {
            if (results.Posted_by !== newComment.commented_by) {
              connection.query(
                'UPDATE posts SET ? WHERE post_uuid = ?',
                [update, post_uuid],
                function(err, results) {
                  if (err) {
                    console.log('some error on updating 2');
                    return callback(err);
                  }
                  console.log(results);
                  connection.query(
                    'UPDATE posts SET comments = comments+1 WHERE post_uuid = ?',
                    post_uuid,
                    (err, results) => {
                      if (err) {
                        console.log('some error updating comments counter');
                        return callback(err);
                      }
                      console.log('updated comments counter of ' + post_uuid);
                    }
                  );
                }
              );
            }
          }
        }
      );
      return callback(null, results); // if successful
    }
  });
};

//view a comment in the post
module.exports.viewComment = function(post_uuid, comment_uuid, callback) {
  connection.query(
    'SELECT * FROM comments_on_posts WHERE post_uuid = ? && comment_uuid = ?',
    [post_uuid, comment_uuid],
    function(err, results) {
      if (err)
        callback(err); // some error with query
      else callback(null, results); // success
    }
  );
};

// vote a comment
module.exports.voteComment = function(post_uuid, comment_uuid, callback) {
  var today = new Date(); // updated_at which could be useful for notifications later on
  connection.query(
    'UPDATE comments_on_posts SET votes = votes+1 WHERE post_uuid = ? && comment_uuid = ?',
    [post_uuid, comment_uuid],
    (err, results) => {
      if (err) {
        console.log('there is an error');
        return callback(err); // some error with query
      } else {
        connection.query(
          'UPDATE comments_on_posts SET updated_at = ? WHERE post_uuid = ? && comment_uuid = ?',
          [today, post_uuid, comment_uuid],
          (err, results) => {
            if (err) {
              console.log('error updating updated_at');
              callback(err);
            } else callback(null, results); // if successful
          }
        );
      }
    }
  );
};

/***** controllers for votes_for_posts **********/
module.exports.showAllVotesComment = function(comment_uuid, callback) {
  console.log('comment_uuid = ' + comment_uuid);
  connection.query(
    'SELECT * FROM votes_for_comments WHERE comment_uuid = ?',
    comment_uuid,
    function(err, results) {
      if (err) callback(err);
      else {
        console.log('showing votes for ' + comment_uuid);
        callback(null, results);
      }
    }
  );
};

//check if voted already
module.exports.checkIfVotedComment = function(User, comment_uuid, callback) {
  connection.query(
    'SELECT * FROM votes_for_comments WHERE comment_uuid = ? && voted_by = ?',
    [post_uuid, User],
    function(err, results) {
      if (err) callback(err);
      else if (results.length > 0) {
        console.log(User + ' has already voted ' + comment_uuid);
        callback(null, results);
      } else {
        console.log(User + ' has not yet voted ' + comment_uuid);
        callback(null, null);
      }
    }
  );
};

module.exports.votePost = function(vote, callback) {
  connection.query('INSERT INTO votes_for_posts SET ?', vote, function(
    err,
    results
  ) {
    if (err) {
      console.log('votePost err!');
      callback(err);
    }
    callback(null, results); // mysql query
  });
};

module.exports.unvotePost = function(vote, callback) {
  connection.query(
    'DELETE FROM votes_for_posts WHERE voted_by = ? && post_uuid = ?',
    [vote.voted_by, vote.post_uuid],
    function(err, results) {
      if (err) {
        console.log('unvotePost err');
        callback(err);
      }
      callback(null, results);
    }
  );
};

// count all comments in a post
module.exports.countAllComments = function(post_uuid, callback) {
  connection.query(
    'SELECT COUNT(*) as count FROM comments_on_posts',
    (err, count) => {
      if (err) callback(err);
      return callback(null, count[0].count); // this will return an integer of the count of all the comments in post_uuid
    }
  );
};

//view all comments in a post
module.exports.viewAllComments = function(page_number, post_uuid, callback) {
  var number = parseInt(page_number);
  var offset = (number-1 )* 10;
  connection.query(
    'SELECT * FROM comments_on_posts WHERE post_uuid = ? ORDER BY votes LIMIT 10 OFFSET ?',
    [post_uuid, offset],
    function(err, results) {
      if (err) return callback(err); // some error with query
      return callback(null, results); // success
    }
  );
};

//delete a comment in a post
module.exports.deleteComment = function(
  post_uuid,
  comment_uuid,
  user,
  callback
) {
  //delete image attached to a comment
  connection.query(
    'SELECT * FROM comments_on_posts WHERE post_uuid = ? && comment_uuid = ?',
    [post_uuid, comment_uuid],
    function(err, results) {
      if (
        results.affectedRows !== 0 &&
        typeof results[0].img_abspath !== undefined
      ) {
        fs.unlink(
          JSON.parse(JSON.stringify(results[0].img_abspath)),
          resultHandler
        );
      }
    }
  );
  connection.query(
    'DELETE FROM comments_on_posts WHERE post_uuid =? && comment_uuid = ? && commented_by = ?',
    [post_uuid, comment_uuid, user],
    function(err, results) {
      if (err) return callback(err);
      else {
        // some error with query
        connection.query(
          'UPDATE posts SET comments = comments-1 WHERE post_uuid = ?',
          post_uuid,
          (err, results) => {
            if (err) {
              console.log('error comments-- on ' + post_uuid);
              callback(err);
            }
            console.log('subtracted');
          }
        );
        callback(null, results); // success
      }
    }
  );
};

