const express = require('express');
const User = require('../models/userSchema');
const ID = require('../models/transactionIDs');
let router = express.Router();
const jwt = require('jsonwebtoken');

router.post('/buyShares', verifyToken, async (req, res) => {
    try{
        const shareInfo = req.body;
        jwt.verify(req.token, 'secretkey', async (err, authdata) => {
            let user = await User.findOne({email: authdata.user.email});
            let tid = await ID.findOne({ID: '1'});
            if(err) {
                res.send("Token Missing Or Wrong");
            } else {
                try{
                    user.balance -= Number(shareInfo.amount);
                    let userTransaction = {
                        tdate: shareInfo.date,
                        narration: "Share(s)_"+ shareInfo.symbol,
                        debit: shareInfo.amount,
                        tid: tid.num,
                        updatedBal: user.balance
                    }
                    let userShare = {
                        description: shareInfo.description,
                        quantity: shareInfo.quantity,
                        symbol: shareInfo.symbol,
                        buyPrice: shareInfo.unitPrice,
                        date: shareInfo.date
                    }
                    tid.num += 1;
                    user.trades.push(userShare);
                    user.transactions.push(userTransaction);
                    await user.save();
                    await tid.save();
                    jwt.sign({user:{
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
                    res.send("Failed");
                }
                
            }
        });
    } catch(err){
        res.send(err);
    }
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