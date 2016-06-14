/* jshint esversion:6 */
const getColors = require("get-image-colors");
const gm = require('gm');
const sharp = require('sharp');
const path = require('path');

var exports = module.exports = {};

  exports.buildMosaic = function(photoNames, numRows, numCols, mosaicName, startTime){
    mosaicName = path.join(__dirname, mosaicName);
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
                 gmstate.mosaic()  // Merges the images as a matrix
                 .write(mosaicName, function (err) {
                     if (err) {console.log(err);}
                     var elapsedTime = exports.timeCalc(startTime);
                     console.log('Mosaic-ed '+ mosaicName + ' mosaic in: ' + elapsedTime + ' seconds.');
                     resolve('done in buildMosaic');
                 });
             } catch(e){
                   reject(e);
             }
      });
  };//end buildMosaic

  exports.compose = function(mosaicName, startTime){
    mosaicName = path.join(__dirname, mosaicName);
      return new Promise(function(resolve,reject){
             try{
                // mosaicName = 'photoOutput/composed' + numMosaics + '.jpg';
                 gm(mosaicName)
                 .composite(path.join(__dirname,'photoOutput/mask2.tif'))
                 .write(mosaicName, function (err) {
                     if (err) {console.log('composing error',err);}
                     var elapsedTime = exports.timeCalc(startTime);
                     console.log('Masked '+ mosaicName + ' in ' + elapsedTime + ' seconds.');
                     resolve('done in composer');
                 });
             } catch(e){
                   reject(e);
             }
      });
  };//end compose

  exports.deepZoomPyramid = function(mosaicName, startTime){
    var mosaicNameSave = path.join(__dirname , '.././browser/images/' ,mosaicName.slice(12, 21));
    var incomingMosaicName = path.join(__dirname, mosaicName);
    return new Promise(function(resolve,reject){
           try{
             sharp(incomingMosaicName)
             .limitInputPixels(false)
             .withMetadata()
             .tile({
                 size: 800
               })
             .toFile(mosaicNameSave + '.dzi', function(err, info) {
                 if (err) {console.log('got an error inside deepZoomPyramid :' + err) ;}
                 else{
                   var elapsedTime = exports.timeCalc(startTime);
                   console.log('Completed Image Pyramid in: ' + elapsedTime + ' sec');
                   resolve(mosaicName);
                 }//end else
               });//end toFile
           } catch(e){
                 reject(e);
           }//end catch
    });//end Promise block
  };//end deepZoomPyramid

  //this utility finds the dominate color returns a promise
  exports.colorFind = function(photoName){
      return new Promise(function(resolve,reject){
             try{
               getColors(photoName, function(err, colors){
                 // colors is an array of colors
                 var newColors = colors.map(color => color.hsl());
                //  var newColorsLAB = colors.map(color => color.lab());
                //  console.log('newColorsLAB',newColorsLAB);
                 var photoWithHue = {filename: photoName, colVal : 0};
                   photoWithHue.colVal = Math.round(newColors[0][0]);
                  //  photoWithHue.colVal = Math.round(newColorsLAB[0][0]);

                    resolve(photoWithHue);
                  });
             } catch(e){
                   reject(e);
             }
      });
  };//end colorFind

  exports.timeCalc = function (startTime){
    var doneTime = Date.now();
    var elapsedTime = ( (doneTime - startTime) / 1000 );
    return elapsedTime;
  };

  //utility function to shuffle the photos randomly
  exports.shuffle = function (array) {
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
  };

  //used in sorting by color values
  exports.compare = function (a,b) {
  if (a.colVal < b.colVal)
    return -1;
  else if (a.colVal > b.colVal)
    return 1;
  else
    return 0;
  };
