var gulpConfig = require('./gulp.config.js');

module.exports = {
  files: [
    // Include jQuery only for testing convience (lots of DOM checking for unit tests on directives)
    './bower_components/jquery/dist/jquery.js',
    './bower_components/ionic/release/js/ionic.bundle.js',
    './bower_components/angular-mocks/angular-mocks.js',
    './bower_components/ngCordova/dist/ng-cordova.js',
    './bower_components/lodash/dist/lodash.compat.js'
  ]
  .concat(gulpConfig.srcFiles)
  .concat(gulpConfig.testFiles),

  frameworks: ['jasmine'],
  reporters: ['progress'],
  port: 9876,
  colors: true,
  // possible values: 'OFF', 'ERROR', 'WARN', 'INFO', 'DEBUG'
  logLevel: 'INFO',
  autoWatch: true,
  captureTimeout: 60000,
  singleRun: false,

  // Start these browsers, currently available:
  // - Chrome
  // - ChromeCanary
  // - Firefox
  // - Opera (has to be installed with `npm install karma-opera-launcher`)
  // - Safari (only Mac; has to be installed with `npm install karma-safari-launcher`)
  // - PhantomJS
  // - IE (only Windows; has to be installed with `npm install karma-ie-launcher`)
  browsers: ['PhantomJS']
};
