'use strict';

angular.module('ngCordovaIonic')
.service('Notifier', function ($log, $cordovaToast, $cordovaReady) {
  this.info = function () {
    var text = _.toArray(arguments).join(' ');
    $cordovaReady().then(function () {
      $cordovaToast.showShortCenter(text)
      .then(function(success) {
        $log.info(text);
      }, function (error) {
        $log.error(error);
      });
    }, function () {
      $log.info(text);
    });
  };
  this.infoTop = function () {
    var text = _.toArray(arguments).join(' ');
    $cordovaReady().then(function () {
      $cordovaToast.showShortTop(text)
      .then(function(success) {
        $log.info(text);
      }, function (error) {
        $log.error(error);
      });
    }, function () {
      $log.info(text);
    });
  };
});
