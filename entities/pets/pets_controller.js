const connection = require('./../../database/connection');

// queries for pets are all here

module.exports.viewShelterPets = function(callback){
	connection.query('SELECT * FROM pets_of_shelters', function(err, results){
		if (err) return calbacK(err); 	// some error with query
		return callback(null, results); // if successful
	});
}

module.exports.viewShelterPetsOf = function(shelter_Username, callback){
	connection.query('SELECT * FROM pets_of_shelters WHERE shelter_Username = ?', shelter_Username, function(err, results){
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

module.exports.viewUserPetsOf = function(user_Username, callback){
	connection.query('SELECT * FROM pets_of_users WHERE user_Username = ?', user_Username, function(err, results){
		if (err) return calbacK(err); 	// some error with query
		return callback(null, results); // if successful
	});
}

module.exports.addShelterPet = function(petInfo, callback){
	connection.query('INSERT INTO pets_of_shelters SET ?', petInfo, function(err, results){
		if (err) return callback(err);	// some error with query
		return callback(null, results);	// if successful
	});
}

module.exports.addUserPet = function(petInfo, callback){
	connection.query('INSERT INTO pets_of_users SET ?', petInfo, function(err, results){
		if (err) return callback(err);	// some error with query
		return callback(null, results);	// if successful
	});
}