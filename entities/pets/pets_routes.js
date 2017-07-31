const express = require('express');
const router = express.Router();
var fileUpload = require('express-fileupload'); // for file upload
var mv = require('mv'); // for file upload; won't work when declared as consta
var multer = require('multer');
var upload = multer({ dest: 'photos/' });
var sizeOf = require('image-size'); // get image dimensions
const validator = require('express-validator');
var shortid = require('shortid');
shortid.characters(
  '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ$@'
);
// default has "-"" and "_" ; this sets the characters to only the entered characters (https://www.npmjs.com/package/shortid)

var controller = require('./pets_controller');
//serve static files

router.use(validator()); // express-validator
router.use(fileUpload()); // express-fileupload

router.use(function(req, res, next) {
  console.log('pets routes. getting requests..');
  next();
});

// returns all of the pets of all shelters
router.get('/shelters/viewAllPets/page/:page_number', function(req, res) {
  var page_number = req.params.page_number;
  controller.countAllSheltersPets(function(err, count) {
    if (err) res.status(500).json(err);
    else {
      count = parseInt(count);
      count = Math.ceil(count / 15);
      controller.viewAllShelterPets(page_number, function(err, pets) {
        if (err) return res.status(500).json(err); // server error
        res
          .status(200)
          .json({ page: page_number, pageTotal: count, pets: pets }); // returns pets
      });
    }
  });
});

// returns all of the pets of the shelters for adoption
router.get('/adopt', function(req, res) {
  controller.viewPetsForAdopt(function(err, pets) {
    if (err) res.status(500).json(err);
    res.status(200).json(pets);
  });
});

// adopt pet; only for pets_of_shelters
// used by accountType = user
router.post('/adopt/:pet_uuid', function(req, res) {
  if (req.session.body.accountType === 'user') {
    var today = new Date();
    var uuid = shortid.generate();
    var newAdopt = {
      user_Username: req.session.body.Username,
      pet_uuid: req.params.pet_uuid,
      adopt_uuid: uuid,
      created_at: today,
      updated_at: today
    };
    controller.adoptPet(newAdopt, function(err, results) {
      console.log(results);
      if (err) res.status(500).json(err);
      if (results) res.status(200).json(results);
      else if (!results) {
        console.log('That pet is not for adopt.');
        res.status(404).send(null);
      }
    });
  }
});

// date pet ; only for pets_of_shelters
// used by accountType = user
router.post('/dates/:pet_uuid', function(req, res) {
  if (req.session.body.accountType === 'user') {
    var today = new Date();
    var uuid = shortid.generate();
    var newAdopt = {
      user_Username: req.session.body.Username,
      pet_uuid: req.params.pet_uuid,
      date_uuid: uuid,
      created_at: today,
      updated_at: today
    };
    controller.datePet(newAdopt, function(err, results) {
      if (err) res.status(500).json(err);
      if (results) res.status(200).json(results);
      else if (!results) {
        console.log('That pet is not for dates.');
        res.status(404).send(null);
      }
    });
  }
});

router.get('/adopt/requests', function(req, res) {
  if (req.session.body.accountType === 'shelter') {
    console.log('getting adopt requests for my pets');
  }
});

// delete request for adoption
// router.delete('/adopt/:pet_uuid', function(req, res) {
//   var pet = pet_uuid;

// });

// // delete request for dates
// router.delete('/dates/:pet_uuid', function(req, res) {
//   var pet = pet_uuid;

// });

router.get('/adopt/:owner', function(req, res) {
  var owner = req.params.owner;
  controller.viewPetsForAdoptSpecific(function(err, pets) {
    if (err) res.status(500).json(err);
    res.status(200).json(pets);
  });
});

// returns all of the pets of the shelters for dates
router.get('/dates', function(req, res) {
  controller.viewPetsForDates(function(err, pets) {
    if (err) res.status(500).json(err);
    res.status(200).json(pets);
  });
});

router.get('/dates/:owner', function(req, res) {
  var owner = req.params.owner;
  controller.viewPetsForDatesSpecific(function(err, pets) {
    if (err) res.status(500).json(err);
    res.status(200).json(pets);
  });
});

// returns all of the pets of the shelters for both adoption and dates
router.get('/both', function(req, res) {
  controller.viewPetsForBoth(function(err, pets) {
    if (err) res.status(500).json(err);
    res.status(200).json(pets);
  });
});

