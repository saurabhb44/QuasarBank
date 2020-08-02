const mongoose = require("mongoose");
const schema = mongoose.Schema;

let admin = {
    name: {
        type: String,
        require: true,
        trim: true
    },
    password: {
        type: String,
        require: true,
    },
    accountID: {
        type: String,
        require: true,
        trim: true,
        unique: true
    },
    transactions: [{
        tDate: {
            type: Date
        },
        toEmail: {
            type: String
        },
        amount: {
            type: Number,
            default: 0
        },
        tid: {
            type: Number
        }
    }]
}

module.exports = mongoose.model("Admin", admin);