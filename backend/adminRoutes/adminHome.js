const express = require("express");
const Admin = require("../models/adminSchema");
const User = require("../models/userSchema");
const jwt = require("jsonwebtoken");
let router = express.Router();

router.get("/adminHome", verifyToken, (req, res) => {
    jwt.verify(req.token, 'adminSecret', async (err, adminData) => {
        if(err) {
            res.send("Wrong Token");
        } else {
            const users = await User.find();
            res.json({
                adminData,
                users
            });
        }
    });
});

function verifyToken(req, res, next){
    let bearerHeader = req.headers["authorization"];
    
    if(typeof bearerHeader !== 'undefined'){
        bearer = bearerHeader.split(' ');
        bearerToken = bearer[1];
        req.token = bearerToken;
        next();
    } else {
        res.send("Token Not Found...");
    }
}

module.exports = router;