var gulp = require('gulp'),
    jade = require('gulp-jade'),
    assetRev = require('gulp-asset-rev-jade'),
    rev = require('gulp-rev'),
    clean = require('gulp-clean'),
    less = require('gulp-less'),
    minifyCSS = require('gulp-minify-css'),
    uglify = require('gulp-uglify'),
    coffee = require('gulp-coffee'),
    webserver = require('gulp-webserver'),
    gutil = require('gulp-util'),
    zip = require('gulp-zip'),
    runSequence = require('run-sequence'),

    serverport = 8000,
    release = "./release/",
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
    return runSequence([
      'jade_index', 'jade_views',
      'less',
      'js_coffee', 'js_js',
      'img', 'img_dic']);
});

gulp.task('watch', function() {
  return gulp.watch('./src/**/*', ['build']);
});

gulp.task('default', function(cb) {
  return runSequence( 'clear',
    ['jade_index', 'jade_views',
      'less',
      'js_coffee', 'js_js',
      'img', 'img_dic'],
    'watch', 'server', cb);
});

gulp.task('server', function() {
  return gulp.src(dist)
    .pipe(webserver({
      directoryListing: false,
      port: serverport
    }));
});

gulp.task('release', function(){
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
    .pipe(uglify())
    .pipe(gulp.dest(release+'js/'));
  gulp.src('./src/js/**/*.js')
    .pipe(uglify())
    .pipe(gulp.dest(release+'js/'));
  gulp.src('./src/img/*')
    .pipe(rev())
    .pipe(gulp.dest(release+'img/'));
  gulp.src('./src/img/dic/**/*')
    .pipe(gulp.dest(release+'img/dic/'))
});
