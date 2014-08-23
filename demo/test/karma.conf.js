module.exports = function(config) {
  config.set({
    basePath: '',
    frameworks: ['mocha', 'chai'],
    files: [
      '<%= yeoman.app %>/bower_components/angular/angular.js',
      '<%= yeoman.app %>/bower_components/angular-animate/angular-animate.js',
      '<%= yeoman.app %>/bower_components/angular-sanitize/angular-sanitize.js',
      '<%= yeoman.app %>/bower_components/angular-ui-router/release/angular-ui-router.js',
      '<%= yeoman.app %>/bower_components/ionic/release/js/ionic.js',
      '<%= yeoman.app %>/bower_components/ionic/release/js/ionic-angular.js',
      '<%= yeoman.app %>/bower_components/angular-mocks/angular-mocks.js',
      '<%= yeoman.app %>/bower_components/ngCordova/dist/ng-cordova.js',
      '<%= yeoman.app %>/bower_components/lodash/dist/lodash.compat.js',
      '<%= yeoman.app %>/bower_components/angular-md5/angular-md5.js',
      '<%= yeoman.app %>/<%= yeoman.scripts %>/**/*.js',
      'test/mock/**/*.js',
      'test/spec/**/*.js'
    ],
    autoWatch: false,
    reporters: ['dots', 'coverage'],
    port: 8080,
    singleRun: false,
    preprocessors: {
      // Update this if you change the yeoman config path
      'app/scripts/**/*.js': ['coverage']
    },
    coverageReporter: {
      reporters: [
        { type: 'html', dir: 'coverage/' },
        { type: 'text-summary' }
      ]
    }
  });
};
