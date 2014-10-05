'use strict';

// Application modules.
angular.module('DemoNgCordovaIonic.controllers', ['ionic']);
angular.module('DemoNgCordovaIonic.services', []);
angular.module('DemoNgCordovaIonic.directives', []);
angular.module('DemoNgCordovaIonic.filters', []);

// Angular app main module
angular.module('DemoNgCordovaIonic', [
  'DemoNgCordovaIonic.controllers',
  'DemoNgCordovaIonic.services',
  'DemoNgCordovaIonic.directives',
  'DemoNgCordovaIonic.filters',
  'ionic',
  'ngCordovaIonic'
])
.config(function ($compileProvider, $logProvider) {
  $compileProvider.imgSrcSanitizationWhitelist(/^\s*(https?|file|blob|cdvfile|content):|data:image\//);
});
