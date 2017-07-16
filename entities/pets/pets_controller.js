const connection = require('./../../database/connection');
const uuid = require('shortid');
uuid.characters('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ$@');	
// default has "-"" and "_" ; this sets the characters to only the entered characters (https://www.npmjs.com/package/shortid)  

/* queries for pets are all here */

/* view all pets */
module.exports.viewShelterPets = function(callback){
	connection.query('SELECT * FROM pets_of_shelters', function(err, results){
		if (err) return calbacK(err); 	// some error with query
		return callback(null, results); // if successful
	});
}

module.exports.viewUserPets = function(callback){
	connection.query('SELECT * FROM pets_of_users', function(err, results){
		if (err) return calbacK(err);	// some error with query
		return callback(null, results); // if successful
	});
}

/* view pet of specific user/shelter */
module.exports.viewShelterPetsOf = function(shelter_Username, callback){
	connection.query('SELECT * FROM pets_of_shelters WHERE shelter_Username = ?', shelter_Username, function(err, results){
		if (err) return calbacK(err); 	// some error with query
		return callback(null, results); // if successful
	});
}

module.exports.viewUserPetsOf = function(user_Username, callback){
	connection.query('SELECT * FROM pets_of_users WHERE user_Username = ?', user_Username, function(err, results){
		if (err) return calbacK(err); 	// some error with query
		return callback(null, results); // if successful
	});
}

/* adding a pet */
module.exports.addShelterPet = function(petInfo, callback){
	petInfo.uuid = uuid.generate();
	console.log(petInfo);
	connection.query('INSERT INTO pets_of_shelters SET ?', petInfo, function(err, results){
		if (err) return callback(err);	// some error with query
		return callback(null, results);	// if successful
	});
}

module.exports.addUserPet = function(petInfo, callback){
	petInfo.uuid = uuid.generate();
	console.log(petInfo);
	connection.query('INSERT INTO pets_of_users SET ?', petInfo, function(err, results){
		if (err) return callback(err);	// some error with query
		return callback(null, results);	// if successful
	});
}

/* updating pet infos */
module.exports.updateUserPet = function(uuid, changes, callback){
	connection.query('UPDATE pets_of_users SET ? WHERE uuid = ?', [changes, uuid], function(err, results){
		if (err) return callback(err);	// some error with query
		return callback(null, changes);	// if successful
	});
}

module.exports.updateShelterPet = function(uuid, changes, callback){
	connection.query('INSERT INTO pets_of_shelters SET ? WHERE uuid = ?', [changes, uuid], function(err, results){
		if (err) return callback(err);	// some error with query
		return callback(null, changes);	// if successful
	});
}
