const connection = require('./../../database/connection');
const bcrypt = require('bcryptjs'); // for the password; ideally only the password's length should be passed

/* viewing account information of an account */
module.exports.viewUserInfo = function(Username, callback){
	connection.query('SELECT * FROM users where Username = ?', Username, function(err, results){
		if (err) return callback(err);	// some error with query
		return callback(null, results); // if successful
	});
}

module.exports.viewShelterInfo = function(Username, callback){
	connection.query('SELECT * FROM shelters where Username = ?', Username, function(err, results){
		if (err) return callback(err); 	// some error with query
		return callback(null, results); // if successful
	});
}

/* updating account infos */
module.exports.updateUserInfo = function(Username, changes, callback){
	connection.query('UPDATE users SET ? WHERE Username = ?', [changes, Username], function(err, results){
		if (err) return callback(err);	// some error with query
		return callback(null, changes);	// if successful
	});
}

module.exports.updateShelterInfo = function(Username, changes, callback){
	connection.query('UPDATE shelters SET ? WHERE Username = ?', [changes, Username], function(err, results){
		if (err) return callback(err);	// some error with query
		return callback(null, changes);	// if successful
	});
}

/* deleting account given the Username */
module.exports.deleteUserAccount = function(Username, callback){
	connection.query('DELETE FROM users WHERE Username = ?', Username, function(err, results){
		if (err) return callback(err);	// some error with query
		console.log(results);
		return callback(null, results);	// if successful
	});
}

module.exports.deleteShelterAccount = function(Username, callback){
	connection.query('DELETE FROM shelters WHERE Username = ?', Username, function(err, results){
		if (err) return callback(err);	// some error with query
		console.log(results);
		return callback(null, results);	// if successful
	});
}