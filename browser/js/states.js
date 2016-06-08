app.config(function ($stateProvider, $urlRouterProvider) {
  $stateProvider
    .state('photoMosaic', {
      url: '/photoMosaic',
      templateUrl: 'views/photoMosaic.html',
    });
    $urlRouterProvider.otherwise("/");
});
