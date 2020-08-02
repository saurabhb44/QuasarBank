const express = require('express');
const User = require('../models/userSchema');
const bcrypt = require('bcryptjs');
let router = express.Router();


router.post('/register', (req, res) => {
    let user = new User(req.body);
    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(user.password, salt, async (err, hash) => {
            user.password = hash;
            try{
                const newUser = await user.save();
                res.status(201).send("New User added...");
                console.log('Added...');
            }catch(err){
                console.log("Error");
                res.status(400).send(err.message);
            }
        });
    });
});

module.exports = router;