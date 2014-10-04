'use strict';

angular.module('ngCordovaIonic')
.factory('notifier', function ($log, $cordovaToast, $cordovaReady) {
  return {
    toast: toast,
    info: _.partial(toast, 'short', 'top')
  };
  function toast (duration, position) {
    var text = _(arguments).toArray().rest(2).join(' ');
    if ( !(_.contains(['short', 'long'], duration) &&
      _.contains(['top', 'center', 'bottom'], position)) ) {
      throw Error('Not valid duration: ' + duration + ' or position: ' + position);
    }
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
  }
});
