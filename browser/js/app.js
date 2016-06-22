
var app = angular.module('photoServerApp', ['ui.router']);

app.config(function ($urlRouterProvider, $locationProvider) {
  $locationProvider.html5Mode(true);

  $urlRouterProvider.otherwise("/");

});

// angular.module('photoServerApp').run(['$state', '$stateParams',
//     function($state, $stateParams) {
//         //this solves page refresh and getting back to state
// }]);

// app.config(function ($stateProvider, $urlRouterProvider, $locationProvider) {
//
//   $stateProvider.state('test', {
//     url: '/photo/:id',
//     template: '<h1>test</h1>',
//     // templateUrl: 'views/photoMosaic.html',
//
//     controller: function($stateParams){
//       console.log($stateParams);
//     }
//   });
// });
