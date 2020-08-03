const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let user = {
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    mobile: {
        type: String,
        required: true
    },
    DOB: {
        type: Date,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    balance: {
        type: Number,
        default: 1000000
    },
    transactions: [{
        tdate: {
            type: Date
        },
        narration: {
            type: String
        },
        debit: {
            type: Number,
            default: null
        },
        credit: {
            type: Number,
            default: null
        },
        tid: {
            type: Number
        },
        updatedBal: {
            type: Number
        }
    }],
    trades: [{
        description: {
            type: String
        },
        quantity: {
            type: Number
        },
        symbol: {
            type: String
        },
        buyPrice: {
            type: Number
        },
        date: {
            type: Date
        }
    }]
}

// user.plugin(timestamp);
module.exports = mongoose.model('User',user);