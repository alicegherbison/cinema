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
const rename = require('gulp-rename');

function browser(done) {
  browserSync.init({
    server: {
      baseDir: 'dist',
    },
    port: 9999
  })
  done();
}

function clean(done) {
  del.sync('dist');
  done();
}

function css(done) {
  gulp.src('src/sass/**/*.scss')
  .pipe(sass())
  .pipe(csso())
  .pipe(rename('build.min.css'))
  .pipe(gulp.dest('dist/css'))
  done();
}

function js(done) {
  gulp.src('src/js/*.js')
  .pipe(babel({
    presets: ['@babel/env']
  }))
  .pipe(concat('build.min.js'))
  .pipe(uglify())
  .pipe(gulp.dest('dist/js'));
  done();
};

function html(done) {
  gulp.src('src/*.html')
  .pipe(htmlmin({ collapseWhitespace: true }))
  .pipe(gulp.dest('dist'));
  done();
}

function watch(done) {
  gulp.watch('src/sass/**/*.scss', gulp.series('css')).on('change', browserSync.reload);
  gulp.watch('src/js/**/*.js', gulp.series('js')).on('change', browserSync.reload);
  gulp.watch('src/*.html', gulp.series('html')).on('change', browserSync.reload);
  done();
}

const build = gulp.series(clean, css, js, html);
const serve = gulp.series(build, browser, watch);
exports.serve = serve;
exports.build = build;


// build tasks
// function css(done) {
//   gulp.src('src/sass/**/*.scss')
//   .pipe(sass())
//   .pipe(concat('build.min.css'))
//   .pipe(csso())
//   .pipe(gulp.dest('dist/css'))
//   done();
// }

// deploy tasks

// unfinished/tests
// function css() {
//   return gulp.src(['node_modules/bootstrap/scss/bootstrap.scss', 'src/sass/**/*.scss'])
//   .pipe(sass())
//   .pipe(concat('build.min.css'))
//   .pipe(csso())
//   .pipe(gulp.dest('dist/css'))
// }

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
