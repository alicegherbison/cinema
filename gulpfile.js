var gulp = require('gulp');
var del = require('del');
var useref = require('gulp-useref');
var gulpIf = require('gulp-if');
var babel = require("gulp-babel");
var uglify = require('gulp-uglify');
var runSequence = require('gulp4-run-sequence');
var deploy = require('gulp-gh-pages');

gulp.task('clean:dist', function(done) {
  del.sync('dist');
  done();
});

gulp.task('copy', function(done) {
  gulp.src('src/*.html')
  .pipe(gulp.dest('dist'));
  done();
});

gulp.task('babel', function(done){
  gulp.src('src/*.js')
  .pipe(babel())
  .pipe(gulp.dest('dist'));
  done();
});

gulp.task('argh', function(done) {
  gulp.src('src/*.js')
  .pipe(babel())
  .pipe(gulp.dest('dist'))
  done();
});

gulp.task('useref', function(done){
  gulp.src('src/*.html')
  .pipe(useref())
  .pipe(gulpIf('*.js', babel()))
  .pipe(gulpIf('*.js', uglify()))
  .pipe(gulp.dest('dist'));
  done();
});

gulp.task('build', function(done) {
  runSequence('clean:dist', 'useref');
  done();
});

gulp.task('deploy', function() {
  return gulp.src("./dist/**/*")
  .pipe(deploy())
});
