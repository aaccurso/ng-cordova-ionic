var gulp = require('gulp'),
  gulpConfig = require('./config/gulp.config'),
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
