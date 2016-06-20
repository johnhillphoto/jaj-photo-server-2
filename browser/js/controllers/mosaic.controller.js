'use strict'

app.controller('mosaicController1', function($scope, mosaicFactory, $sce){
  // $scope.mosaicIndex  = $stateParams.mosaicIndex;
  // console.log('loading')
  console.log('inside controller1');
  var builtTileSources = '/images/composed' + 1 + '.dzi';
  var viewer = OpenSeadragon({
      id: "openseadragon1",
      prefixUrl: "/images/",
      tileSources: builtTileSources
      // tileSources: "/images/composed1.dzi"

  });

});//end controller
