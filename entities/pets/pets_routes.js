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
const notify = require('./../notifications/notifications_controllers');

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
          .json({page: page_number, pageTotal: count, pets: pets}); // returns pets
      });
    }
  });
});

/********** SORTING PETS **********/

//By kind
router.get('/shelters/viewPetsByKind/:page_number/:kind', function(req, res) {
  var page_number = req.params.page_number;
  var kind = req.params.kind;
  controller.countAllSheltersPetsByKind(kind, function(err, count) {
    if (err) res.status(500).json(err);
    else {
      count = parseInt(count);
      count = Math.ceil(count / 15);
      controller.viewSheltersPetsByKind(page_number, kind, function(err, pets) {
        if (err) return res.status(500).json(err); // server error
        res
          .status(200)
          .json({page: page_number, pageTotal: count, pets: pets}); // returns pets
      });
    }
  });
});

//By sex
router.get('/shelters/viewPetsBySex/:page_number/:sex', function(req, res) {
  var page_number = req.params.page_number;
  var sex = req.params.sex;
  controller.countAllSheltersPetsBySex(sex, function(err, count) {
    if (err) res.status(500).json(err);
    else {
      count = parseInt(count);
      count = Math.ceil(count / 15);
      controller.viewSheltersPetsBySex(page_number, sex, function(err, pets) {
        if (err) return res.status(500).json(err); // server error
        res
          .status(200)
          .json({ page: page_number, pageTotal: count, pets: pets}); // returns pets
      });
    }
  });
});

//By kind
router.get('/users/viewPetsByKind/:page_number/:kind', function(req, res) {
  var page_number = req.params.page_number;
  var kind = req.params.kind;
  controller.countAllUsersPetsByKind(kind, function(err, count) {
    if (err) res.status(500).json(err);
    else {
      count = parseInt(count);
      count = Math.ceil(count / 15);
      controller.viewUsersPetsByKind(page_number, kind, function(err, pets) {
        if (err) return res.status(500).json(err); // server error
        res
          .status(200)
          .json({ page: page_number, pageTotal: count, pets: pets }); // returns pets
      });
    }
  });
});

//By sex
router.get('/users/viewPetsBySex/:page_number/:sex', function(req, res) {
  var page_number = req.params.page_number;
  var sex = req.params.sex;
  controller.countAllUsersPetsBySex(sex, function(err, count) {
    if (err) res.status(500).json(err);
    else {
      count = parseInt(count);
      count = Math.ceil(count / 15);
      controller.viewUsersPetsBySex(page_number, sex, function(err, pets) {
        if (err) return res.status(500).json(err); // server error
        res
          .status(200)
          .json({ page: page_number, pageTotal: count, pets: pets}); // returns pets
      });
    }
  });
});

// returns all of the pets of the shelters for adoption
router.get('/adopt/page/:page_number', function(req, res) {
  var page_number = req.params.page_number;
  controller.countAllPetsForAdopt(function(err, count) {
    if (err) res.status(500).json(err);
    else {
      count = parseInt(count);
      count = Math.ceil(count / 15);
      controller.viewAllPetsForAdopt(page_number, function(err, pets) {
        if (err) res.status(500).json(err);
          res
            .status(200)
            .json({ page: page_number, pageTotal: count, pets: pets }); // returns pets
      });
    }
  });
});


//delete adopt request 
// if status === 'cancel' : user can forfeit his/her request for animal adoption
//if status === 'approve' :  it will be deleted on adopts table along with the pet adopted
// if status === 'decline': delete adopt request but not the pet

