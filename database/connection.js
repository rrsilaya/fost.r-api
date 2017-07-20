var mysql = require('mysql');
var db = require('./db');

var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : 'user',
    database : 'fostr'
});

connection.connect(function(err){
  if(!err) {
    console.log("Database is connected");
  } else {
    console.log("Error while connecting with database");
  }
});

module.exports = connection;