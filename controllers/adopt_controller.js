var connection = require('./../database/connection');

module.exports.searchPet = function(petInfo, callback){
	// petInfo holds a json of a pet
	// type breed sex age 
	var type = petInfo.petType, 
		sex = petInfo.sex,
		age = petInfo.age;
	connection.query('SELECT * FROM pets_of_shelters where kind = ? AND sex = ?', [type, sex], function(err, results, fields){
	// results hold the results
	if (err){
		console.log('some error with query');
		throw err;
		callback(null, "QUERY_ERR"); // error with query
	}

	if (results.length == 0){
		console.log('found none');
		callback(null, "NO_RESULTS");
	}else{
		console.log(results);
		callback(null, results);
	}
});
}

module.exports.addPet = function(petInfo, callback){
	// petInfo holds a json of a pet
	// type breed sex age

	connection.query('INSERT INTO pets_of_shelters SET ?', [petInfo], function(err, results, fields){
	// results hold the results
	if (err){
		console.log('some error with query');
		throw err;
		callback(null, "QUERY_ERR"); // error with query
	}
	console.log('Succesfully added pet for adoption.');
	callback(null, true);
});
}