const express=require('express');
const router=express.Router(); 
var fileUpload = require('express-fileupload'); // for file upload
var mv = require('mv');                         // for file upload; won't work when declared as consta
var sizeOf = require('image-size');             // get image dimensions
const validator = require('express-validator');
var shortid = require('shortid');
shortid.characters('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ$@'); 
// default has "-"" and "_" ; this sets the characters to only the entered characters (https://www.npmjs.com/package/shortid)

var controller = require('./pets_controller');


router.use(validator());      // express-validator
router.use(fileUpload());     // express-fileupload

router.use(function(req, res, next) {
    // do logging
    if(req.session.body)next(); // make sure we go to the next routes and don't stop here
    else res.status(403).send("Please log in or sign up first");   
});


router.get('/', function(req, res, next){
    res.json({message:'get /api/pets'});
});

/* views pets owned by all shelters or users */
router.get('/viewShelterPets', function(req, res){
    controller.viewAllShelterPets(function(err, pets){
        if (err) return res.status(500).json(err);  // server error
        res.json(pets); // returns pets
    });
});

router.get('/viewUserPets', function(req, res){
    controller.viewAllUserPets(function(err, pets){
        if (err) return res.status(500).json(err);  // server error
        res.json(pets); // returns pets
    });
});

/* returns pets of <name> */
router.get('/:owner/viewShelterPets', function(req, res){
    var owner = req.params.owner; 
    controller.viewShelterPetsOf(owner, function(err, pets){
        if (err) return res.status(500).json(err);  // server error
        res.json(pets); // returns pets of specified shelter
    });
});

router.get('/:owner/viewUserPets', function(req, res){
    var owner = req.params.owner;
    controller.viewUserPetsOf(owner, function(err, pets){
        if (err) return res.status(500).json(err);  // server error
        res.json(pets); // returns pets of specified user
    }); 
});

/* deletes all pets of <name> */
router.delete('/:owner/deleteAllUserPets', function(req, res){
    var owner = req.params.owner;
    controller.deleteAllUserPets(owner, function(err, results){
        if (err) return res.status(500).json(err);  // server error
        if (!results) return res.status(500).json({message: 'unable to delete?'});
        res.status(204).json(null);
    });
});

router.delete('/:owner/deleteAllShelterPets', function(req, res){
    var owner = req.params.owner;
    controller.deleteAllShelterPets(owner, function(err, results){
        if (err) return res.status(500).json(err);  // server error
        if (!results) return res.status(500).json({message: 'unable to delete?'});
        res.status(204).json(null);
    });
});

/* add pets to database (only if logged in) */
router.post('/addShelterPet', function(req, res){
        var owner = req.session.body.Username;
        var uuid = shortid.generate();
        var today = new Date();
        var petInfo = {
            "name": req.body.name,
            "kind": req.body.kind,
            "breed": req.body.breed,
            "sex": req.body.sex,
            "birthday": req.body.birthday,
            "created_at": today,
            "updated_at": today,
            "uuid": uuid,
            "shelter_Username": owner
        }
        if (typeof(req.files) !== 'undefined'){
            var petDP = req.files.photo;
            var mime = req.files.photo.mimetype;
            var name = petInfo.uuid + '-dp-' + petDP.name;
            var url = __dirname + '/photos/' + name;
            if (mime.substring(0,5) === 'image'){
                petDP.mv(url, function(err){
                    if (err){
                        console.log('api err: not able to receive image');  
                        controller.addShelterPet(petInfo, function(err, results){
                            if (err) return res.status(500).json(err);  // server error
                            res.status(201).json(results); // returns info of newly added pet
                        });
                    }
                    petInfo.url = url;
                    var dimensions = sizeOf(url);
                    petInfo.width = dimensions.width;
                    petInfo.height = dimensions.height;
                    controller.addShelterPet(petInfo, function(err, results){
                        if (err) return res.status(500).json(err);  // server error
                        res.status(201).json(results); // returns info of newly added pet
                    });
                });
            }else{
                console.log('file uploaded is not image');
                console.log('created pet but no image yet');
                controller.addShelterPet(petInfo, function(err, results){
                if (err) return res.status(500).json(err);  // server error
                res.status(201).json(results); // returns info of newly added pet
            });
            }

        }else{
            console.log('no image received');
            controller.addShelterPet(petInfo, function(err, results){
                if (err) return res.status(500).json(err);  // server error
                res.status(201).json(results); // returns info of newly added pet
            });
        }
});

