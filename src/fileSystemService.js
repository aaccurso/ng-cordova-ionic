'use strict';

angular.module('ngCordovaIonic')
.factory('fileSystemService', function ($window, $q, $ionicPlatform, $cordovaReady, $log) {
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
    return fileSystemService.checkFile(fileName)
    .then(function (fileEntry) {
      var q = $q.defer();
      var filePath;
      // If file exists remove it
      if (fileEntry.isFile) {
        filePath = fileEntry.toURL();
        fileEntry.remove(function (success) {
          $log.debug('File removed', success);
          q.resolve(filePath);
        }, function (error) {
          $log.error('File remove error', error);
          q.reject(error);
        });
      } else {
        filePath = getFilePath(fileEntry, fileName);
        q.resolve(filePath);
      }
      return q.promise;
    })
    .then(function (filePath) {
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
        function (fileEntry) {
          $log.debug('File downloaded', fileEntry);
          q.resolve(fileEntry);
        },
        function (error) {
          $log.error('File download error', error);
          q.reject(error);
      });
      return q.promise;
    });
  };

  return fileSystemService;
});
