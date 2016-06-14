/* jshint esversion:6 */
const fs = require('fs');
const utilities = require('./utilities.js');
var Promise = require('bluebird');
var path = require('path');
// var getColors = require("get-image-colors");
var chroma = require("chroma-js");
// var color   = require('dominant-color');
// var sharp = require('sharp');
var gm = require('gm');
var imageMagick = gm.subClass({ imageMagick: true });
//promisified version of node-dir
const dir = Promise.promisify(require('node-dir').files);
var exports = module.exports = {};

//variable declarations
//define the size of the photo array
// const numRows = 32;
// const numCols = 40;
// var numRows = 6;
// var numCols = 5;
const numRows = 23;
const numCols = 36;

//set tracker for multiple mosaicNames
var numMosaics = 0;
var startTime;
var mosaicName = "";
var sourcePhotosFolder = "";

exports.processMosaic = function processMosaic(){
  //   // get source of photos
  console.log('inside processMosaic');
  sourcePhotosFolder = fs.readFileSync(path.join(__dirname, './photoDestinationFolder.txt')).toString().slice(9);
  sourcePhotosFolder = path.join(__dirname, sourcePhotosFolder);

  // begin the process by scanning the directory for file names, then finding dominant colors
  return dir(sourcePhotosFolder)
    .then(function(files){
      startTime = Date.now();
      var photoNames=[];
      files.forEach(function(file){
        if (file !== sourcePhotosFolder + '.DS_Store' & file !== sourcePhotosFolder +'.keep'){
        photoNames.push(file);}
      });
    //below two lines for using shuffle mode
    utilities.shuffle(photoNames);
    return photoNames;

  //   // begin finding dominant color;
  //   var arrayOfPromises = [];
  //   // for (var i = 0; i < 30; i++) {
  //     for (var i = 0; i < photoNames.length; i++) {
  //     arrayOfPromises.push(utilities.colorFind(photoNames[i]));
  //   }
  // console.log('Finding Dominant Colors......');
  // return Promise.all(arrayOfPromises)
  // .then(function(res){
  // // sorts by color value using compare function above
  // res.sort(utilities.compare);
  //   photoNames = [];
  //  // now strip out the color values, reset photoNames with just filenames
  // for (var i = 0; i < res.length; i++) {
  //   photoNames.push(res[i].filename);
  //   }
  // var elapsedTime = utilities.timeCalc(startTime);
  //   console.log('Dominant colors in ' + elapsedTime + ' seconds.');
  //   return photoNames;
  //   }); //end then for Promise.all

  }) //end then
  .then(function(photoNames){
  console.log('Building Mosaic......');
  startTime = Date.now();
  numMosaics ++ ;
  mosaicName = 'photoOutput/composed' + numMosaics + '.jpg';
  //this assembles the mosaic of images
  return utilities.buildMosaic(photoNames, numRows, numCols, mosaicName, startTime);
  })//end then
  .then(function(){
    console.log('Masking Shape......');
    startTime = Date.now();
    //this composes the shaped mask file over the mosaic
    return utilities.compose(mosaicName, startTime);
  })
  .then(function(incoming){
    console.log('Creating Deep Zoom Pyramid......');
    startTime = Date.now();
    return  utilities.deepZoomPyramid(mosaicName, startTime);
   });//end then
};
