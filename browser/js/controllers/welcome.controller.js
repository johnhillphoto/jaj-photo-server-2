 'use strict'

app.controller('welcomeController', function($scope, mosaicFactory, $sce, $timeout){

var pollTime = 10000;
$scope.mosaicNames = [];
$scope.mosaicCount = 0;

function getCount ()  {
  mosaicFactory.getCount()
  .then(function(data){
    $scope.mosaicCount = data.count;
    if(data.shows.length === 0){
      $scope.mosaicNames = ['No Mosaics Yet'];
      ///temp below
      // $scope.mosaicCount = 2;
    } else {
      $scope.mosaicNames = data.shows;
    }
    $timeout(function() {
            getCount();
        }, pollTime);
  });
}
getCount();


});//end controller
