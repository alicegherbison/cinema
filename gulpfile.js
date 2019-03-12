const gulp = require('gulp');
const del = require('del');
const minify = require('gulp-minify');
const concat = require('gulp-concat');
const useref = require('gulp-useref');
const gulpIf = require('gulp-if');
const babel = require("gulp-babel");
const uglify = require('gulp-uglify');
const runSequence = require('gulp4-run-sequence');
const deploy = require('gulp-gh-pages');

function js() {
  return gulp.src('src/js/*.js')
  .pipe(concat('build.min.js'))
  .pipe(minify())
  .pipe(babel({
    presets: ['@babel/env']
  }))
  .pipe(gulp.dest('dist/js'));
};

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

exports.js = js;