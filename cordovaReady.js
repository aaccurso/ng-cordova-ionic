'use strict';

angular.module('AbInbevEncuestas.services')
.factory('$cordovaReady', function ($q, $ionicPlatform) {
  return function () {
    var q = $q.defer();
    $ionicPlatform.ready(function () {
      if (ionic.Platform.isWebView()) {
        q.resolve();
      } else {
        q.reject('Not cordova.');
      }
    });
    return q.promise;
  };
});
