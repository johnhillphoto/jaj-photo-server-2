var express = require('express');
// var Promise = require('bluebird');
var path = require('path');
var bodyParser = require('body-parser');
var app = express();
// var multer = require('multer');
var cors = require('express-cors');



app.use('/browser', express.static(path.join(__dirname, '../browser')));
app.use('/images', express.static(path.join(__dirname, '../browser/images')));


module.exports = app;
app.use(cors({
	allowedOrigins: [
		'github.com', 'google.com', 'http://localhost:8100'
	]
}));


app.use('/vendor', express.static(path.join(__dirname, '../node_modules')));
app.use('/browser', express.static(path.join(__dirname, '../browser')));
app.use('/api/photo', require('./routes/api/photoAPI.js'));

app.get('/', function(req, res, next){
  res.sendFile(path.join(__dirname, '../browser/views/', 'index.html'));
});

//error handling
app.use(function(err, req, res, next){
  console.log(err);
  res.status(err.status || 500);
});
