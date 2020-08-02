const express = require("express");
const Admin = require("../models/adminSchema");
const User = require("../models/userSchema");
const ID = require("../models/transactionIDs");
const jwt = require("jsonwebtoken");
const bcrypt = require('bcryptjs');
let router = express.Router();

router.post("/deposit", verifyToken, (req, res) => {
    let transaction = req.body;
    jwt.verify(req.token, "adminSecret", async (err, adminData) => {
        try {
            if(err) {
                res.send('Token Incorrect');
            } else {
                const admin = await Admin.findOne({accountID: adminData.admin.accountID});
                const user = await User.findOne({email: transaction.toEmail});
                const tid = await ID.findOne({ID: "1"});

                bcrypt.compare(transaction.password, admin.password, async (err, isMatch) => {
                    if(err) throw err;
                    
                    if(!user){
                        res.send("Receiver not found");
                        return;
                    }
                    if(isMatch){
                        user.balance += Number(transaction.amount);
                        const userTransaction = {
                            tdate: transaction.tDate,
                            narration: "Deposit_" + admin.accountID,
                            credit: transaction.amount,
                            tid: tid.num,
                            updatedBal: user.balance
                        }
                        const adminTransaction = {
                            toEmail: transaction.toEmail,
                            tDate: transaction.tDate,
                            amount: transaction.amount,
                            tid: tid.num
                        }
                        user.transactions.push(userTransaction);
                        admin.transactions.push(adminTransaction);
                        tid.num++;
                        try {
                            await tid.save();
                            await user.save();
                            await admin.save();
                            jwt.sign({admin}, 'adminSecret', {expiresIn: '1h'} , (err, token) => {
                                res.status(200).json({
                                    token
                                });
                            });
                        } catch(err){
                            res.send(err);
                        }
                        
                        // res.send("Done...");
                    } else {
                        res.send("Incorrect Password");
                    }
                });
            }
        } catch(err){
            res.send("Failed to locate...!  " + err);
        }
    });
});


function verifyToken(req, res, next){
    let bearerHeader = req.headers["authorization"];
    
    if(typeof bearerHeader !== 'undefined'){
        bearer = bearerHeader.split(" ");
        bearerToken = bearer[1];
        req.token = bearerToken;
        next();
    } else {
        res.send("Token Not Found...");
    }
}
module.exports = router;