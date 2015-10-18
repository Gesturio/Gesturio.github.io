var gulp = require('gulp');
var jade = require('gulp-jade');
var assetRev = require('gulp-asset-rev-jade');
var assets = require("gulp-assets");
var rev = require('gulp-rev');
var webserver = require('gulp-webserver');
var st = require('st');
var lr = require('tiny-lr');
var lrserver = lr();
var ecstatic = require('ecstatic');

var livereloadport = 3001,
    serverport = 8000;

var refresh = require('gulp-livereload'),
    http = require('http');

gulp.task('build', function() {
    gulp.src('./src/img/*')
        .pipe(rev())
        .pipe(gulp.dest('./dist/img/'))

    gulp.src('./src/*.jade')
        .pipe(jade())
        .pipe(assetRev({connecter: '-'}))
        .pipe(gulp.dest('./dist/'))
        .pipe(refresh(lrserver))
});

gulp.task('watch', function() {
    gulp.watch('./src/*.jade', ['build']);
});

gulp.task('server', ['watch'], function() {
    http.createServer(ecstatic({ root: __dirname + '/dist', index: "index.html" })).listen(serverport);

    lrserver.listen(livereloadport);
});

