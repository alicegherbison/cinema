var gulp = require('gulp');
var useref = require('gulp-useref');
var deploy = require('gulp-gh-pages');

gulp.task('useref', function(){
  return gulp.src('src/*.html')
    .pipe(useref())
    .pipe(gulp.dest('dist'))
});

gulp.task('deploy', function () {
  return gulp.src("./dist/**/*")
    .pipe(deploy())
});