router.get('/both/:owner', function(req, res) {
  var owner = req.params.owner;
  controller.viewPetsForBothSpecific(function(err, pets) {
    if (err) res.status(500).json(err);
    res.status(200).json(pets);
  });
});

/* returns all pets of users */
router.get('/users/viewAllPets/page/:page_number', function(req, res) {
  var page_number = req.params.page_number;
  controller.countAllUsersPets(function(err, count) {
    if (err) res.status(500).json(err);
    else {
      count = parseInt(count);
      count = Math.ceil(count / 15);
      controller.viewAllUserPets(page_number, function(err, pets) {
        if (err) return res.status(500).json(err); // server error
        res
          .status(200)
          .json({ page: page_number, pageTotal: count, pets: pets }); // returns pets
      });
    }
  });
});

/*  returns pets of <name> */
router.get('/:owner/viewShelterPets', function(req, res) {
  var owner = req.params.owner;
  controller.viewShelterPetsOf(owner, function(err, pets) {
    if (err) return res.status(500).json(err); // server error
    res.json(pets); // returns pets of specified shelter
  });
});

router.get('/:owner/viewUserPets', function(req, res) {
  var owner = req.params.owner;
  controller.viewUserPetsOf(owner, function(err, pets) {
    if (err) return res.status(500).json(err); // server error
    res.json(pets); // returns pets of specified user
  });
});

/*  deletes all pets of <name> 
    ideally used during development
*/
router.delete('/:owner/deleteAllUserPets', function(req, res) {
  var owner = req.params.owner;
  controller.deleteAllUserPets(owner, function(err, results) {
    if (err) return res.status(500).json(err); // server error
    if (!results) return res.status(500);
    res.status(204).end();
  });
});

router.delete('/:owner/deleteAllShelterPets', function(req, res) {
  var owner = req.params.owner;
  controller.deleteAllShelterPets(owner, function(err, results) {
    if (err) return res.status(500).json(err); // server error
    if (!results) return res.status(500);
    res.status(204).end();
  });
});

/* add pets to database (only if logged in) */
router.post('/myPets', function(req, res) {
  var owner = req.session.body.Username;
  var uuid = shortid.generate();
  var today = new Date();
  if (req.session.body.accountType === 'shelter') {
    var petInfo = {
      name: req.body.name,
      kind: req.body.kind,
      breed: req.body.breed,
      sex: req.body.sex,
      birthday: req.body.birthday,
      created_at: today,
      updated_at: today,
      uuid: uuid,
      shelter_Username: owner
    };
    if (typeof req.files !== 'undefined') {
      var petDP = req.files.photo;
      var mime = req.files.photo.mimetype;
      var name = petInfo.uuid + '-dp-' + petDP.name;
      var url = __dirname + '/photos/' + name;

      if (mime.substring(0, 5) === 'image') {
        petDP.mv(url, function(err) {
          if (err) {
            console.log('api err: not able to receive image');
            controller.addShelterPet(petInfo, function(err, results) {
              if (err) return res.status(500).json(err); // server error
              res.status(201).json(results); // returns info of newly added pet
            });
          }
          petInfo.url = '/pets/photos/' + name;
          console.log(petInfo.url);
          var dimensions = sizeOf(url);
          petInfo.width = dimensions.width;
          petInfo.height = dimensions.height;
          controller.addShelterPet(petInfo, function(err, results) {
            if (err) return res.status(500).json(err); // server error
            res.status(201).json(results); // returns info of newly added pet
          });
        });
      } else {
        console.log('file uploaded is not image');
        console.log('created pet but no image yet');
        controller.addShelterPet(petInfo, function(err, results) {
          if (err) return res.status(500).json(err); // server error
          res.status(201).json(results); // returns info of newly added pet
        });
      }
    } else {
      console.log('no image received');
      controller.addShelterPet(petInfo, function(err, results) {
        if (err) return res.status(500).json(err); // server error
        res.status(201).json(results); // returns info of newly added pet
      });
    }
  } else if (req.session.body.accountType === 'user') {
    var petInfo = {
      name: req.body.name,
      kind: req.body.kind,
      breed: req.body.breed,
      sex: req.body.sex,
      birthday: req.body.birthday,
      created_at: today,
      updated_at: today,
      uuid: uuid,
      user_Username: owner
    };
    if (typeof req.files !== 'undefined') {
      var petDP = req.files.photo;
      var name = petInfo.uuid + '-dp-' + petDP.name;
      var url = __dirname + '/photos/' + name;
      console.log('uploading to.. ' + url);
      var mime = req.files.photo.mimetype;
      if (mime.substring(0, 5) === 'image') {
        petDP.mv(url, function(err) {
          if (err) {
            console.log('api err: not able to receive image');
            controller.addUserPet(petInfo, function(err, results) {
              if (err) return res.status(500).json(err); // server error
              res.status(201).json(results); // returns info of newly added pet
            });
          }
          petInfo.url = '/pets/photos/' + name;

          console.log('in db: ' + petInfo.url);
          var dimensions = sizeOf(url);
          petInfo.width = dimensions.width;
          petInfo.height = dimensions.height;
          controller.addUserPet(petInfo, function(err, results) {
            if (err) return res.status(500).json(err); // server error
            res.status(201).json(results); // returns info of newly added pet
          });
        });
      } else {
        console.log('file uploaded is not image');
        console.log('created pet but no image yet');
        controller.addUserPet(petInfo, function(err, results) {
          if (err) return res.status(500).json(err); // server error
          res.status(201).json(results); // returns info of newly added pet
        });
      }
    } else {
      console.log('no image received');
      controller.addUserPet(petInfo, function(err, results) {
        if (err) return res.status(500).json(err); // server error
        res.status(201).json(results); // returns info of newly added pet
      });
    }
  }
});

