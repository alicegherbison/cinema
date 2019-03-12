var gulp = require('gulp');
var useref = require('gulp-useref');
var uglify = require('gulp-uglify');
var gulpIf = require('gulp-if');
var del = require('del');
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
