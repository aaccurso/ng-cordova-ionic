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
  var q = $q.defer();
  var getFilePath = function (filesystem, fileName) {
    return filesystem.root.toURL() + "\/" + fileName;
  };

  $cordovaReady().then(function () {
    $window.requestFileSystem(
      LocalFileSystem.PERSISTENT,
      0, // Unlimited storage size
      function (filesystem) {
        $log.debug(filesystem);
        q.resolve(filesystem);
      },
      function (error) {
        $log.error(error);
        q.reject(error);
    });
  });

  fileSystemService.getFilesystem = function () {
    return q.promise;
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
          // File exists
          q.resolve(fileEntry);
        },
        function () {
          // File doesn't exist
          q.resolve(filesystem);
        }
      );
      return q.promise;
    });
  };
  fileSystemService.downloadFile = function (uri, fileName) {
    return fileSystemService.checkFile(fileName)
    .then(function (fileEntry) {
      var q = $q.defer();
      var filePath;
      // If file exists remove it
      if (fileEntry.isFile) {
        filePath = fileEntry.toURL();
        fileEntry.remove(function () {
          q.resolve(filePath);
        }, function (error) {
          $log.error(error);
          q.reject(error);
        });
      } else {
        filePath = getFilePath(filesystem, fileName);
        q.resolve(filePath);
      }
      return q.promise;
    })
    .then(function (filePath, trustAllHosts, options) {
      var q = $q.defer();
      var transfer = new FileTransfer();
      transfer.onprogress = function (progressEvent) {
        if (progressEvent.lengthComputable) {
          q.notify(Math.round(progressEvent.loaded / progressEvent.total * 100));
        } else {
          q.notify('...');
        }
      };
      transfer.download(
        encodeURI(uri),
        filePath,
        function (success) {
          $log.debug(success);
          q.resolve(success);
        },
        function (error) {
          $log.error(error);
          q.reject(error);
        },
        trustAllHosts,
        options
      );
      return q.promise;
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
.factory('notifier', ["$log", "$cordovaToast", "$cordovaReady", function ($log, $cordovaToast, $cordovaReady) {
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
