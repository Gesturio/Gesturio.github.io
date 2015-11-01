var gulp = require('gulp');
var jade = require('gulp-jade');
var assetRev = require('gulp-asset-rev-jade');
var rev = require('gulp-rev');
var ecstatic = require('ecstatic');
var serverport = 8000;
var http = require('http');
var clean = require('gulp-clean');
var dist = "./dist/";
var less = require('gulp-less');
var path = require('path');
var minifyCSS = require('gulp-minify-css');
var uglify = require('gulp-uglify');
var coffee = require('gulp-coffee');
var webserver = require('gulp-webserver');
var gutil = require('gulp-util');


gulp.task('clear', function() {
  gulp.src(dist)
    .pipe(clean({force: true}))
});

gulp.task('less', function () {
  gulp.src('./src/style/style.less')
    .pipe(less())
    .pipe(minifyCSS())
    .pipe(gulp.dest('./dist/'));
});

gulp.task('img', function(){
  gulp.src('./src/img/*')
    .pipe(rev())
    .pipe(gulp.dest('./dist/img/'))
});

gulp.task('js', function(){
  gulp.src('./src/js/*.coffee')
    .pipe(coffee({bare: true}).on('error', gutil.log))
    //.pipe(uglify())
    .pipe(gulp.dest('./dist/js/'));
  gulp.src('./src/js/**/*.js')
    //.pipe(uglify())
    .pipe(gulp.dest('./dist/js/'))
});

gulp.task('index', function(){
  gulp.src('./src/index.html')
    .pipe(gulp.dest('./dist/'))
});

gulp.task('build', ['index', 'less', 'js', 'img']);

gulp.task('watch', function() {
    gulp.watch('./src/**/*', ['build']);
});

gulp.task('server', ['build', 'watch'], function() {
  gulp.src('./dist/')
    .pipe(webserver({
      directoryListing: false,
      port: serverport,
      fallback: './index.html'
    }));
});

