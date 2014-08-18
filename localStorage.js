'use strict';

angular.module('AbInbevEncuestas.services')
.factory('localStorage', function ($window) {
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
});
