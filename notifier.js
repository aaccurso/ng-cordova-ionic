'use strict';

angular.module('AbInbevEncuestas.services')
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
  // @deprecated
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
  this.log = function () {
    var text = _.toArray(arguments).join(' ');
    $log.log(text);
  };
  this.success = function () {
    var text = _.toArray(arguments).join(' ');
    $log.info(text);
  };
  this.warning = function () {
    var text = _.toArray(arguments).join(' ');
    $log.warn(text);
  };
  this.error = function () {
    var text = _.toArray(arguments).join(' ');
    $log.error(text);
  };
});
