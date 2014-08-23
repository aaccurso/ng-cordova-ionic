var fs = require('fs');
var pkg = require('../package.json');

module.exports = {
  banner:
    '/*!\n' +
    ' * ngCordovaIonic v' + pkg.version + '\n' +
    ' * Copyright 2014 aaccurso <accurso.alan@gmail.com>\n' +
    ' * See LICENSE in this repository for license information\n' +
    ' */\n',
  closureStart: '(function(){\n',
  closureEnd: '\n})();',
  dist: 'dist',
  demo: 'demo/app/vendor',
  srcFiles: ['src/**/*.js'],
  testFiles: ['test/**/*.spec.js']
};
