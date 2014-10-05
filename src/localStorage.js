'use strict';

angular.module('ngCordovaIonic')
.factory('$localStorage', function ($window) {
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
});
