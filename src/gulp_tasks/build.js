/**
 * Created by Aitem on 04.11.2015.
 */
var gulp = require('gulp'),
  jade = require('gulp-jade'),
  assetRev = require('gulp-asset-rev-jade'),
  rev = require('gulp-rev'),
  clean = require('gulp-rimraf'),
  less = require('gulp-less'),
  coffee = require('gulp-coffee'),
  webserver = require('gulp-webserver'),
  gutil = require('gulp-util'),
  runSequence = require('run-sequence'),

  serverport = 8000,
  dist = "./dist/";

gulp.task('clear', function() {
  return gulp.src(dist)
    .pipe(clean({force: true}))
});

gulp.task('jade_views', function () {
  return gulp.src('./src/views/*.jade')
    .pipe(jade())
    .pipe(assetRev({connecter: '-'}))
    .pipe(gulp.dest(dist+'views'));
});
gulp.task('jade_index', function () {
  return gulp.src('./src/index.jade')
    .pipe(jade())
    .pipe(gulp.dest(dist));
});

gulp.task('less', function () {
  return gulp.src('./src/style/style.less')
    .pipe(less())
    .pipe(assetRev({connecter: '-'}))
    .pipe(gulp.dest(dist+'css'));
});

gulp.task('img', function(){
  return gulp.src('./src/img/*')
    .pipe(rev())
    .pipe(gulp.dest(dist+'img/'))
});
gulp.task('img_dic', function(){
  return gulp.src('./src/img/dic/**/*')
    .pipe(gulp.dest(dist+'img/dic/'))
});

gulp.task('js_coffee', function(){
  gulp.src('./src/js/*.coffee')
    .pipe(coffee({bare: true}).on('error', gutil.log))
    .pipe(gulp.dest('./dist/js/'));
});
gulp.task('js_js', function(){
  return gulp.src('./src/js/**/*.js')
    .pipe(gulp.dest(dist+'js/'))
});

gulp.task('build', function(){
  return runSequence(
    'clear',
    [ 'jade_index', 'jade_views',
      'less',
      'js_coffee', 'js_js',
      'img', 'img_dic'
    ]);
});


gulp.task('server', function() {
  gulp.src(dist)
    .pipe(webserver({
      directoryListing: false,
      port: serverport
    }));
});
