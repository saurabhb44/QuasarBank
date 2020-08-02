const mongoose = require('mongoose');
const schema = mongoose.Schema;

let id = {
    ID: {
        type:   String,
        default: "1"
    },
    num: {
        type: Number,
        default: 1000000
    }
}

module.exports = mongoose.model("ID", id);