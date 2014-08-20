'use strict';
describe('$cordovaReady', function() {
  var $window, $rootScope, $cordovaReady;

  beforeEach(module('ionic', 'ngCordovaIonic'));
  beforeEach(inject(function(_$window_, _$rootScope_, _$cordovaReady_) {
    $window = _$window_;
    $rootScope = _$rootScope_;
    $cordovaReady = _$cordovaReady_;
  }));
  afterEach(function () {
    delete $window.cordova;
  });

  it('should reject promise when not web view', function() {
    var error = jasmine.createSpy('error');
    $cordovaReady().then(angular.noop, error);
    $rootScope.$digest();
    expect(error).toHaveBeenCalled();
  });

  it('should resolve promise when cordova is defined', function() {
    var success = jasmine.createSpy('success');
    $window.cordova = {};
    $cordovaReady().then(success);
    $rootScope.$digest();
    expect(success).toHaveBeenCalled();
  });
});
