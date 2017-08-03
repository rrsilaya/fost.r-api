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

/********************************* F I L T E R I N G *********************************/

module.exports.countAllUsersPetsByKind = function(kind, callback) {
  var kind = kind.toUpperCase();
  connection.query(
    'SELECT COUNT(*) as count FROM pets_of_users WHERE kind = ?',
    kind,
    (err, count) => {
      if (err) callback(err);
      callback(null, count[0].count); // this will return an integer of the count of all the posts
    }
  );
};

module.exports.countAllSheltersPetsByKind = function(kind, callback) {
  var kind = kind.toUpperCase();
  connection.query(
    'SELECT COUNT(*) as count FROM pets_of_shelters WHERE kind = ?',
    kind,
    (err, count) => {
      if (err) callback(err);
      callback(null, count[0].count); // this will return an integer of the count of all the posts
    }
  );
};

module.exports.viewUsersPetsByKind = function(page_number, kind, callback) {
  var kind = kind.toUpperCase();
  var number = parseInt(page_number);
  var offset = (number-1 )* 15;

  connection.query(
    'SELECT * FROM pets_of_users WHERE kind = ? LIMIT 15 OFFSET ?',
    [kind, offset],
    (err, results) => {
      if (err) return callback(err); // some error with query
      return callback(null, results); // successful
    }
  );
};

module.exports.viewSheltersPetsByKind = function(page_number, kind, callback) {
  var kind = kind.toUpperCase();
  var number = parseInt(page_number);
  var offset = (number-1 )* 15;

  connection.query(
    'SELECT * FROM pets_of_shelters WHERE kind = ? LIMIT 15 OFFSET ?',
    [kind, offset],
    (err, results) => {
      if (err) return callback(err); // some error with query
      return callback(null, results); // successful
    }
  );
};

module.exports.countAllUsersPetsBySex = function(sex, callback) {
  var sex = sex.toUpperCase();
  connection.query(
    'SELECT COUNT(*) as count FROM pets_of_users WHERE sex = ?',
    sex,
    (err, count) => {
      if (err) callback(err);
      console.log('count ' + count);
      callback(null, count[0].count); // this will return an integer of the count of all the posts
    }
  );
};

module.exports.countAllSheltersPetsBySex = function(sex, callback) {
  var sex = sex.toUpperCase();
  connection.query(
    'SELECT COUNT(*) as count FROM pets_of_shelters WHERE sex = ?',
    sex,
    (err, count) => {
      if (err) callback(err);
      console.log('count ' + count);
      callback(null, count[0].count); // this will return an integer of the count of all the posts
    }
  );
};

module.exports.viewUsersPetsBySex = function(page_number, sex, callback) {
  var sex = sex.toUpperCase();
  var number = parseInt(page_number);
  var offset = (number-1 )* 15;

  connection.query(
    'SELECT * FROM pets_of_users WHERE sex = ? LIMIT 15 OFFSET ?',
    [sex, offset],
    (err, results) => {
      if (err) return callback(err); // some error with query
      return callback(null, results); // successful
    }
  );
};

module.exports.viewSheltersPetsBySex = function(page_number, sex, callback) {
  var sex = sex.toUpperCase();
  var number = parseInt(page_number);
  var offset = (number-1 )* 15;

  connection.query(
    'SELECT * FROM pets_of_shelters WHERE sex = ? LIMIT 15 OFFSET ?',
    [sex, offset],
    (err, results) => {
      if (err) return callback(err); // some error with query
      return callback(null, results); // successful
    }
  );
};

/*
  module.exports.countAllPetsByAge = function(age, callback){
    var counter;
    // receives months only
    age *= 30;
    moment().subtract(age, 'days').calendar();

 }
*/

/********************************* F I L T E R I N G *********************************/

/* view all shelter  pets */
module.exports.viewAllShelterPets = function(page_number, callback) {
  var number = parseInt(page_number);
  var offset = (number-1 )* 15;

  connection.query(
    'SELECT * FROM pets_of_shelters LIMIT 15 OFFSET ?',
    offset,
    function(err, results) {
      if (err) return callback(err); // some error with query
      return callback(null, results); // if successful
    }
  );
};

