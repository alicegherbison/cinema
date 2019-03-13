const gulp = require('gulp');
const del = require('del');
const minify = require('gulp-minify');
const concat = require('gulp-concat');
const useref = require('gulp-useref');
const gulpIf = require('gulp-if');
const babel = require('gulp-babel');
const uglify = require('gulp-uglify');
const runSequence = require('gulp4-run-sequence');
const deploy = require('gulp-gh-pages');
const usemin = require('gulp-usemin');
const htmlmin = require('gulp-htmlmin');
const sass = require('gulp-sass');

function js() {
  return gulp.src('src/js/*.js')
  .pipe(babel({
    presets: ['@babel/env']
  }))
  .pipe(uglify())
  .pipe(concat('build.min.js'))
  .pipe(gulp.dest('dist/js'));
};

function jsTest() {
  return gulp.src('src/*.html')
  .pipe(useref())
  .pipe(gulpIf('*.js', babel({
    presets: ['@babel/env']
  })))
  .pipe(gulpIf('*.js', uglify()))
  .pipe(gulp.dest('dist'));
}

function trySass() {
  return gulp.src('src/sass/main.scss')
  .pipe(sass()) // Converts Sass to CSS with gulp-sass
  .pipe(gulp.dest('dist/css'))
}

function tryUsemin() {
  return gulp.src('src/*.html')
  .pipe(usemin({
    html: [ htmlmin({ collapseWhitespace: true }) ],
    js: [ babel({ presets: ['@babel/env'] }), uglify() ],
  }))
  .pipe(gulp.dest('dist'));
}

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
exports.jsTest = jsTest;
exports.tryUsemin = tryUsemin;
exports.trySass = trySass;