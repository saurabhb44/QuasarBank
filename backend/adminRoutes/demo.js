const mongoose = require('mongoose');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const Admin = require('../models/adminSchema');
const ID = require('../models/transactionIDs');

let admin = new Admin({
    name: 'Admin Default',
    accountID: '10001',
    password: "$2a$10$W9pfD9ECuKvceMW1M8QcH.V18.kIxcZbWOS23fHsmnrzYc1Kctp96"
});

let id = new ID({
    ID: '1'
});

admin.save();
id.save();

const PORT = 4500;

const app = express();

app.use(cors());
app.use(bodyParser.json());

mongoose.connect('mongodb://127.0.0.1:27017/Quasar', { useUnifiedTopology: true, useNewUrlParser: true});
const connection = mongoose.connection;

connection.once('open', () => {
    console.log('Coneection with mongodb is established');
});

app.listen(PORT, () => console.log('Server started on port'));