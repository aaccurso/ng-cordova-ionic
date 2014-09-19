'use strict';

angular.module('ngCordovaIonic', ['ngCordova']);

'use strict';

angular.module('ngCordovaIonic')
.factory('$cordovaReady', ["$q", "$ionicPlatform", function ($q, $ionicPlatform) {
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
}]);

'use strict';

angular.module('ngCordovaIonic')
.factory('fileSystemService', ["$window", "$q", "$ionicPlatform", "$cordovaReady", "$log", function ($window, $q, $ionicPlatform, $cordovaReady, $log) {
  var fileSystemService = {};
  var getFilePath = function (filesystem, fileName) {
    return filesystem.root.toURL() + "\/" + fileName;
  };

  fileSystemService.getFilesystem = function () {
    return $cordovaReady().then(function () {
      var q = $q.defer();
      $window.requestFileSystem(
        LocalFileSystem.PERSISTENT,
        0, // Unlimited storage size
        function (filesystem) {
          $log.debug('Filesystem', filesystem);
          q.resolve(filesystem);
        },
        function (error) {
          $log.error('Filesystem error', error);
          q.reject(error);
      });
      return q.promise;
    });
  };
  fileSystemService.getFilePath = function (fileName) {
    // TODO: check if file exists using checkFile
    return fileSystemService.getFilesystem()
    .then(function (filesystem) {
      return getFilePath(filesystem, fileName);
    });
  };
  fileSystemService.checkFile = function (fileName) {
    return fileSystemService.getFilesystem()
    .then(function (filesystem) {
      var q = $q.defer();
      filesystem.root.getFile(
        getFilePath(filesystem, fileName),
        {create: false},
        function (fileEntry) {
          $log.debug('File exists', fileEntry);
          q.resolve(fileEntry);
        },
        function () {
          $log.debug('File does not exists', filesystem);
          q.resolve(filesystem);
        }
      );
      return q.promise;
    });
  };
  fileSystemService.downloadFile = function (uri, fileName) {
    return fileSystemService.getFilesystem()
    .then(function (filesystem) {
      var q = $q.defer();
      var transfer = new FileTransfer();
      transfer.onprogress = function (progressEvent) {
        if (progressEvent.lengthComputable) {
          q.notify(Math.round(progressEvent.loaded / progressEvent.total * 100));
        } else {
          q.notify(0);
        }
      };
      try {
        transfer.download(
          encodeURI(uri),
          getFilePath(filesystem, fileName),
          function (fileEntry) {
            $log.debug('File downloaded', fileEntry);
            q.resolve(fileEntry);
          },
          function (error) {
            $log.error('File download error', error);
            q.reject(error);
        });
      } catch (ex) {
        $log.error('File download error', ex.message);
        q.reject(ex);
      } finally {
        return q.promise;
      }
    });
  };
  fileSystemService.emptyFileSystem = function () {
    return fileSystemService.getFilesystem()
    .then(function (filesystem) {
      var dirReader = filesystem.root.createReader();
      dirReader.readEntries(function (entries) {
        _.forEach(entries, function (entry) {
          if (entry.isDirectory) {
            entry.removeRecursively(successHandler, errorHandler);
          } else {
            entry.remove(successHandler, errorHandler);
          }
        });
      }, errorHandler);
      function errorHandler (error) {
        $log.error('Remove error', error);
      };
      function successHandler (success) {
        $log.debug('File removed', success);
      };
    });
  };

  return fileSystemService;
}]);

'use strict';

angular.module('ngCordovaIonic')
.factory('localStorage', ["$window", function ($window) {
  var localStorage = {};
  localStorage.set = function (key, value) {
    $window.localStorage[key] = value || '';
  };
  localStorage.get = function (key, defaultValue) {
    return $window.localStorage[key] || defaultValue;
  };
  localStorage.setJson = function (key, json) {
    localStorage.set(key, angular.toJson(json  || []));
  };
  localStorage.getJson = function (key, defaultJson) {
    return angular.fromJson(localStorage.get(key, defaultJson || "[]"));
  };
  return localStorage;
}]);

'use strict';

angular.module('ngCordovaIonic')
.factory('networkService', ["$q", "$log", "$cordovaNetwork", "$cordovaReady", function ($q, $log, $cordovaNetwork, $cordovaReady) {
  return function (connectionType) {
    var q = $q.defer();
    $cordovaReady().then(function () {
      if (connectionType ? $cordovaNetwork.getNetwork() === Connection[connectionType] : $cordovaNetwork.isOnline()) {
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
}]);

'use strict';

angular.module('ngCordovaIonic')
.factory('notifier', ["$log", "$cordovaToast", "$cordovaReady", function ($log, $cordovaToast, $cordovaReady) {
  var notifier = {};

  notifier.toast = function (duration, position) {
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
  };
  notifier.info = function () {
    return _.partial(notifier.toast, 'short', 'top').apply(notifier, _.toArray(arguments));
  };

  return notifier;
}]);

'use strict';

angular.module('ngCordovaIonic')
.factory('popup', ["$log", "$cordovaDialogs", "$ionicPopup", "$cordovaReady", function ($log, $cordovaDialogs, $ionicPopup, $cordovaReady) {
  var popup = {};
  popup.show = function (title, subTitle, actions) {
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
  return popup;
}]);
