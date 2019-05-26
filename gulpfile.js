const gulp = require('gulp');
const browserSync = require('browser-sync').create();
const del = require('del');
const rename = require('gulp-rename');
const template = require('gulp-template');
const concat = require('gulp-concat');
const autoprefixer = require('gulp-autoprefixer');
const sassLint = require('gulp-sass-lint');
const sass = require('gulp-sass');
const csso = require('gulp-csso');
const plumber = require('gulp-plumber');
const eslint = require('gulp-eslint');
const babel = require('gulp-babel');
const uglify = require('gulp-uglify');
const htmlmin = require('gulp-htmlmin');
const ghPages = require('gulp-gh-pages');

const apiKey = process.env.LIST_API || 'API key unavailable';

function browser(done) {
  browserSync.init({
    server: {
      baseDir: 'dist',
    },
    port: 9999,
  });
  done();
}

function clean(done) {
  del.sync('dist');
  done();
}

function css(done) {
  gulp
    .src('src/sass/**/*.scss')
    .pipe(plumber())
    .pipe(sassLint())
    .pipe(sassLint.format())
    .pipe(sass())
    .pipe(autoprefixer())
    .pipe(csso())
    .pipe(rename('build.min.css'))
    .pipe(gulp.dest('dist/css'));
  done();
}

function js(done) {
  gulp
    .src('config/config.tmpl.js')
    .pipe(plumber())
    .pipe(
      template({
        apiKey: JSON.stringify(apiKey),
      }),
    )
    .pipe(gulp.src('src/js/*.js', { passthrough: true }))
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(babel({ presets: ['@babel/env'] }))
    .pipe(concat('build.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('dist/js'));
  done();
}

function html(done) {
  gulp
    .src('src/*.html')
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(gulp.dest('dist'));
  done();
}

function watch(done) {
  gulp.watch('src/sass/**/*.scss', gulp.series(css)).on('change', browserSync.reload);
  gulp.watch('src/js/**/*.js', gulp.series(js)).on('change', browserSync.reload);
  gulp.watch('src/*.html', gulp.series(html)).on('change', browserSync.reload);
  done();
}

const build = gulp.series(clean, gulp.parallel(css, js, html));
const serve = gulp.series(build, browser, watch);

exports.serve = serve;
exports.build = build;
