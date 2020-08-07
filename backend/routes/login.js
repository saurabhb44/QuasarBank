const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/userSchema');
let router = express.Router();
const jwt = require('jsonwebtoken');

router.post('/login', async (req, res) => {
    try{
        let {email, password} = req.body;
        const user = await User.findOne({email});
        bcrypt.compare(password, user.password, (err, isMatch) => {
            if(err) throw err;
            if(isMatch){
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
            }else{
                res.status(200).send("Authentication Failed");
            }
        });
    }catch (err){
        res.send("Authentication Failed");
        console.log("User Not Found");
    }
});

module.exports = router;