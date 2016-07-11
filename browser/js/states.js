app.config(function ($stateProvider, $urlRouterProvider, $locationProvider) {

    $stateProvider.state('/', {
      url: '/',
      templateUrl: 'views/welcome.html',
      controller: 'welcomeController'
    });
    $stateProvider.state('photoMosaic', {
      url: '/photoMosaic/:mosaicIndex',
      templateUrl: 'views/photoMosaic.html',
      resolve: {
        mosaicIndex:	function($stateParams){
          return	$stateParams.mosaicIndex;
        }//end mosaicCount
      },//end resolve
      controller: 'mosaicController'
    });

});
