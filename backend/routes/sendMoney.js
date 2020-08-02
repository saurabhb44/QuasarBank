const User = require("../models/userSchema");
const ID = require("../models/transactionIDs");
const express = require('express');
const jwt = require("jsonwebtoken");
const router = express.Router();
const bcrypt = require('bcryptjs');

router.post('/send', verifyToken, (req, res) => {
    var target = req.body;
    jwt.verify(req.token, 'secretkey', async (err, authData) => {
        try {
            if(err){
                res.send("wrong token");
            } else {
                let sender = await User.findOne({email: authData.user.email});
                let receiver = await User.findOne({email: target.sentTo});
                let tid = await ID.findOne({ID: "1"});
                
                bcrypt.compare(target.password, sender.password, async (err, isMatch) => {
                    if(err) throw err;
                    
                    if(!receiver){
                        res.send("Receiver not found");
                        return;
                    }
                    if(isMatch){
                        if(sender.balance >= target.amount){
                            
                            sender.balance -= target.amount;
                            receiver.balance += Number(target.amount);

                            let senderTransaction = {
                                tdate: target.tdate,
                                narration: "Sent_to_" + target.sentTo,
                                debit: target.amount,
                                tid: tid.num,
                                updatedBal: sender.balance
                            }
                            
                            let receiverTransaction = {
                                tdate: target.tdate,
                                narration: "Received_from_" + sender.email,
                                credit: target.amount,
                                tid: tid.num,
                                updatedBal: receiver.balance
                            }
                            
                            tid.num++;
                            sender.transactions.push(senderTransaction);
                            receiver.transactions.push(receiverTransaction);
                            
                            try{
                                await tid.save();
                                await sender.save();
                                await receiver.save();
                                jwt.sign({user: sender}, 'secretkey', {expiresIn: '1h'} , (err, token) => {
                                    res.status(200).json({
                                        token
                                    });
                                });
                            }catch(err){
                                console.log("Error: " + err);
                            }
                        } else {
                            res.send("Insufficient Funds");
                        }
                        
                    } else {
                        res.send("Incorrect Password");
                    }
                });
            }
        } catch (err){
            res.send(err);
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