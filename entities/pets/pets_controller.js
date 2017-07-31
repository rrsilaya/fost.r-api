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

/* queries for pets are all here */

module.exports.countAllSheltersPets = function(callback) {
  connection.query(
    'SELECT COUNT(*) as count FROM pets_of_shelters',
    (err, count) => {
      if (err) callback(err);
      callback(null, count[0].count); // this will return an integer of the count of all the posts
    }
  );
};

module.exports.countAllUsersPets = function(callback) {
  connection.query(
    'SELECT COUNT(*) as count FROM pets_of_users',
    (err, count) => {
      if (err) callback(err);
      callback(null, count[0].count); // this will return an integer of the count of all the posts
    }
  );
};

/* view all pets */
module.exports.viewAllShelterPets = function(page_number, callback) {
  var offset;
  var number = parseInt(page_number);
  if (number === 1) offset = 0;
  else offset = number * 25;
  connection.query(
    'SELECT * FROM pets_of_shelters LIMIT 25 OFFSET ?',
    offset,
    function(err, results) {
      if (err) return callback(err); // some error with query
      return callback(null, results); // if successful
    }
  );
};

module.exports.viewAllPetsForDates = function(callback) {
  var status = 'DATES';
  connection.query(
    'SELECT * FROM pets_of_shelters WHERE status = ?',
    status,
    function(err, results) {
      if (err) return callback(err); // some error with query
      return callback(null, results); // if successful
    }
  );
};

module.exports.viewAllPetsForAdopt = function(callback) {
  var status = 'ADOPT';
  connection.query(
    'SELECT * FROM pets_of_shelters WHERE status = ?',
    status,
    function(err, results) {
      if (err) return callback(err); // some error with query
      return callback(null, results); // if successful
    }
  );
};

module.exports.viewAllPetsForBoth = function(callback) {
  var status = 'BOTH';
  connection.query(
    'SELECT * FROM pets_of_shelters WHERE status = ?',
    status,
    function(err, results) {
      if (err) return callback(err); // some error with query
      return callback(null, results); // if successful
    }
  );
};

module.exports.viewAllUserPets = function(page_number, callback) {
  var offset;
  var number = parseInt(page_number);
  if (number === 1) offset = 0;
  else offset = number * 25;
  connection.query(
    'SELECT * FROM pets_of_users LIMIT 25 OFFSET ?',
    offset,
    function(err, results) {
      if (err) return callback(err); // some error with query
      return callback(null, results); // if successful
    }
  );
};

/* view pets of specific user/shelter */
module.exports.viewShelterPetsOf = function(shelter_Username, callback) {
  connection.query(
    'SELECT * FROM pets_of_shelters WHERE shelter_Username = ?',
    shelter_Username,
    function(err, results) {
      if (err) return callback(err); // some error with query
      return callback(null, results); // if successful
    }
  );
};

module.exports.viewShelterPetsForDates = function(shelter_Username, callback) {
  connection.query(
    'SELECT * FROM pets_of_shelters WHERE  status = "DATES" && shelter_Username = ?',
    shelter_Username,
    function(err, results) {
      if (err) return callback(err); // some error with query
      return callback(null, results); // if successful
    }
  );
};

module.exports.viewShelterPetsForAdopt = function(shelter_Username, callback) {
  connection.query(
    'SELECT * FROM pets_of_shelters WHERE status = "ADOPT" && shelter_Username = ?',
    shelter_Username,
    function(err, results) {
      if (err) return callback(err); // some error with query
      return callback(null, results); // if successful
    }
  );
};

module.exports.adoptPet = function(newAdoptRequest, callback) {
  var pet = newAdoptRequest.pet_uuid;
  connection.query(
    'SELECT FROM pets_of_shelters WHERE status = "ADOPT" && uuid = ?',
    pet,
    (err, results) => {
      if (err) return callback(err); // some error with query
      if (results.length > 0) {
        connection.query(
          'INSERT INTO adopts SET ?',
          newAdoptRequest,
          (err, results) => {
            if (err) return callback(err); // some error with query
            return callback(null, true); // if successful
          }
        );
      } else return callback(null, false); // that pet doesnt exist or is not for adoption
    }
  );
};

module.exports.viewAdoptRequests = function(shelter, callback) {
  connection.query(
    'SELECT * FROM pets_of_shelters FULL OUTER JOIN adopts ON pets_of_shelters.uuid = adopts.pet_uuid WHERE pets_of_shelters.shelter_Username = ?',
    shelter,
    (err, results) => {
      if (err) callback(err);
      console.log('okay!');
      console.log(results);
      callback(null, results);
    }
  );
};

