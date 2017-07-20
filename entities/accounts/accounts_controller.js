const connection = require('./../../database/connection');

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