module.exports.countAllPetsForDates = function(callback) {
  var status = 'DATES';
  var both = 'BOTH';
  connection.query(
    'SELECT COUNT(*) as count FROM pets_of_shelters WHERE status = ? OR status = ?',
    [status, both],
    (err, count) => {
      if (err) callback(err);
      callback(null, count[0].count); // this will return an integer of the count of all the posts
    }
  );
};

module.exports.viewAllPetsForDates = function(page_number, callback) {
  var status = 'DATES';
  var both = 'BOTH';
  var number = parseInt(page_number);
  var offset = (number-1 )* 15;

  connection.query(
    'SELECT * FROM pets_of_shelters WHERE status = ? OR status = ? LIMIT 15 OFFSET ?',
    [status, both, offset],
    function(err, results) {
      if (err) callback(err); // some error with query
        callback(null, results); // found results on that page
    }
  );
};

module.exports.countAllPetsForAdopt = function(callback) {
  var status = 'ADOPT';
  var both = 'BOTH';
  connection.query(
    'SELECT COUNT(*) as count FROM pets_of_shelters WHERE status = ? OR status = ?',
    [status, both],
    (err, count) => {
      console.log('There are a total of ' + count[0].count + ' pets valid.');
      if (err) callback(err);
      else callback(null, count[0].count); // this will return an integer of the count of all the posts
    }
  );
};

module.exports.viewAllPetsForAdopt = function(page_number, callback) {
  var status = 'ADOPT';
  var both = 'BOTH';
  var number = parseInt(page_number);
  var offset = (number-1 )* 15;
  connection.query(
    'SELECT * FROM pets_of_shelters WHERE status = ? OR status = ? LIMIT 15 OFFSET ?',
    [status, both, offset],
    (err, results) => {
      if (err) callback(err); // some error with query
        callback(null, results); // found results on that page
    }
  );
};

module.exports.countAllPetsForBoth = function(callback) {
  var status = 'BOTH';
  connection.query(
    'SELECT COUNT(*) as count FROM pets_of_shelters WHERE status = ?',
    status,
    (err, count) => {
      if (err) callback(err);
      callback(null, count[0].count); // this will return an integer of the count of all the posts
    }
  );
};

module.exports.viewAllPetsForBoth = function(page_number, callback) {
  var status = 'BOTH';
  var number = parseInt(page_number);
  var offset = (number-1 )* 15;

  connection.query(
    'SELECT * FROM pets_of_shelters WHERE status = ? LIMIT 15 OFFSET ?',
    [status, offset],
    function(err, results) {
      if (err) return callback(err); // some error with query
        return callback(null, results); // found results on that page
    }
  );
};

module.exports.viewAllUserPets = function(page_number, callback) {
  var number = parseInt(page_number);
  var offset = (number-1 )* 15;
  connection.query(
    'SELECT * FROM pets_of_users LIMIT 15 OFFSET ?',
    offset,
    function(err, results) {
      if (err) return callback(err); // some error with query
      return callback(null, results); // if successful
    }
  );
};

/* view pets of specific user/shelter */

// returns all pets of <shelter>
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
  var status = 'DATES';
  var both = 'BOTH';
  connection.query(
    'SELECT * FROM pets_of_shelters WHERE status = ? OR status = ? && shelter_Username = ?',
    [status, both, shelter_Username],
    function(err, results) {
      if (err) return callback(err); // some error with query
      return callback(null, results); // if successful
    }
  );
};

module.exports.viewShelterPetsForAdopt = function(shelter_Username, callback) {
  var status = 'ADOPT';
  var both = 'BOTH';
  connection.query(
    'SELECT * FROM pets_of_shelters WHERE status = ? OR status = ? && shelter_Username = ?',
    [status, both, shelter_Username],
    function(err, results) {
      if (err) return callback(err); // some error with query
      return callback(null, results); // if successful
    }
  );
};

module.exports.adoptPet = function(newAdoptRequest, callback) {
  var pet = newAdoptRequest.pet_uuid;
  var status = 'ADOPT';
  var both = 'BOTH';
  connection.query(
    'SELECT * FROM pets_of_shelters WHERE status = ? OR status = ? && uuid = ?',
    [status, both, pet],
    (err, results) => {
      if (err) return callback(err);
      else if (results.length > 0) {
        connection.query(
          'INSERT INTO adopts SET ?',
          newAdoptRequest,
          (err, query) => {
            if (err) callback(err);
            if (query) callback(null, true);
            else return callback(null, false);
          }
        );
      } else callback(null, false);
    }
  );
};

