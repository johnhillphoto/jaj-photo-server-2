var fs = require('fs');
var Promise = require('bluebird');
var getColors = require("get-image-colors");
var chroma = require("chroma-js");
// var color   = require('dominant-color');
var sharp = require('sharp');
var gm = require('gm');
var imageMagick = gm.subClass({ imageMagick: true });
//promisified version of node-dir
var dir = Promise.promisify(require('node-dir').files);

//variable declarations
//define the size of the photo array
var numRows = 32;
var numCols = 40;
// var numRows = 5;
// var numCols = 5;
//set tracker for multiple mosaicNames
var numMosaics = 0;
var startTime;
var mosaicName = "";

function timeCalc(){
  var doneTime = Date.now();
  var elapsedTime = ( (doneTime - startTime) / 1000 );
  return elapsedTime;
}

//utility function to shuffle the photos randomly
function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;
  // While there remain elements to shuffle...
  while (0 !== currentIndex) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }
  return array;
}

buildMosaic = function(photoNames){
    return new Promise(function(resolve,reject){
           try{
             var col=0;
             var gmstate = gm();
             var photoNum = 0;
             for (var j = 0; j < numCols; j++) {
               col = j*800;
               for (var i = 0; i < numRows; i++) {
                 var pixelsDown = i*800;
                 gmstate.in('-page', '+'+col+'+'+pixelsDown);
                 gmstate.in(photoNames[photoNum]);
                 if (photoNum < photoNames.length){
                   photoNum++;
                 } else {  photoNum = 0; }
               }//inner column generator
             }//outer moves column over one
             numMosaics ++ ;
             mosaicName = 'photoOutput/composed' + numMosaics + '.jpg';
               gmstate.mosaic()  // Merges the images as a matrix
               .write(mosaicName, function (err) {
                   if (err) {console.log(err);}
                   var elapsedTime = timeCalc();
                   console.log('Completed '+ mosaicName + ' mosaic in: ' + elapsedTime + ' sec');
                   resolve('done in buildMosaic');
               });
           } catch(e){
                 reject(e);
           }
    });
};//end buildMosaic

compose = function(){
    return new Promise(function(resolve,reject){
           try{
              mosaicName = 'photoOutput/composed' + numMosaics + '.jpg';
               gm(mosaicName)
               .composite('photoOutput/mask2.tif')
              //  .geometry(16000,12800)
               .write(mosaicName, function (err) {
                   if (err) {console.log('composing error',err);}
                   var elapsedTime = timeCalc();
                  numMosaics ++;
                   console.log('Composed '+ mosaicName + ' in ' + elapsedTime + ' seconds');
                   resolve('done in composer');
               });
           } catch(e){
                 reject(e);
           }
    });
};//end compose

colorFind = function(photoName){
    return new Promise(function(resolve,reject){
           try{
             getColors(photoName, function(err, colors){
               // colors is an array of colors
               // var newColors = colors.map(color => color.css('hsl'));
               var newColors = colors.map(color => color.hsl());
               var photoWithHue = {filename: photoName, colVal : 0};
                 photoWithHue.colVal = Math.round(newColors[0][0]);
                  resolve(photoWithHue);
                });
           } catch(e){
                 reject(e);
           }
    });
};//end colorSort

// begin the process by scanning the directory for file names
dir('uploads')
  .then(function(files){
    startTime = Date.now();
    var photoNames=[];
    files.forEach(function(file){
      if (file !== 'uploads/.DS_Store' & file !== 'uploads/.keep'){
      photoNames.push(file);}
  });
  // shuffle(photoNames);

  //used in sorting by color values
  function compare(a,b) {
  if (a.colVal < b.colVal)
    return -1;
  else if (a.colVal > b.colVal)
    return 1;
  else
    return 0;
}

  // begin finding dominant color;
startTime = Date.now();
var arrayOfPromises = [];
for (var i = 0; i < photoNames.length; i++) {
  arrayOfPromises.push(colorFind(photoNames[i]));
}
return Promise.all(arrayOfPromises)
.then(function(res){
  // sorts by color value using compare function above
  res.sort(compare);
  photoNames = [];
  // strip out the color values, reset photoNames with just filenames
  for (var i = 0; i < res.length; i++) {
    photoNames.push(res[i].filename);
  }
  return photoNames;



});
// console.log('result', result);
// return result;



// console.log('photoNamesPairs', photoNamesPairs);

  // return photoNames;
})
// .then(function(photoNames){
//   console.log('photoNames',photoNames);
//   var elapsedTime = timeCalc();
//   console.log('Time to find dominant color', elapsedTime);
// });


.then(function(photoNames){
  return buildMosaic(photoNames);
})//end then
.then(function(){
  startTime = Date.now();
  return compose();
})
.then(function(incoming){
    startTime = Date.now();
    sharp(mosaicName)
    .limitInputPixels(false)
    .withMetadata()
    .tile({
        size: 800
      })
    .toFile('.././browser/images/composed.dzi', function(err, info) {
        if (err) {console.log('got an error :' + err) ;}
        else{
          var elapsedTime = timeCalc();
          console.log('Completed Image Pyramid in: ' + elapsedTime + ' sec');
        }
      });
});//end then
