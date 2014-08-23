'use strict';

angular.module('DemoNgCordovaIonic.controllers')
.config(function ($stateProvider, $urlRouterProvider) {
  $stateProvider
  .state('home', {
    url: '/home',
    templateUrl: 'templates/home.html',
    controller: 'HomeCtrl'
  });
  // Default state
  $urlRouterProvider.otherwise('/home');
})
.controller('HomeCtrl', function ($scope, $state, $log) {
});
