'use strict'

app.controller('mosaicController1', function($scope, mosaicFactory, $sce){
  // $scope.mosaicIndex  = mosaicIndex;
  // console.log('loading')
  console.log('inside controller for base');
  var builtTileSources = '/images/composed' + 1 + '.dzi';
  console.log('builtTileSources', builtTileSources);
  var viewer = OpenSeadragon({
      id: "openseadragon1",
      prefixUrl: "/images/",
      tileSources: builtTileSources
      // tileSources: "/images/composed1.dzi"

  });

});//end controller
