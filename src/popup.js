'use strict';

angular.module('ngCordovaIonic')
.factory('Popup', function ($log, $cordovaDialogs, $ionicPopup, $cordovaReady) {
  var Popup = {};
  Popup.show = function (title, subTitle, actions) {
    $cordovaReady().then(function () {
      $cordovaDialogs.confirm(
        subTitle,
        function (actionIndex) {
          var action = actions[actionIndex - 1];
          action && action.onTap ? action.onTap() : angular.noop();
        },
        title,
        _.map(actions, 'text')
      );
    }, function () {
      $ionicPopup.show({
        title: title,
        subTitle: subTitle,
        buttons: actions
      });
    });
  };
  return Popup;
});
