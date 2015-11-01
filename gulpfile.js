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
var zip = require('gulp-zip');
var amdOptimize = require('gulp-amd-optimizer');
var concat = require('gulp-concat');


//amdOptimize.src( {
//  configFile : gulp.src("./src/js/init.coffee").pipe(coffee())
//});

gulp.task('clear', function() {
  gulp.src(dist)
    .pipe(clean({force: true}))
});

gulp.task('jade', function () {
  gulp.src('./src/views/*.jade')
    .pipe(jade())
    .pipe(assetRev({connecter: '-'}))
    .pipe(gulp.dest('./dist/views'));
  gulp.src('./src/index.jade')
    .pipe(jade())
    .pipe(gulp.dest('./dist/'));
});

gulp.task('less', function () {
  gulp.src('./src/style/style.less')
    .pipe(less())
    .pipe(assetRev({connecter: '-'}))
    .pipe(gulp.dest('./dist/css'));
});

gulp.task('img', function(){
  gulp.src('./src/img/*')
    .pipe(rev())
    .pipe(gulp.dest('./dist/img/'))
  gulp.src('./src/img/dic/**/*')
    .pipe(gulp.dest('./dist/img/dic/'))
});

gulp.task('js', function(){
  gulp.src('./src/js/*.coffee')
    .pipe(coffee({bare: true}).on('error', gutil.log))
    .pipe(gulp.dest('./dist/js/'));
  gulp.src('./src/js/**/*.js')
    .pipe(gulp.dest('./dist/js/'))
  //
  //gulp.src(release+'js/**/*.js')
  //  .pipe(amdOptimize('app'))
  //  .pipe(concat('modules.js'))
  //  .pipe(gulp.dest('./dist/'));
});

gulp.task('build', ['jade', 'less', 'js', 'img']);

gulp.task('watch', function() {
  gulp.watch('./src/**/*', ['build']);
  gulp.watch('./src/**/*.jade', ['jade']);
});

gulp.task('server', ['build', 'watch'], function() {
  gulp.src('./dist/')
    .pipe(webserver({
      directoryListing: false,
      port: serverport
    }));
});

gulp.task('release', function(){
  var release = "./release/";
  gulp.src('./src/views/*.jade')
    .pipe(jade())
    .pipe(assetRev({connecter: '-'}))
    .pipe(gulp.dest(release+'views'));
  gulp.src('./src/index.jade')
    .pipe(jade())
    .pipe(gulp.dest(release));
  gulp.src('./src/style/style.less')
    .pipe(less())
    .pipe(assetRev({connecter: '-'}))
    .pipe(minifyCSS())
    .pipe(gulp.dest(release+'css'));
  gulp.src('./src/js/*.coffee')
    .pipe(coffee({bare: true}).on('error', gutil.log))
    //.pipe(uglify())
    .pipe(gulp.dest(release+'js/'));
  gulp.src('./src/js/**/*.js')
    //.pipe(uglify())
    .pipe(gulp.dest(release+'js/'));
  gulp.src('./src/img/*')
    .pipe(rev())
    .pipe(gulp.dest(release+'img/'));
  gulp.src('./src/img/dic/**/*')
    .pipe(gulp.dest(release+'img/dic/'))
});
