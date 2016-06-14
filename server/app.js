var express = require('express');
// var Promise = require('bluebird');
var path = require('path');
var bodyParser = require('body-parser');
var app = express();
// var multer = require('multer');
// var cors = require('express-cors');
var cors = require('cors');


app.use('/browser', express.static(path.join(__dirname, '../browser')));
app.use('/images', express.static(path.join(__dirname, '../browser/images')));
app.use('/views', express.static(path.join(__dirname, '../browser/views')));

module.exports = app;
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