router.get('/myPets', function(req, res) {
  var Username = req.session.body.Username;
  if (req.session.body.accountType === 'user') {
    controller.viewUserPetsOf(Username, function(err, results) {
      if (err) return res.status(500).json(err);
      if (!results) return res.status(500);
      res.status(200).json(results);
    });
  } else if (req.session.body.accountType === 'shelter') {
    controller.viewShelterPetsOf(Username, function(err, results) {
      if (err) return res.status(500).json(err);
      if (!results) return res.status(500);
      res.status(200).json(results);
    });
  }
});

router.delete('/myPets', function(req, res) {
  var Username = req.session.body.Username;
  if (req.session.body.accountType === 'user') {
    controller.deleteAllUserPets(Username, function(err, results) {
      if (err) return res.status(500).json(err);
      if (!results) return res.status(500);
      res.status(204).end();
    });
  } else if (req.session.body.accountType === 'shelter') {
    controller.deleteAllShelterPets(Username, function(err, results) {
      if (err) return res.status(500).json(err);
      if (!results) return res.status(500);
      res.status(204).end();
    });
  }
});

/* returns specific pet */
router.get('/:pet_uuid', function(req, res) {
  var pet_uuid = req.params.pet_uuid;
  controller.searchPet(pet_uuid, function(err, pet) {
    if (err) res.status(500).send(err);
    if (!pet) res.status(404).end();
    else res.status(200).json(pet);
  });
});

/* update certain info of a pet (only if logged in && pet exists) */
router.put('/:pet_uuid', function(req, res) {
  if (req.session.body.accountType === 'user') {
    var pet_uuid = req.params.pet_uuid;
    var changes = req.body;
    controller.updateUserPet(pet_uuid, changes, function(err, results) {
      if (err) return res.status(500).json(err); // server error
      res.status(201).json(results); // returns pets of specified user
    });
  } else if (req.session.body.accountType === 'shelter') {
    var pet_uuid = req.params.pet_uuid;
    var changes = req.body;
    controller.updateShelterPet(pet_uuid, changes, function(err, results) {
      if (err) return res.status(500).json(err); // server error
      res.status(201).json(results); // returns results
    });
  }
});

/* deletes a single pet given the pet's uuid */
router.delete('/:pet_uuid', function(req, res) {
  if (req.session.body.accountType === 'user') {
    var pet_uuid = req.params.pet_uuid;
    var Username = req.session.body.Username;
    controller.deleteUserPet(Username, pet_uuid, function(err, results) {
      if (err) return res.status(500).json(err); // server error
      if (!results) return res.status(500);
      res.status(204).end();
    });
  } else if (req.session.body.accountType === 'shelter') {
    var pet_uuid = req.params.pet_uuid;
    var Username = req.session.body.Username;
    controller.deleteShelterPet(Username, pet_uuid, function(err, results) {
      if (err) return res.status(500).json(err); // server error
      if (!results) return res.status(500);
      res.status(204).end();
    });
  }
});

router.get('*', function(req, res, next) {
  res.status(302).redirect('/api/feed');
});

module.exports = router;
