const finnhub = require('finnhub');
 
const api_key = finnhub.ApiClient.instance.authentications['api_key'];
api_key.apiKey = "bshg7ufrh5r9t1gmtrtg" // Replace this
const finnhubClient = new finnhub.DefaultApi();
const symbol = require('./symbols.json');

// finnhubClient.quote("AA", (error, data, response) => {
//     console.log(data)
// });
var fs = require('fs');
// fs.writeFile("test.txt", jsonData, function(err) {
//     if (err) {
//         console.log(err);
//     }
// });
var obj = JSON.parse(fs.readFileSync('symbols.json', 'utf8'));
// console.log(obj);

obj.map((currValue) => {
    if(currValue.symbol.includes('AAP')){
        console.log(currValue);
    }
});

// finnhubClient.stockSymbols("US", (error, data, response) => {
//     fs.writeFile("symbols.json", JSON.stringify(data), function(err) {
//         if (err) {
//             console.log(err);
//         }
//     });
//     // console.log(typeof JSON.stringify(data));
// });

// finnhubClient.stockSymbols("US", (error, data, response) => {
//     if(error){
//         console.log(error);
//     }
//     data.map((currValue) => {
//         if(currValue.symbol.includes('MSFT'))
//             console.log(currValue);
//     });
// });