var express = require('express');
// var Promise = require('bluebird');
var path = require('path');
var bodyParser = require('body-parser');
var app = express();
// var multer = require('multer');
// var cors = require('express-cors');
var cors = require('cors');
//below used to get ip addresses from local machine
var ifaces = require('os').networkInterfaces();
var request = require('request');


app.use('/browser', express.static(path.join(__dirname, '../browser')));
app.use('/images', express.static(path.join(__dirname, '../browser/images')));
app.use('/views', express.static(path.join(__dirname, '../browser/views')));

module.exports = app;

// var exports = module.exports = {};
// app.use(cors({
// 	allowedOrigins: [
// 		// 'github.com', 'google.com', 'http://localhost:3000', '*'
// 		'github.com', 'google.com', 'http://*.*'
//
// 	],
// 	allowedMethods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS']
// }));
app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/vendor', express.static(path.join(__dirname, '../node_modules')));
app.use('/browser', express.static(path.join(__dirname, '../browser')));
app.use('/api/photo', require('./routes/api/photoAPI.js'));

app.get('/', function(req, res, next){
  console.log('served up index.html');
  res.sendFile(path.join(__dirname, '../browser/views/', 'index.html'));
});

//error handling
app.use(function(err, req, res, next){
  console.log(err);
  res.status(err.status || 500);
});



/////begin find ip address
// Iterate over interfaces ...
var address = Object.keys(ifaces).reduce(function (result, dev) {
  return result.concat(ifaces[dev].reduce(function (result, details) {
    return result.concat(details.family === 'IPv4' && !details.internal ? [details.address] : []);
  }, []));
});
// Log the local ip address result
console.log('Local IP address is :', address.slice(3));

var headers = {
    'User-Agent':       'Super Agent/0.0.1',
    'Content-Type':     'application/x-www-form-urlencoded'
};
var builtIP = 'https://nsync-dns.herokuapp.com/photo?photoIP=' + address.slice(3) +':5000';
// Configure the request
var options = {
    url: builtIP,
    method: 'POST',
    headers: headers
};
//post ip address to Heroku DNS server
request(options, function (error, response, body) {
    if(error){console.log('error in here', error);}
    if (!error && response.statusCode == 200) {
        // Print out the response body
        console.log(address.slice(3)+':5000', body, 'to Heroku DNS');
    }
});
