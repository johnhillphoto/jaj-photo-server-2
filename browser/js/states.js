
app.config(function ($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise("/");

    $stateProvider.state('/', {
      url: '/',
      // template: '<h1>test</h1>'
      templateUrl: 'views/welcome.html',
      controller: 'welcomeController'
    });
    $stateProvider.state('photoMosaic', {
      url: '/photoMosaic',
      templateUrl: 'views/photoMosaic.html',
      params: {
        mosaicIndex: 1
      },
      resolve: {
        mosaicIndex:	function($stateParams){
          return	$stateParams.mosaicIndex;
        }//end mosaicCount
      },//end resolve
      controller: 'mosaicController'
    });
});
