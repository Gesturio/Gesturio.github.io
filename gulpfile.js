var gulp = require('gulp');
var jade = require('gulp-jade');
var assetRev = require('gulp-asset-rev-jade');
var assets = require("gulp-assets");
var rev = require('gulp-rev');
var webserver = require('gulp-webserver');

gulp.task('templates', function() {

    gulp.src('./src/img/*')
        .pipe(rev())
        .pipe(gulp.dest('./dist/img/'))

    gulp.src('./src/*.jade')
        .pipe(jade())
        .pipe(assetRev({connecter: '-'}))
        .pipe(gulp.dest('./dist/'))
});

gulp.task('webserver', function() {
    gulp.src('dist')
        .pipe(webserver({
            livereload: true,
            directoryListing: true,
            open: true
        }));
});