const express = require('express');
const User = require('../models/userSchema');
let router = express.Router();
const jwt = require('jsonwebtoken');

router.get('/tradeHistory', verifyToken, (req, res) => {
    // try{
        jwt.verify(req.token, 'secretkey', async (err, authdata) => {
            if(err){
                res.send("Token Missing or Wrong...")
            }
            try{
                let user = await User.findOne({email: authdata.user.email});
                res.json({
                    trades: user.trades
                });
            } catch(err) {
                res.send("Error: " + err);
            }
            
        })
    // } catch (err){
    //     res.send("Error: " + err);
    // }
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