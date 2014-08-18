'use strict';

angular.module('ngCordovaIonic')
.factory('$cordovaReady', function ($q, $ionicPlatform) {
  return function () {
    return $ionicPlatform.ready()
    .then(function () {
      if (ionic.Platform.isWebView()) {
        return $q.resolve();
      } else {
        return $q.reject('Not cordova.');
      }
    });
  };
});