module.exports.datePet = function(newDateRequest, callback) {
  var pet = newDateRequest.pet_uuid;
  connection.query(
    'SELECT FROM pets_of_shelters WHERE status = "DATES" && uuid = ?',
    pet,
    (err, results) => {
      if (err) return callback(err); // some error with query
      if (results.length > 0) {
        connection.query(
          'INSERT INTO dates SET ?',
          newAdoptRequest,
          (err, results) => {
            if (err) return callback(err); // some error with query
            return callback(null, true); // if successful
          }
        );
      } else return callback(null, false); // that pet doesnt exist or is not for adoption
    }
  );
};

module.exports.viewShelterPetsForBoth = function(shelter_Username, callback) {
  connection.query(
    'SELECT * FROM pets_of_shelters WHERE shelter_Username = ? status = "BOTH"',
    shelter_Username,
    function(err, results) {
      if (err) return callback(err); // some error with query
      return callback(null, results); // if successful
    }
  );
};

module.exports.viewUserPetsOf = function(user_Username, callback) {
  connection.query(
    'SELECT * FROM pets_of_users WHERE user_Username = ?',
    user_Username,
    function(err, results) {
      if (err) return callback(err); // some error with query
      return callback(null, results); // if successful
    }
  );
};

module.exports.searchPet = function(uuid, callback) {
  connection.query(
    'SELECT * FROM pets_of_shelters where uuid = ?',
    uuid,
    function(err, results) {
      if (err) return callback(err); // some error with query
      if (results.length > 0) return callback(null, results);
      else {
        connection.query(
          'SELECT * FROM pets_of_users where uuid = ?',
          uuid,
          function(err, results) {
            if (err) return callback(err); // some error with query
            if (results.length > 0)
              return callback(null, results); // if successful
            else return callback(null, null);
          }
        );
      }
    }
  );
};

/* adding a pet */
module.exports.addShelterPet = function(petInfo, callback) {
  connection.query('INSERT INTO pets_of_shelters SET ?', petInfo, function(
    err,
    results
  ) {
    if (err) return callback(err); // some error with query
    return callback(null, results); // if successful
  });
};

module.exports.addUserPet = function(petInfo, callback) {
  console.log(petInfo);
  connection.query('INSERT INTO pets_of_users SET ?', petInfo, function(
    err,
    results
  ) {
    if (err) return callback(err); // some error with query
    return callback(null, results); // if successful
  });
};

/* updating pet infos */
module.exports.updateUserPet = function(uuid, changes, callback) {
  connection.query(
    'UPDATE pets_of_users SET ? WHERE uuid = ?',
    [changes, uuid],
    function(err, results) {
      if (err) return callback(err); // some error with query
      return callback(null, changes); // if successful
    }
  );
};

module.exports.updateShelterPet = function(uuid, changes, callback) {
  connection.query(
    'INSERT INTO pets_of_shelters SET ? WHERE uuid = ?',
    [changes, uuid],
    function(err, results) {
      if (err) return callback(err); // some error with query
      return callback(null, changes); // if successful
    }
  );
};

/* delete specific pets given the uuid of pet */
module.exports.deleteUserPet = function(Username, uuid, callback) {
  //delete image
  connection.query(
    'SELECT * FROM pets_of_users where user_Username = ? and uuid = ?',
    [Username, uuid],
    function(err, results) {
      if (results.affectedRows !== 0 && typeof results[0].url !== undefined)
        fs.unlink(JSON.parse(JSON.stringify(results[0].url)), resultHandler);
    }
  );
  connection.query(
    'DELETE FROM pets_of_users WHERE user_Username = ? and uuid = ?',
    [Username, uuid],
    function(err, results) {
      if (err) return callback(err); // some error with query
      console.log(results);
      return callback(null, results); // if successful
    }
  );
};

module.exports.deleteShelterPet = function(Username, uuid, callback) {
  //delete image
  connection.query(
    'SELECT * FROM pets_of_shelters where shelter_Username = ? and uuid = ?',
    [Username, uuid],
    function(err, results) {
      if (results.affectedRows !== 0 && typeof results[0].url !== undefined)
        fs.unlink(JSON.parse(JSON.stringify(results[0].url)), resultHandler);
    }
  );
  connection.query(
    'DELETE FROM pets_of_shelters WHERE shelter_Username = ? and uuid = ?',
    [Username, uuid],
    function(err, results) {
      if (err) return callback(err); // some error with query
      console.log(results);
      return callback(null, results); // if successful
    }
  );
};

/* delete all pets of shelter/user */
module.exports.deleteAllUserPets = function(Username, callback) {
  connection.query(
    'DELETE FROM pets_of_users WHERE user_Username = ?',
    Username,
    function(err, results) {
      if (err) return callback(err); // some error with query
      console.log(results);
      return callback(null, results); // if successful
    }
  );
};

module.exports.deleteAllShelterPets = function(Username, callback) {
  connection.query(
    'DELETE FROM pets_of_shelters WHERE shelter_Username = ?',
    Username,
    function(err, results) {
      if (err) return callback(err); // some error with query
      console.log(results);
      return callback(null, results); // if successful
    }
  );
};
