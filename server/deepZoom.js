var fs = require('fs');
var Promise = require('bluebird');
// var dir = require('node-dir');
var sharp = require('sharp');
var gm = require('gm');

var dir = Promise.promisify(require('node-dir').files);



// brew install graphicsmagick
// http://openseadragon.github.io/examples/creating-zooming-images/
// http://sharp.dimens.io/en/stable/#contributing
// http://www.vips.ecs.soton.ac.uk/index.php?title=Build_on_OS_X
// brew install vips --with-cfitsio --with-imagemagick --with-openexr --with-openslide --with-webp

function test(){
  sharp('./photoOutput/composed.jpg')
  .limitInputPixels(false)
  .withMetadata()
    .tile({
      size: 512
    })
    .toFile('./photoOutput/composed.dzi', function(err, info) {
      if (err) {console.log('got an error :' + err) ;}
      else{console.log('coolness :' + info);}
    });
}
test();

// var photoNames=[];
// dir('uploads')
//   .then(function(files){
//     files.forEach(function(file){
//       if (file !== 'uploads/.DS_Store' & file !== 'uploads/.keep'){
//       photoNames.push(file);}
//   });
//   return photoNames;
// });
