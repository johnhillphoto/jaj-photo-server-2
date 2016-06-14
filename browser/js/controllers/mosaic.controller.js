'use strict'

app.controller('mosaicController', function($scope, mosaicFactory, $sce, mosaicIndex){
  $scope.mosaicIndex  = mosaicIndex;
  var builtTileSources = '/images/composed' + mosaicIndex + '.dzi';
  var viewer = OpenSeadragon({
      id: "openseadragon1",
      prefixUrl: "/images/",
      tileSources: builtTileSources
      // tileSources: "/images/composed1.dzi"

  });

});//end controller
