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
const csso = require('gulp-csso');
const browserSync = require('browser-sync').create();

function clean(done) {
  del.sync('dist');
  done();
}

// development tasks

function sassify(done) {
  gulp.src('src/sass/**/*.scss')
  .pipe(sass())
  .pipe(browserSync.reload({stream:true}))
  .pipe(gulp.dest('src/css'))
  done();
}

function watch(done) {
  gulp.watch('src/sass/**/*.scss', gulp.series('sassify'));
  gulp.watch('src/*.html', browserSync.reload); 
  gulp.watch('src/js/**/*.js', browserSync.reload); 
  done();
}

function browser(done) {
  browserSync.init({
    server: {
      baseDir: 'src',
    },
    port: 9999
  })
  done();
}

const serve = gulp.series(gulp.parallel(browser, sassify), watch);
exports.default = serve;

// build tasks
function css(done) {
  gulp.src('src/sass/**/*.scss')
  .pipe(sass())
  .pipe(concat('build.min.css'))
  .pipe(csso())
  .pipe(gulp.dest('dist/css'))
  done();
}

// deploy tasks

// unfinished/tests
// function css() {
//   return gulp.src(['node_modules/bootstrap/scss/bootstrap.scss', 'src/sass/**/*.scss'])
//   .pipe(sass())
//   .pipe(concat('build.min.css'))
//   .pipe(csso())
//   .pipe(gulp.dest('dist/css'))
// }

function js() {
  return gulp.src('src/js/*.js')
  .pipe(babel({
    presets: ['@babel/env']
  }))
  .pipe(concat('build.min.js'))
  .pipe(uglify())
  .pipe(gulp.dest('dist/js'));
};

function html() {
  return gulp.src('src/*.html')
  .pipe(htmlmin({ collapseWhitespace: true }))
  .pipe(gulp.dest('dist'));
}

function jsTest() {
  return gulp.src('src/*.html')
  .pipe(useref())
  .pipe(gulpIf('*.js', babel({
    presets: ['@babel/env']
  })))
  .pipe(gulpIf('*.js', uglify()))
  .pipe(gulp.dest('dist'));
}

function tryUsemin() {
  return gulp.src('src/*.html')
  .pipe(usemin({
    html: [ htmlmin({ collapseWhitespace: true }) ],
    js: [ babel({ presets: ['@babel/env'] }), uglify() ],
  }))
  .pipe(gulp.dest('dist'));
}

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
exports.css = css;
exports.clean = clean;
exports.html = html;
exports.sassify = sassify;
exports.watch = watch;

//notes

// development
// spin up browserSync (this is the server)
// watch compiles the sass to css on save

// build
// compile sass, minify
// convert js to es5, minify
// minify html
// put all into dist folder

// deploy
// go via gh-pages
