var gulp = require('gulp'),
  gulpConfig = require('./config/gulp.config'),
  karma = require('karma').server,
  karmaConf = require('./config/karma.config'),
  concat = require('gulp-concat'),
  ngAnnotate = require('gulp-ng-annotate'),
  uglify = require('gulp-uglify'),
  rename = require('gulp-rename');

gulp.task('default', ['build']);

gulp.task('build', function() {
  return gulp.src(gulpConfig.srcFiles)
    .pipe(concat('ng-cordova-ionic.js'))
    .pipe(ngAnnotate())
    .pipe(gulp.dest(gulpConfig.dist))
    .pipe(uglify())
    .pipe(rename({
      extname: '.min.js'
    }))
    .pipe(gulp.dest(gulpConfig.dist));
});

gulp.task('karma', function(done) {
  karmaConf.singleRun = true;
  karma.start(karmaConf, done);
});

gulp.task('karma-watch', function(done) {
  karmaConf.singleRun = false;
  karma.start(karmaConf, done);
});

gulp.task('watch', ['build'], function() {
  gulp.watch([gulpConfig.srcFiles, gulpConfig.testFiles], ['build']);
});
