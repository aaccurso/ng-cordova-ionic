'use strict';

angular.module('ngCordovaIonic')
.factory('notifier', function ($log, $cordovaToast, $cordovaReady) {
  var notifier = {};

  notifier.toast = function (duration, position) {
    var text = _(arguments).toArray().rest(2).join(' ');
    return $cordovaReady().then(function () {
      return $cordovaToast.show(text, duration, position)
      .then(function(success) {
        $log.debug(success);
        return success;
      }, function (error) {
        $log.error(error);
        return error;
      });
    }, function () {
      $log.info(text);
      return text;
    });
  };
  notifier.info = function () {
    return _.partial(notifier.toast, 'short', 'position').apply(notifier, _.toArray(arguments));
  };

  return notifier;
});
