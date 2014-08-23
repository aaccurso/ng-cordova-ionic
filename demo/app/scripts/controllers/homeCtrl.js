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
.controller('HomeCtrl', function ($scope, $log, popup) {
  $scope.result = {};
  $scope.dialog = function () {
    popup.show(
      'This is the popup Title',
      'This is the popup Description',
      [{
        text: 'Action A',
        onTap: function () {
          $log.log('Action A');
          $scope.result.dialog = 'Action A';
        }
      }, {
        text:'Action B',
        onTap: function () {
          $log.log('Action B');
          $scope.result.dialog = 'Action B';
        }
      }]
    );
  };
});
