'use strict';
describe('$cordovaReady', function() {
  var $window, $rootScope, $cordovaReady;

  beforeEach(module('ionic', 'ngCordovaIonic'));
  beforeEach(inject(function(_$window_, _$rootScope_, _$cordovaReady_) {
    $window = _$window_;
    $rootScope = _$rootScope_;
    $cordovaReady = _$cordovaReady_;
  }));

  it('should reject promise when not web view', function() {
    var platform;
    $cordovaReady().then(angular.noop,
    function (error) {
      platform = error;
    });
    $rootScope.$digest();
    expect(platform).toBe('Not cordova');
  });

  it('should resolve promise when cordova is defined', function() {
    var platform;
    $window.cordova = {};
    $cordovaReady().then(function (success) {
      platform = success;
    });
    $rootScope.$digest();
    expect(platform).toBe('Cordova');
  });
});
