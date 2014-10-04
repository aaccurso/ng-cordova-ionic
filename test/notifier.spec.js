'use strict';
describe('notifier', function() {
  var $rootScope, $cordovaToast, notifier;

  beforeEach(module('ionic', 'ngCordovaIonic'));
  beforeEach(inject(function(_$rootScope_, _$cordovaToast_, _notifier_) {
    $rootScope = _$rootScope_;
    $cordovaToast = _$cordovaToast_;
    notifier = _notifier_;
  }));

  it('should throw error when invalid duration or position', function() {
    expect(function () {
      return notifier.toast('duration', 'position', 'asd');
    }).toThrow();
    expect(function () {
      return notifier.toast('duration', 'top', 'asd');
    }).toThrow();
    expect(function () {
      return notifier.toast('short', 'position', 'asd');
    }).toThrow();
  });
});
