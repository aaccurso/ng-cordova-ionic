angular.module('ngCordovaIonic')
.factory('$cordovaReady', function ($q, $ionicPlatform) {
  return function () {
    var q = $q.defer();
    $ionicPlatform.ready(function () {
      if (ionic.Platform.isWebView()) {
        q.resolve('Cordova');
      } else {
        q.reject('Not cordova');
      }
    });
    return q.promise;
  };
});
