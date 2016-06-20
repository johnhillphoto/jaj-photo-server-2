'use strict'

app.controller('mosaicController2', function($scope, mosaicFactory, $sce){
  // $scope.mosaicIndex  = $stateParams.mosaicIndex;
  // console.log('loading')
  console.log('inside controller2');
  var builtTileSources = '/images/composed' + 2 + '.dzi';
  var viewer = OpenSeadragon({
      id: "openseadragon1",
      prefixUrl: "/images/",
      tileSources: builtTileSources
      // tileSources: "/images/composed1.dzi"

  });

});//end controller
