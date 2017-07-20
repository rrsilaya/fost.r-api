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