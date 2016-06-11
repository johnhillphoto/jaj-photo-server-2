var fs = require('fs');
var utilities = require('./utilities.js');
var Promise = require('bluebird');
// var getColors = require("get-image-colors");
var chroma = require("chroma-js");
// var color   = require('dominant-color');
// var sharp = require('sharp');
var gm = require('gm');
var imageMagick = gm.subClass({ imageMagick: true });
//promisified version of node-dir
var dir = Promise.promisify(require('node-dir').files);


//variable declarations
//define the size of the photo array
var numRows = 32;
var numCols = 40;
// var numRows = 6;
// var numCols = 5;
//set tracker for multiple mosaicNames
var numMosaics = 0;
var startTime;
var mosaicName = "";


// begin the process by scanning the directory for file names, then finding dominant colors
dir('uploads')
  .then(function(files){
    startTime = Date.now();
    var photoNames=[];
    files.forEach(function(file){
      if (file !== 'uploads/.DS_Store' & file !== 'uploads/.keep'){
      photoNames.push(file);}
    });
  // utilities.shuffle(photoNames);

  // begin finding dominant color;
  var arrayOfPromises = [];
  // for (var i = 0; i < 30; i++) {
    for (var i = 0; i < photoNames.length; i++) {
    arrayOfPromises.push(utilities.colorFind(photoNames[i]));
  }

  return Promise.all(arrayOfPromises)
  .then(function(res){
    // sorts by color value using compare function above
    res.sort(utilities.compare);
    photoNames = [];
    // now strip out the color values, reset photoNames with just filenames
    for (var i = 0; i < res.length; i++) {
      photoNames.push(res[i].filename);
    }
    var elapsedTime = utilities.timeCalc(startTime);
    console.log('Dominant colors in ' + elapsedTime + ' seconds.');
    return photoNames;
  }); //end then for Promise.all

}) //end then
.then(function(photoNames){
  startTime = Date.now();
  numMosaics ++ ;
  mosaicName = 'photoOutput/composed' + numMosaics + '.jpg';
  //this assembles the mosaic of images
  return utilities.buildMosaic(photoNames, numRows, numCols, mosaicName, startTime);
})//end then
.then(function(){
  startTime = Date.now();
  //this composes the shaped mask file over the mosaic
  return utilities.compose(mosaicName, startTime);
})
.then(function(incoming){
    startTime = Date.now();
    utilities.deepZoomPyramid(mosaicName, startTime);
});//end then
