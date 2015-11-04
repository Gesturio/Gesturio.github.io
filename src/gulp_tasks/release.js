/**
 * Created by Aitem on 04.11.2015.
 */
var gulp = require('gulp'),
  jade = require('gulp-jade'),
  assetRev = require('gulp-asset-rev-jade'),
  rev = require('gulp-rev'),
  clean = require('gulp-rimraf'),
  less = require('gulp-less'),
  minifyCSS = require('gulp-minify-css'),
  uglify = require('gulp-uglify'),
  coffee = require('gulp-coffee'),
  gutil = require('gulp-util'),
  zip = require('gulp-zip'),

  release = "./dist/";

gulp.task('clear_release', function() {
  return gulp.src(release)
    .pipe(clean({force: true}))
});
gulp.task('r_jade', function() {
  return gulp.src('./src/views/*.jade')
    .pipe(jade())
    .pipe(assetRev({connecter: '-'}))
    .pipe(gulp.dest(release + 'views'));
});
gulp.task('r_jade_index', function(){
  return gulp.src('./src/index.jade')
    .pipe(jade())
    .pipe(gulp.dest(release));
});
gulp.task('r_less', function(){
  return gulp.src('./src/style/style.less')
    .pipe(less())
    .pipe(assetRev({connecter: '-'}))
    .pipe(minifyCSS())
    .pipe(gulp.dest(release+'css'));
});
gulp.task('r_coffee', function(){
  return gulp.src('./src/js/*.coffee')
    .pipe(coffee({bare: true}).on('error', gutil.log))
    .pipe(uglify({mangle: false}))
    .pipe(gulp.dest(release+'js/'));
});
gulp.task('r_js', function(){
  return gulp.src(['./src/js/**/*.js', '!./src/js/**/*.min.js'])
    .pipe(uglify({mangle: false}))
    .pipe(gulp.dest(release+'js/'));
});
gulp.task('r_js_min', function(){
  return gulp.src(['./src/js/**/*.min.js'])
    .pipe(gulp.dest(release+'js/'));
});
gulp.task('r_img', function(){
  return gulp.src('./src/img/*')
    .pipe(rev())
    .pipe(gulp.dest(release+'img/'));
});
gulp.task('r_dic', function(){
  return gulp.src('./src/img/dic/**/*')
    .pipe(gulp.dest(release+'img/dic/'))
});
gulp.task('r_zip', function () {
  return gulp.src(release+"**/*.*")
    .pipe(zip('release.zip'))
    .pipe(gulp.dest(release));
});
