/* jshint esversion:6 */
const https = require('https');
const router = require('express').Router();
module.exports = router;
const Photo = require('../.././db/db.js').Photo;
const multer = require('multer');
const path = require('path');
const util = require("util");
const fs = require('fs');
const mv = require('mv');
const gm = require('gm');

const upload = multer({ dest: './server/uploads/',
filename:'test.jpg '});
var photoDestinationFolder = './server/show1/';
var photoCount = 0;
var photoShowCount  = 0;
var photoEventNames = [];
var mosaicInfo;
const photoProcess = require('../.././photoProcess.js');
var io = require('socket.io-client');
var socket;


// connect to admin server for socket events
https.get('https://nsync-dns.herokuapp.com', (res) => {
  res.on('data', (d) => {
    var socketIP = JSON.parse(d).socketIP;
    var builtUrl = 'http://' + socketIP + '/admin';
    socket = io(builtUrl);    // process.stdout.write(d);
    console.log('Connected to '+ builtUrl + ' socket server.');
  });
}).on('error', (e) => {
  console.error('Socket server error :',e);
});


// router.get('/', function(req, res, next){
//   //next two lines are for dev
//   mosaicInfo = {mosaicNum: photoShowCount, directURL: '/photoMosaic' + photoShowCount};
//   socket.emit('photo process done', mosaicInfo);
//   res.sendFile(path.join(__dirname, 'imageTemp/', 'Jasper_IMG_2683_smaller.jpg'));
// });

//this is used to send mosaicCount info etc to the front end
router.get('/mosaicCount', function(req, res, next){
  var eventInfoPack = {  count: photoShowCount, shows: photoEventNames};
  res.json(eventInfoPack);
});

// posting to /api/photo/initPhotoShow sets up photo event names, use x-www-form-urlencoded
// photoEventName = name , and token must equal 'bootsNCats'
router.post('/initPhotoShow', function (req, res, next) {
  if(req.body.token === 'bootsNCats'){
    photoCount = 0;
    photoShowCount++;
    photoDestinationFolder = './server/' + req.body.photoEventName + '/';
    photoEventNames.push(req.body.photoEventName);
    console.log('Photo Folder is now :', photoDestinationFolder);
    fs.writeFile('./server/photoDestinationFolder.txt', photoDestinationFolder, function (err) {
  if (err) return console.log(err);
});
  }
  res.sendStatus(200);
});

//this route accepts new photos
router.post('/', upload.single('myPhoto'), function (req, res, next) {
  console.log('Image Received', req.file);
  //gm crops image to rectangle 1100 pixels tall
  gm('./server/uploads/'+ req.file.filename).thumb(800, 1100, './server/uploads/'+ req.file.filename, 90, function(){
    //file is renamed and moved into proper show folder, which is also created by mv
    mv('./server/uploads/'+ req.file.filename,  photoDestinationFolder + '/'+ req.file.filename + '.jpg', {mkdirp: true}, function(){
      photoCount++;
      socket.emit('photo added', {count: photoCount});
      console.log('photoCount is now :', photoCount);
    });
  });
  res.sendStatus(200);
});

// posting to /api/photo/processPhotoShow processes the mosaic, use x-www-form-urlencoded
// photoEventName = name , and token must equal 'bootsNCats'
router.post('/processPhotoShow', function (req, res, next) {
  if(req.body.token === 'bootsNCats'){
    console.log('Processing Photo Mosaic, hit the route.');
    photoProcess.processMosaic()
    .then(function(mosaicNameSave){
      mosaicInfo = {mosaicNum: photoShowCount, mosaicName: mosaicNameSave, directURL: '/photoMosaic' + photoShowCount};
      console.log('mosaicInfo', mosaicInfo);
      socket.emit('photo process done', mosaicInfo);
      console.log('Wating to serve up the show.....',mosaicNameSave.slice(12).replace(".jpg", ".dzi"));
    });

  }
  res.sendStatus(200);
});
