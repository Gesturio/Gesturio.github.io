var gulp = require('gulp'),
    less = require('gulp-less'),
    runSequence = require('run-sequence'),
    exit = require('gulp-exit'),

    release = require('./src/gulp_tasks/release'),
    build = require('./src/gulp_tasks/build');

gulp.task('watch', function() {
  return gulp.watch('./src/**/*', ['build']);
});

gulp.task('default', function(cb) {
  return runSequence(
    'clear',
    ['jade_index', 'jade_views',
      'less',
      'js_coffee', 'js_js',
      'img', 'img_dic'],
    'watch',
    'server', cb
  );
});

gulp.task('release', function(cb) {
  return runSequence( 'clear_release',
    [ 'r_jade_index', 'r_jade',
      'r_less',
      'r_coffee', 'r_js', 'r_js_min',
      'r_img', 'r_dic'],
    'server',
    'r_zip', cb
  );
});
