'use strict';

angular.module('ngCordovaIonic')
.factory('$filesystem', function ($window, $q, $ionicPlatform, $cordovaReady, $log) {
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
});
