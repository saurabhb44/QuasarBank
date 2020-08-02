const bcrypt = require("bcryptjs");
const Admin = require("../models/adminSchema");
const express = require("express");
const jwt = require("jsonwebtoken");

let router = express.Router();

router.post("/adminLogin", async (req, res) => {
    try{
        let {accountID, password} = req.body;
        const admin = await Admin.findOne({accountID});
        bcrypt.compare(password, admin.password, (err, isMatch) => {
            if(err) throw err;
            if(isMatch){
                jwt.sign({admin}, 'adminSecret', {expiresIn: '1h'} , (err, token) => {
                    res.status(200).json({
                        token
                    });
                });
            } else {
                res.status(200).send("Invalid Credentials")
            }
        });
    } catch (err){
        res.send("Authentication Failed");
        console.log(err);
    }
});

module.exports = router;



