var gulp = require('gulp');
var del = require('del');
var useref = require('gulp-useref');
var gulpIf = require('gulp-if');
var uglify = require('gulp-uglify');
var runSequence = require('gulp4-run-sequence');
var deploy = require('gulp-gh-pages');

gulp.task('clean:dist', function() {
  return del.sync('dist');
});

gulp.task('useref', function(){
  return gulp.src('src/*.html')
    .pipe(useref())
    .pipe(gulpIf('*.js', uglify()))
    .pipe(gulp.dest('dist'))
});

gulp.task('build', function(callback) {
  runSequence('clean:dist', 'useref', callback)
});

gulp.task('deploy', function() {
  return gulp.src("./dist/**/*")
    .pipe(deploy())
});
