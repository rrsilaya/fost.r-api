const express=require('express');
const router=express.Router();
var controller = require('./pets_controller');

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

/* add pets to database */
router.post('/addShelterPet', function(req, res){
    console.log(req.session.body);
    if (req.session.body){
        var owner = req.session.body.Username;
        var today = new Date();
        var petInfo = {
            "name": req.body.name,
            "kind": req.body.kind,
            "breed": req.body.breed,
            "sex": req.body.sex,
            "birthday": req.body.birthday,
            "created_at": today,
            "updated_at": today,
            "shelter_Username": owner
        }
        controller.addShelterPet(petInfo, function(err, results){
            if (err) return res.status(500).json(err);  // server error
            res.status(201).json(pets); // returns pets of specified user
        });
    }else res.status(401).json({message: 'login first before adding'});
});

router.post('/addUserPet', function(req, res){
    if (req.session.body){
        var owner = req.session.body.Username;
        var today = new Date();
        var petInfo = {
            "name": req.body.name,
            "kind": req.body.kind,
            "breed": req.body.breed,
            "sex": req.body.sex,
            "birthday": req.body.birthday,
            "created_at": today,
            "updated_at": today,
            "user_Username": owner
        }
        controller.addUserPet(petInfo, function(err, results){
            if (err) return res.status(500).json(err);  // server error
            res.status(201).json(results); // returns pets of specified user
        });
    }else res.status(401).json({message: 'login first before adding'});
});

module.exports = router;