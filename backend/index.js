const mongoose = require('mongoose');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
let register = require('./routes/register');
let login = require('./routes/login');
let dashboard = require('./routes/dashboard');
let update = require('./routes/update');
let adminLogin = require("./adminRoutes/adminLogin");
let adminHome = require("./adminRoutes/adminHome");
let adminTransaction = require("./adminRoutes/adminTransaction");
let sendMoney = require("./routes/sendMoney");
let buyShares = require('./routes/buyShares');
let tradeHistory = require('./routes/tradeHistory');
let sellShares = require('./routes/sellShares');

const PORT = 5000;

const app = express();

app.use(cors());
app.use(bodyParser.json());

mongoose.connect('mongodb://127.0.0.1:27017/Quasar', { useUnifiedTopology: true, useNewUrlParser: true});
const connection = mongoose.connection;

connection.once('open', () => {
    console.log('Coneection with mongodb is established');
});

app.use('/Quasar', register);
app.use('/Quasar', login);
app.use('/Quasar', dashboard);
app.use('/Quasar', update);
app.use('/Quasar', adminLogin);
app.use('/Quasar', adminHome);
app.use('/Quasar', adminTransaction);
app.use('/Quasar', sendMoney);
app.use('/Quasar', buyShares);
app.use('/Quasar', tradeHistory);
app.use('/Quasar', sellShares);
app.listen(PORT, () => console.log('Server started on port 5000'));