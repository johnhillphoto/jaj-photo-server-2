'use strict'

app.controller('mosaicController', function($scope, mosaicFactory, $sce, mosaicIndex){
  // $scope.mosaicIndex  = mosaicIndex;
  console.log('mosaicIndex', mosaicIndex);
  console.log('inside controller for base');
  var builtTileSources = '/images/composed' + mosaicIndex + '.dzi';
  console.log('builtTileSources', builtTileSources);
  var viewer = OpenSeadragon({
      id: "openseadragon1",
      prefixUrl: "/images/",
      tileSources: builtTileSources
      // tileSources: "/images/composed1.dzi"

  });

});//end controller