router.post('/addUserPet', function(req, res){
        var owner = req.session.body.Username;
        var uuid = shortid.generate();
        var today = new Date();
        console.log(req.body.name);
        var petInfo = {
            "name": req.body.name,
            "kind": req.body.kind,
            "breed": req.body.breed,
            "sex": req.body.sex,
            "birthday": req.body.birthday,
            "created_at": today,
            "updated_at": today,
            "uuid": uuid,
            "user_Username": owner
        }
        console.log(req.files);
        if (typeof(req.files) !== 'undefined'){
            var petDP = req.files.photo;
            var name = petInfo.uuid + '-dp-' + petDP.name;
            var url = __dirname + '/photos/' + name;
            var mime = req.files.photo.mimetype;
            if (mime.substring(0,5) === 'image'){
                petDP.mv(url, function(err){
                    if (err){
                        console.log('api err: not able to receive image');  
                        controller.addUserPet(petInfo, function(err, results){
                            if (err) return res.status(500).json(err);  // server error
                            res.status(201).json(results); // returns info of newly added pet
                        });
                    }
                    petInfo.url = url;
                    var dimensions = sizeOf(url);
                    petInfo.width = dimensions.width;
                    petInfo.height = dimensions.height;
                    controller.addUserPet(petInfo, function(err, results){
                        if (err) return res.status(500).json(err);  // server error
                        res.status(201).json(results); // returns info of newly added pet
                    });
                });
            }else{
                console.log('file uploaded is not image');
                console.log('created pet but no image yet');
                controller.addUserPet(petInfo, function(err, results){
                if (err) return res.status(500).json(err);  // server error
                res.status(201).json(results); // returns info of newly added pet
            });
            }

        }else{
            console.log('no image received');
            controller.addUserPet(petInfo, function(err, results){
                if (err) return res.status(500).json(err);  // server error
                res.status(201).json(results); // returns info of newly added pet
            });
        }
});

/* returns specific pet of logged in user/shelter */ 
router.get('/:pet_uuid/viewSpecificPetUser', function(req, res){
        var pet_uuid = req.params.pet_uuid;
        var Username = req.session.body.Username;
        controller.viewSpecificPetUser(Username, pet_uuid, function(err, results){
            if (err) return res.status(500).json(err);  // server error
            res.json(results); // returns results
        }); 
});

router.get('/:pet_uuid/viewSpecificPetShelter', function(req, res){
        var pet_uuid = req.params.pet_uuid;
        var Username = req.session.body.Username;
        controller.viewSpecificPetShelter(Username, pet_uuid, function(err, results){
            if (err) return res.status(500).json(err);  // server error
            res.json(results); // returns results
        }); 
});

/* update certain info of pets (only if logged in && pet exists) */
router.put('/:pet_uuid/updateShelterPets', function(req, res){
        var pet_uuid = req.params.pet_uuid; 
        var changes = req.body;
        controller.updateShelterPet(pet_uuid, changes, function(err, results){
            if (err) return res.status(500).json(err);  // server error
            res.json(results); // returns results
        }); 
});

router.put('/:pet_uuid/updateUserPets', function(req, res){
        var pet_uuid = req.params.pet_uuid;
        var changes = req.body;
        controller.updateUserPet(pet_uuid, changes, function(err, results){
            if (err) return res.status(500).json(err);  // server error
            res.json(results); // returns pets of specified user
        }); 
});

/* deletes a single pet given the pet's uuid */
router.delete('/:pet_uuid/deleteUserPet', function(req, res){
        var pet_uuid = req.params.pet_uuid;
        var Username = req.session.body.Username;
        controller.deleteUserPet(Username, pet_uuid, function(err, results){
            if (err) return res.status(500).json(err);  // server error
            if (!results) return res.status(500).json({message: 'unable to delete?'});
            res.status(204).json(null);
        }); 
});

router.delete('/:pet_uuid/deleteShelterPet', function(req, res){
        var pet_uuid = req.params.pet_uuid;
        var Username = req.session.body.Username;
        controller.deleteShelterPet(Username, pet_uuid, function(err, results){
            if (err) return res.status(500).json(err);  // server error
            if (!results) return res.status(500).json({message: 'unable to delete?'});
            res.status(204).json(null);
        }); 
});

router.get('*', function(req, res, next) {
  res.status(302).redirect('/api/feed');
});

module.exports = router;