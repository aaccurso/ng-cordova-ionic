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
.factory('$filesystem', ["$window", "$q", "$ionicPlatform", "$cordovaReady", "$log", function ($window, $q, $ionicPlatform, $cordovaReady, $log) {
  return {
    getFilesystem: getFilesystem,
    getFilePath: getFilePath,
    checkFile: checkFile,
    downloadFile: downloadFile,
    emptyFilesystem: emptyFilesystem
  };
  function buildPath (filesystem, fileName, dirName) {
    return _.compact([filesystem.root.toURL(), dirName, fileName]).join("\/");
  }
  function getFilesystem () {
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
  }
  function getFilePath (fileName, dirName) {
    return getFilesystem()
    .then(function (filesystem) {
      return buildPath(filesystem, fileName, dirName);
    });
  }
  function checkFile (fileName, dirName) {
    return getFilesystem()
    .then(function (filesystem) {
      var q = $q.defer();
      filesystem.root.getFile(
        buildPath(filesystem, fileName, dirName),
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
  }
  function downloadFile (uri, fileName, dirName) {
    return getFilesystem()
    .then(function (filesystem) {
      var q = $q.defer();
      if (!dirName) resolveFilesystem();
      // Create directory
      filesystem.root.getDirectory(
        dirName,
        {create: true},
        resolveFilesystem,
        resolveFilesystem
      );
      return q.promise;
      function resolveFilesystem (result) {
        result && $log.debug('Create Dir:', result);
        q.resolve(filesystem);
      }
    })
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
          buildPath(filesystem, fileName, dirName),
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
  }
  function emptyFilesystem (condition) {
    return getFilesystem()
    .then(function (filesystem) {
      var dirReader = filesystem.root.createReader();
      dirReader.readEntries(function (entries) {
        _.forEach(entries, function (entry) {
          if (!condition || condition(entry)) {
            if (entry.isDirectory) {
              entry.removeRecursively(
                _.partialRight(successHandler, entry),
                _.partialRight(errorHandler, entry)
              );
            } else {
              entry.remove(
                _.partialRight(successHandler, entry),
                _.partialRight(errorHandler, entry)
              );
            }
          }
        });
      }, errorHandler);
      function errorHandler (error, entry) {
        $log.error('Remove error', entry.name, error);
      };
      function successHandler (success, entry) {
        $log.debug('File/Dir removed', entry.name, success);
      };
    });
  }
}]);

'use strict';

angular.module('ngCordovaIonic')
.factory('$localStorage', ["$window", function ($window) {
  return {
    set: set,
    get: get,
    setJson: setJson,
    getJson: getJson
  };
  function set (key, value) {
    $window.localStorage[key] = value || '';
  }
  function get (key, defaultValue) {
    return $window.localStorage[key] || defaultValue;
  }
  function setJson (key, json) {
    set(key, angular.toJson(json  || []));
  }
  function getJson (key, defaultJson) {
    return angular.fromJson(get(key, defaultJson || "[]"));
  }
}]);

'use strict';

angular.module('ngCordovaIonic')
.factory('$network', ["$q", "$log", "$cordovaNetwork", "$cordovaReady", function ($q, $log, $cordovaNetwork, $cordovaReady) {
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
.factory('$notifier', ["$log", "$cordovaToast", "$cordovaReady", function ($log, $cordovaToast, $cordovaReady) {
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
}]);

'use strict';

angular.module('ngCordovaIonic')
.factory('$popup', ["$log", "$cordovaDialogs", "$ionicPopup", "$cordovaReady", function ($log, $cordovaDialogs, $ionicPopup, $cordovaReady) {
  return {
    show: show
  };
  function show (title, subTitle, actions) {
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
  }
}]);
