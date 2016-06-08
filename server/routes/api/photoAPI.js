var router = require('express').Router();
module.exports = router;
var Photo = require('../.././db/db.js').Photo;
var multer = require('multer');
var path = require('path');
var util = require("util");
var fs = require('fs');
var upload = multer({ dest: './server/uploads/',
filename:'test.jpg '});
var gm = require('gm');

// function test(){
//   console.log('in here');
//   gm('./server/uploads/1c92c07d20b0bc98a2ae8cc2bda1c715.jpg')
//   .resize(200,200)
//   .write('./server/resized/resize.jpg', function (err) {
//     if (!err) console.log(' resized! ');
//     else(console.log(err));
//   });
// }
// test();


router.get('/', function(req, res, next){
  res.sendFile(path.join(__dirname, 'imageTemp/', 'Jasper_IMG_2683_smaller.jpg'));
});


router.post('/', upload.single('myPhoto'), function (req, res, next) {
  console.log(req.file);
  fs.renameSync('./server/uploads/'+ req.file.filename, './server/uploads/'+ req.file.filename + '.jpg');
  res.sendStatus(200);
});
// router.post('/',  function (req, res, next) {
//   console.log('req.body',req.body);
//   // fs.renameSync('./server/uploads/'+ req.file.filename, './server/uploads/'+ req.file.filename + '.jpg');
//   res.sendStatus(200);
//   // req.body will hold the text fields, if there were any
// });
