var gulp = require('gulp');
var jade = require('gulp-jade');
var assetRev = require('gulp-asset-rev-jade');
var rev = require('gulp-rev');
var ecstatic = require('ecstatic');
var serverport = 8000;
var  http = require('http');

gulp.task('build', function() {
  gulp.src('./src/img/*')
    .pipe(rev())
    .pipe(gulp.dest('./dist/img/'))

  gulp.src('./src/*.jade')
    .pipe(jade())
    .pipe(assetRev({connecter: '-'}))
    .pipe(gulp.dest('./dist/'))

  gulp.src('./src/**/*')
    .pipe(gulp.dest('./dist/'))
});

gulp.task('watch', function() {
    gulp.watch('./src/**/*', ['build']);
});

gulp.task('server', ['build', 'watch'], function() {
    http.createServer(ecstatic({ root: __dirname + '/dist', index: "index.html" })).listen(serverport);
});