router.delete('/:status/:adopt_uuid',function(req,res){
  var adopt_uuid=req.params.adopt_uuid;
  var status=req.params.status;
  controller.deleteAdoptRequest(status,adopt_uuid,req.session.body.Username,function(err,result){
    if(err) res.status(500).json(err);
    else res.status(204).json(result);
  })
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
    console.log(newAdopt);
    controller.adoptPet(newAdopt, function(err, results) {
      console.log('results ' + results);
      if (err) res.status(500).json(err);
      if (results) res.status(200).json(newAdopt);
      else if (!results) {
        console.log('That pet is not for adopt.');
        res.status(404).end();
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
    var newDate = {
      user_Username: req.session.body.Username,
      pet_uuid: req.params.pet_uuid,
      status:'PENDING',
      dates_uuid: uuid,
      date:req.body.date,
      created_at: today,
      updated_at: today
    };
    controller.datePet(newDate, function(err, results) {
      if (err) res.status(500).json(err);
      if(results) res.status(201).json({date: newDate.date});
      else res.status(404).send(null)
    });
  }
});

router.put('/dates/approve/:dates_uuid', function(req, res){
  if(req.session.body.accountType === 'shelter'){
    var shelter = req.session.body.Username;
    var uuid = req.params.dates_uuid;
    controller.getPetUUID(uuid, function(err, results){
      if (err) res.status(500).json(err);
      else{
        controller.approveDate(shelter, results.pet_uuid, function(err, results){
          if (err) res.status(500).json(err);
          if (results){
            controller.getPetUUID(uuid, function(err, request){
              if (err) res.status(500).json(err);
              var User = request.user_Username; 
              console.log(User);
              var newNotif = {
                notif_for:User,
                notif_message:
                  `${shelter} approved your request for dates with ${request.pet_uuid}`,
                notif_url:`dateRequests/${request.dates_uuid}`,
                date_created: new Date()
              };
              //add to notifications table
              notify.addNotif(newNotif, function(err, results) {
                if (err) console.log(err);
                console.log(newNotif.notif_for + 'will be notified');
              });
              res.status(201).json(request);
            });
          }
        });
      }
    });
  }
});

router.put('/dates/reject/:dates_uuid', function(req, res){
  if(req.session.body.accountType === 'shelter'){
    var shelter = req.session.body.Username;
    var uuid = req.params.dates_uuid;
    controller.getPetUUID(uuid, function(err, results){
      if (err) res.status(500).json(err);
      else{
        controller.rejectDate(shelter, results.pet_uuid, function(err, results){
          if (err) res.status(500).json(err);
          if (results){
            controller.getPetUUID(uuid, function(err, request){
              if (err) res.status(500).json(err);
              var User = request.user_Username; 
              console.log(User);
              var newNotif = {
                notif_for:User,
                notif_message:
                  `${shelter} rejected your request for dates with ${request.pet_uuid}`,
                notif_url:`dateRequests/${request.dates_uuid}`,
                date_created: new Date()
              };
              //add to notifications table
              notify.addNotif(newNotif, function(err, results) {
                if (err) console.log(err);
                console.log(newNotif.notif_for + 'will be notified');
              });
              res.status(201).json(request);
            });
          }
        });
      }
    });
  }
});

router.get('/dateRequests', function(req, res){
  if (req.session.body.accountType === 'shelter'){
    var shelter = req.session.body.Username;
    controller.viewDateRequests(shelter, function(err, results){
      if (err) res.status(500).json(err);
      res.status(200).json(results);
    });
  }else if (req.session.body.accountType === 'user'){
    var user = req.session.body.Username;
    controller.viewAllDateRequestsForUser(user, function(err, results){
      if (err) res.status(500).json(err);
      res.status(200).json(results);
    });
  }
});

router.get('/dateRequests/:dates_uuid', function(req, res){
  var uuid = req.params.dates_uuid;
  console.log('specific date');
  if (req.session.body.accountType === 'shelter'){
    var shelter = req.session.body.Username;
    controller.viewDateRequestForShelter(shelter, uuid, function(err, results){
      if (err) res.status(500).json(err);
      res.status(200).json(results);
    });
  }else if (req.session.body.accountType === 'user'){
    var user = req.session.body.Username;
    controller.viewDateRequestForUser(user, uuid, function(err, results){
      if (err) res.status(500).json(err);
      res.status(200).json(results);
    });
  }
});

router.get('/adoptRequests', function(req, res) {
  if (req.session.body.accountType === 'shelter') {
    var Username = req.session.body.Username;
    console.log('getting adopt requests for my pets');
    controller.viewAdoptRequests(Username, function(err, requests) {
      if (err) res.status(500).json(err);
      res.status(200).json(requests);
    });
  }
});


// // delete request for dates
// router.delete('/dates/:pet_uuid', function(req, res) {
//   var pet = pet_uuid;

// });

// Viewing the pets of :owner that are allowed for adopt
router.get('/adopt/:owner', function(req, res) {
  var owner = req.params.owner;
  controller.viewShelterPetsForAdopt(owner, function(err, pets) {
    if (err) res.status(500).json(err);
    res.status(200).json(pets);
  });
});

// returns all of the pets of the shelters for dates
router.get('/dates/page/:page_number', function(req, res) {
  var page_number = req.params.page_number;
  controller.countAllPetsForDates(function(err, count) {
    if (err) res.status(500).json(err);
    else {
      count = parseInt(count);
      count = Math.ceil(count / 15);
      controller.viewAllPetsForDates(page_number, function(err, pets) {
        if (err) res.status(500).json(err);
          res
            .status(200)
            .json({page: page_number, pageTotal: count, pets: pets}); // returns pets
      });
    }
  });
});

// Viewing the pets of :owner that are allowed for dates
router.get('/dates/:owner', function(req, res) {
  var owner = req.params.owner;
  controller.viewShelterPetsForDates(owner, function(err, pets) {
    if (err) res.status(500).json(err);
    res.status(200).json(pets);
  });
});

// returns all of the pets of the shelters for both adoption and dates
router.get('/both/page/:page_number', function(req, res) {
  var page_number = req.params.page_number;
  console.log('checking');
  controller.countAllPetsForBoth(function(err, count) {
    if (err) res.status(500).json(err);
    else {
      count = parseInt(count);
      count = Math.ceil(count / 15);
      controller.viewAllPetsForBoth(page_number, function(err, pets) {
        if (err) res.status(500).json(err);
          res
            .status(200)
            .json({ page: page_number, pageTotal: count, pets: pets}); // returns pets
      });
    }
  });
});

// Viewing the pets of :owner that are allowed for adopt
router.get('/both/:owner', function(req, res) {
  var owner = req.params.owner;
  controller.viewShelterPetsForBoth(owner, function(err, pets) {
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
    res.status(200).json(pets); // returns pets of specified shelter
  });
});

router.get('/:owner/viewUserPets', function(req, res) {
  var owner = req.params.owner;
  controller.viewUserPetsOf(owner, function(err, pets) {
    if (err) return res.status(500).json(err); // server error
    res.status(200).json(pets); // returns pets of specified user
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
      status: req.body.status,
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
      var abspath = __dirname + '/photos/' + name;
      if (mime.substring(0, 5) === 'image') {
        petDP.mv(abspath, function(err) {
          if (err) {
            console.log('api err: not able to receive image');
            controller.addShelterPet(petInfo, function(err, results) {
              if (err) return res.status(500).json(err); // server error
              res.status(201).json(petInfo); // returns info of newly added pet
            });
          }
          petInfo.url='/pets/photos/' + name;
          petInfo.abspath = abspath
          console.log(petInfo.abspath);
          var dimensions = sizeOf(abspath);
          petInfo.width = dimensions.width;
          petInfo.height = dimensions.height;
          controller.addShelterPet(petInfo, function(err, results) {
            if (err) return res.status(500).json(err); // server error
            res.status(201).json(petInfo); // returns info of newly added pet
          });
        });
      } else {
        console.log('file uploaded is not image');
        console.log('created pet but no image yet');
        controller.addShelterPet(petInfo, function(err, results) {
          if (err) return res.status(500).json(err); // server error
          res.status(201).json(petInfo); // returns info of newly added pet
        });
      }
    } else {
      console.log('no image received');
      controller.addShelterPet(petInfo, function(err, results) {
        if (err) return res.status(500).json(err); // server error
        res.status(201).json(petInfo); // returns info of newly added pet
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
      var abspath = __dirname + '/photos/' + name;

      console.log('uploading to.. ' + url);
      var mime = req.files.photo.mimetype;
      if (mime.substring(0, 5) === 'image') {
        petDP.mv(abspath, function(err) {
          if (err) {
            console.log('api err: not able to receive image');
            controller.addUserPet(petInfo, function(err, results) {
              if (err) return res.status(500).json(err); // server error
              res.status(201).json(petInfo); // returns info of newly added pet
            });
          }
          petInfo.url = '/pets/photos/' + name;
          petInfo.abspath=abspath;
          console.log('in db: ' + petInfo.url);
          var dimensions = sizeOf(abspath);
          petInfo.width = dimensions.width;
          petInfo.height = dimensions.height;
          controller.addUserPet(petInfo, function(err, results) {
            if (err) return res.status(500).json(err); // server error
            res.status(201).json(petInfo); // returns info of newly added pet
          });
        });
      } else {
        console.log('file uploaded is not image');
        console.log('created pet but no image yet');
        controller.addUserPet(petInfo, function(err, results) {
          if (err) return res.status(500).json(err); // server error
          res.status(201).json(petInfo); // returns info of newly added pet
        });
      }
    } else {
      console.log('no image received');
      controller.addUserPet(petInfo, function(err, results) {
        if (err) return res.status(500).json(err); // server error
        res.status(201).json(petInfo); // returns info of newly added pet
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
  res.status(302).redirect('/api/');
});

module.exports = router;
