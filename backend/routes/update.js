const express = require('express');
const User = require('../models/userSchema');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
let router = express.Router();

router.put('/update', verifyToken, (req, res) => {
    let newUser = req.body;
    console.log(newUser);
    jwt.verify(req.token, 'secretkey', (err, authData) => {
        if(err){
            res.send("token missing or wrong...");

        } else {
            User.findOne({email: authData.user.email}, (err, user) => {
                if(newUser.newPassword === ""){
                    newUser.newPassword = newUser.password;
                }
                bcrypt.compare(newUser.password, user.password, (err, isMatch) => {
                    if(err) throw err;
                    if(isMatch){
                        bcrypt.genSalt(10, async (err, salt) => {
                            bcrypt.hash(newUser.newPassword, salt, async (err, hash) => {
                                user.name = newUser.name;
                                user.email = newUser.email;
                                user.mobile = newUser.mobile;
                                user.DOB = newUser.DOB;
                                user.password = hash;
                                try{
                                    await user.save();
                                    jwt.sign({user: {
                                        name: user.name,
                                        balance: user.balance,
                                        email: user.email,
                                        DOB: user.DOB,
                                        mobile: user.mobile
                                    }}, 'secretkey', {expiresIn: '1h'} , (err, token) => {
                                        res.status(200).json({
                                            token
                                        });
                                    });
                                }catch(err){
                                    console.log("Error: " + err);
                                }
                            });
                        });
                        
                    } else {
                        res.status(200).send("Passwords Didn't match!");
                    }
                });
            });
            
        }
    });
});

function verifyToken(req, res, next){
    const bearerHeader = req.headers['authorization'];
    if(typeof bearerHeader !== 'undefined'){
        let bearer = bearerHeader.split(" ");
        let bearerToken = bearer[1];
        req.token = bearerToken;
        next();
    } else {
        res.json({
            message: "token missing",
            token: req.headers
        });
    }
}

// function verifyToken(req, res, next){
//     const bearerHeader = req.headers['authorization'];

//     if(typeof bearerHeader !== 'undefined'){
//         const bearer = bearerHeader.split(' ');
//         // Get token from array
//         const bearerToken = bearer[1];
//         // Set the token
//         req.token = bearerToken;
//         // Next middleware
//         next();
//     }else {
//         res.json({
//             message: 'Token Missing',
//             token: req.headers
//         });
//     }
// }

module.exports = router;