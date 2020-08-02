const express = require('express');
const User = require('../models/userSchema');
let router = express.Router();
const jwt = require('jsonwebtoken');

router.get('/home', verifyToken, (req, res) => {
    jwt.verify(req.token, 'secretkey', (err, authdata) => {
        if(err) {
            res.send("Token Missing Or Wrong");
        } else {
            res.json({
                authdata
            });
        }
    });
});

function verifyToken(req, res, next){
    const bearerHeader = req.headers['authorization'];

    if(typeof bearerHeader !== 'undefined'){
        const bearer = bearerHeader.split(' ');
        // Get token from array
        const bearerToken = bearer[1];
        // Set the token
        req.token = bearerToken;
        // Next middleware
        next();
    }else {
        res.json({
            message: 'Token Missing',
            token: req.headers
        });
    }
}

module.exports = router;