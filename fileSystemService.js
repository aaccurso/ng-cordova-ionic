'use strict';

angular.module('AbInbevEncuestas.services')
.factory('fileSystemService', function ($window, $q, $ionicPlatform, $cordovaReady, $log) {
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
        function (success) {
          $log.debug(success);
          q.resolve(success);
        },
        function (error) {
          $log.error(error);
          q.reject(error);
      });
      return q.promise;
    });
  };

  return fileSystemService;
});
