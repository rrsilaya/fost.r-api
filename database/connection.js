var mysql = require('mysql');
var db = require('./db');

var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : 'gnwZd#)*J72x',
    database : 'db_fostr'
});

connection.connect(function(err){
  if(!err) {
    console.log("Database is connected");
  } else {
    console.log("Error while connecting with database");
  }
});

module.exports = connection;