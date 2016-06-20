
app.config(function ($stateProvider, $urlRouterProvider, $locationProvider) {

    $stateProvider.state('/', {
      url: '/',
      // template: '<h1>test</h1>'
      templateUrl: 'views/welcome.html',
      controller: 'welcomeController'
    });
    $stateProvider.state('photoMosaic1', {
      url: '/photoMosaic1',
      templateUrl: 'views/photoMosaic1.html',
      controller: 'mosaicController1'
    });
    $stateProvider.state('photoMosaic2', {
      url: '/photoMosaic2',
      templateUrl: 'views/photoMosaic2.html',
      controller: 'mosaicController2'
    });


    // $stateProvider.state('photoMosaic', {
    //   url: '/photoMosaics',
    //   templateUrl: 'views/photoMosaic.html',
    //   // params: {
    //   //   mosaicIndex: 1
    //   // },
    //   // resolve: {
    //   //   mosaicIndex:	function($stateParams){
    //   //     return	$stateParams.mosaicIndex;
    //   //   }//end mosaicCount
    //   // },//end resolve
    //   //controller: 'mosaicController'
    //   controller: function($stateParams){
    //     console.log($stateParams)
    //   }
    // });
});
