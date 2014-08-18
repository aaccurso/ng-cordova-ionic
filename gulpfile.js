var gulp = require('gulp'),
  concat = require('gulp-concat'),
  uglify = require('gulp-uglify'),
  rename = require('gulp-rename');


gulp.task('default', ['build']);

gulp.task('build', function() {
  return gulp.src('src/**/*.js')
    .pipe(concat('ng-cordova-ionic.js'))
    .pipe(gulp.dest('dist'))
    .pipe(uglify())
    .pipe(rename({
      extname: '.min.js'
    }))
    .pipe(gulp.dest('dist'));
});
