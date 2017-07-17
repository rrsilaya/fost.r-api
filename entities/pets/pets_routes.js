const express=require('express');
const router=express.Router(); 
var sizeOf = require('image-size');
var mv = require('mv'); 
var fileUpload = require('express-fileupload');
var controller = require('./pets_controller');
var uuid = require('./generate_uuid');


router.use(fileUpload());     // express-fileupload

router.get('/', function(req, res, next){
    res.json({message:'get /api/pets'});
});

/* views pets owned by all shelters or users */
router.get('/viewShelterPets', function(req, res){
    controller.viewShelterPets(function(err, pets){
        if (err) return res.status(500).json(err);  // server error
        res.json(pets); // returns pets
    });
});

router.get('/viewUserPets', function(req, res){
    controller.viewUserPets(function(err, pets){
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
        if (results) return res.status(500).json({message: 'unable to delete?'});
        res.status(204).redirect('/' + owner + '/viewUserPets');
    });
});

router.delete('/:owner/deleteAllShelterPets', function(req, res){
    var owner = req.params.owner;
    controller.deleteAllShelterPets(owner, function(err, results){
        if (err) return res.status(500).json(err);  // server error
        if (results) return res.status(500).json({message: 'unable to delete?'});
        res.status(204).redirect('/' + owner + '/viewShelterPets'); 
    });
});

/* add pets to database (only if logged in) */
router.post('/addShelterPet', function(req, res){
    console.log(req.session.body);
    if (req.session.body){
        var owner = req.session.body.Username;
        var uuid = uuid.generate();
        var today = new Date();
        var petInfo = {
            "name": req.body.name,
            "kind": req.body.kind,
            "breed": req.body.breed,
            "sex": req.body.sex,
            "birthday": req.body.birthday,
            "status":NULL,
            "created_at": today,
            "updated_at": today,
            "uuid": uuid,
            "shelter_Username": owner
        }
        if (req.files.photo){
            var petDP = req.files.photo;
            var name = petInfo.uuid + '-dp-' + petDP.name;
            var url = __dirname + '/photos/' + name;
            // checking file type is still not available~
            petInfo.url = url;
            petDP.mv(url, function(err){
                if (err){
                    console.log('api err: not able to receive image');
                    petInfo.url = NULL;
                    petInfo.length = NULL;
                    petInfo.width = NULL;        
                    controller.addUserPet(petInfo, function(err, results){
                        if (err) return res.status(500).json(err);  // server error
                        res.status(201).json(results); // returns info of newly added pet
                    });
                }
            });
        }
        controller.addShelterPet(petInfo, function(err, results){
            if (err) return res.status(500).json(err);  // server error
            res.status(201).json(pets); // returns info of newly added pet
        });
    }else res.status(403).json({message: 'login first before adding'});
});

router.post('/addUserPet', function(req, res){
    if (req.session.body){
        var owner = req.session.body.Username;
        var uuid = uuid.generate();
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
            "user_Username": owner
        }
        if (req.files.photo){
            var petDP = req.files.photo;
            var name = petInfo.uuid + '-dp-' + petDP.name;
            var url = __dirname + '/photos/' + name;
            // checking file type is still not available~
            petDP.mv(url, function(err){
                if (err){
                    console.log('api err: not able to receive image');
                    petInfo.url = NULL;
                    petInfo.length = NULL;
                    petInfo.width = NULL;        
                    controller.addUserPet(petInfo, function(err, results){
                        if (err) return res.status(500).json(err);  // server error
                        res.status(201).json(results); // returns info of newly added pet
                    });
                }
            });
            var dimensions = sizeOf(url);
            petInfo.url = url;
            petInfo.length = dimensions.length;
            petInfo.width = dimensions.width;
        }
        controller.addUserPet(petInfo, function(err, results){
            if (err) return res.status(500).json(err);  // server error
            res.status(201).json(results); // returns info of newly added pet
        });
    }else res.status(403).json({message: 'login first before adding'});
});

/* update certain info of pets (only if logged in && pet exists) */
router.put('/:pet_uuid/updateShelterPets', function(req, res){
    if (req.session.body){
        var pet_uuid = req.params.pet_uuid; 
        var changes = req.body;
        controller.updateShelterPet(pet_uuid, changes, function(err, results){
            if (err) return res.status(500).json(err);  // server error
            res.json(results); // returns results
        }); 
    }else res.status(403).json({message: 'login first before updating'});
});

router.put('/:pet_uuid/updateUserPets', function(req, res){
    if(req.session.body){
        var pet_uuid = req.params.pet_uuid;
        var changes = req.body;
        controller.updateUserPet(pet_uuid, function(err, results){
            if (err) return res.status(500).json(err);  // server error
            res.json(results); // returns pets of specified user
        }); 
    }else res.status(403).json({message: 'login first before updating'});
});

/* deletes a single pet given the pet's uuid */
router.delete('/:pet_uuid/deleteUserPet', function(req, res){
    if(req.session.body){
        var pet_uuid = req.params.pet_uuid;
        controller.deleteUserPet(pet_uuid, function(err, results){
            if (err) return res.status(500).json(err);  // server error
            res.json(results); // returns pets of specified user
        }); 
    }else res.status(403).json({message: 'login first before deleting'});
});

router.delete('/:pet_uuid/deleteShelterPet', function(req, res){
    if(req.session.body){
        var pet_uuid = req.params.pet_uuid;
        controller.deleteShelterPet(pet_uuid, function(err, results){
            if (err) return res.status(500).json(err);  // server error
            res.json(results); // returns pets of specified user
        }); 
    }else res.status(403).json({message: 'login first before deleting'});
});

module.exports = router;