module.exports.viewAdoptRequests = function(shelter, callback) {
  connection.query(
    'SELECT * FROM pets_of_shelters RIGHT OUTER JOIN adopts on pets_of_shelters.uuid = adopts.pet_uuid where shelter_Username = ? ORDER BY updated_at',
    shelter,
    (err, results) => {
      if (err) callback(err);
      callback(null, results);
    }
  );
};

module.exports.viewSpecificAdoptRequest = function(uuid, shelter, callback) {
  connection.query(
    'SELECT * FROM pets_of_shelters RIGHT OUTER JOIN adopts on pets_of_shelters.uuid = adopts.pet_uuid where shelter_Username = ? && adopt_uuid = ?'[
      (shelter, uuid)
    ],
    (err, results) => {
      if (err) return callback(err);
        callback(null, results);
    }
  );
};

/*module.exports.acceptDateRequest = function(uuid, shelter, callback){
  // logged in shelter is shelter
  // uuid is in req.params
  // 1. check if there really is an adoption request
  // 2. delete pet from shelter.
  // 3. add pet to user
  connection.query(
    '',
    [uuid, shelter])
};*/

module.exports.datePet = function(newDate, callback) {
  var pet = newDate.pet_uuid;
  var status = 'DATES';
  var both = 'BOTH';
  connection.query(
    'SELECT * FROM pets_of_shelters WHERE status = ? OR status = ? && uuid = ?',
    [status, both, pet],
    (err, results) => {
      console.log(newDate);
      if (err) return callback(err);
      else if (results.length > 0) {
        connection.query(
          'INSERT INTO dates SET ?',
          newDate,
          (err, query) => {
            if (err) callback(err);
            if (query) callback(null, true);
            else return callback(null, false);
          }
        );
      } else callback(null, false);
    }
  );
};

module.exports.approveDate = function(shelter, uuid, callback){
  var today = new Date();
  var update = {
    status:'APPROVED',
    updated_at:today
  }
  connection.query('SELECT * FROM pets_of_shelters where shelter_Username = ? && uuid = ?', [shelter, uuid], (err, results)=>{
    if (err) callback(err);
    else{
      connection.query('UPDATE dates SET ? WHERE dates_uuid = ?', [update, uuid], (err, results)=>{
        if (err) callback(err);
        return callback(null, results); // mysql query results
      });
    }
  });
};

module.exports.rejectDate = function(shelter, uuid, callback){
  var today = new Date();
  var update = {
    status:'REJECTED',
    updated_at:today
  }
  connection.query('SELECT * FROM pets_of_shelters where shelter_Username = ? && uuid = ?', [shelter, uuid], (err, results)=>{
    if (err) callback(err);
    else{
      connection.query('UPDATE dates SET ? WHERE dates_uuid = ?', [update, uuid], (err, results)=>{
        if (err) callback(err);
        return callback(null, results); // mysql query results
        
      });
    }
  });
};


module.exports.viewDateRequests = function(shelter, callback) {
  connection.query(
    'SELECT * FROM pets_of_shelters RIGHT OUTER JOIN dates on pets_of_shelters.uuid = dates.pet_uuid where shelter_Username = ? ORDER BY updated_at',
    shelter,
    (err, results) => {
      if (err) callback(err);
      callback(null, results);
    }
  );
};

module.exports.viewSpecificDateRequest = function(uuid, callback) {
  connection.query(
    'SELECT * FROM dates WHERE dates_uuid = ?', uuid,
    (err, results) => {
      if (err) return callback(err);
      return callback(null, results);
    }
  );
};

module.exports.viewShelterPetsForBoth = function(shelter_Username, callback) {
  var status = 'BOTH';
  connection.query(
    'SELECT * FROM pets_of_shelters WHERE shelter_Username = ? && status = ?',
    [shelter_Username, status],
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
    'UPDATE pets_of_shelters SET ? WHERE uuid = ?',
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