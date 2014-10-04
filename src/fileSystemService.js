'use strict';

angular.module('ngCordovaIonic')
.factory('fileSystemService', function ($window, $q, $ionicPlatform, $cordovaReady, $log) {
  return {
    getFilesystem: getFilesystem,
    getFilePath: getFilePath,
    checkFile: checkFile,
    downloadFile: downloadFile,
    emptyFileSystem: emptyFileSystem
  };
  function getFilePath (filesystem, fileName) {
    return filesystem.root.toURL() + "\/" + fileName;
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
  function getFilePath (fileName) {
    return getFilesystem()
    .then(function (filesystem) {
      return getFilePath(filesystem, fileName);
    });
  }
  function checkFile (fileName) {
    return getFilesystem()
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
  }
  function downloadFile (uri, fileName) {
    return getFilesystem()
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
  }
  function emptyFileSystem () {
    return getFilesystem()
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
  }
});
