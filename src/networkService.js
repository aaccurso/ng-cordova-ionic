'use strict';

angular.module('ngCordovaIonic')
.factory('networkService', function ($q, $log, $cordovaNetwork, $cordovaReady) {
  return function (connectionType) {
    var q = $q.defer();
    $cordovaReady().then(function () {
      if (connectionType ? $cordovaNetwork.getNetwork() === connectionType : $cordovaNetwork.isOnline()) {
        $log.debug('Cordova Online');
        q.resolve();
      } else {
        $log.debug('Cordova Offline');
        q.reject();
      }
    }, function () {
      // https://developer.mozilla.org/en-US/docs/Online_and_offline_events
      if (!navigator || navigator.onLine) {
        $log.debug('Online');
        q.resolve();
      } else {
        $log.debug('Offline');
        q.reject();
      }
    });
    return q.promise;
  };
});
