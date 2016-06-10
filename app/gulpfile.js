'use strict';

var gulp        = require('gulp');
var $           = require('gulp-load-plugins')();
var del         = require('del');
var runSequence = require('run-sequence');

var paths = {
   html: '*.html',
 images: 'assets/img/*.*',
   sass: ['assets/sass/*.scss', '!assets/sass/reset.scss' ],
 styles: 'assets/css/*.css',
 script: 'assets/js/*.js'
};

// Del
gulp.task('clean', function(cb) {
  del(['dist/assets/css', 'dist/assets/js', 'dist/*.html'], cb);
});

// Img
gulp.task('images',  function() {
  return gulp.src(paths.images)
    .pipe($.imagemin({optimizationLevel: 5, progressive: true, interlaced: true}))
    .pipe(gulp.dest('dist/assets/img'));
});


// Sass
gulp.task('sass', function () {
  return gulp.src(paths.sass)
    .pipe($.sass().on('error', $.sass.logError))
    .pipe(gulp.dest('assets/css/'));
});


// Css
gulp.task('styles',  function() {
  return gulp.src(paths.styles)
    .pipe($.cssnano())
    .pipe($.concat('main.css'))
    .pipe(gulp.dest('dist/assets/css'));
});

// Javascript
gulp.task('script',  function() {
  return gulp.src(paths.script)
      //.pipe($.uglify())
      .pipe($.concat('main.min.js'))
      .pipe(gulp.dest('dist/assets/js'));
});

// Html
gulp.task('html',  function() {
  return gulp.src(paths.html)
    .pipe($.htmlmin({ 
      collapseWhitespace: true,
      preventAttributesEscaping : true,
      removeComments : true
     }))
    .pipe(gulp.dest('dist/'))
});

// Watch
gulp.task('watch', function() {
  gulp.watch(paths.images,  ['images']);
  gulp.watch(paths.sass,    ['sass','styles']);
  gulp.watch(paths.styles,  ['styles']);
  gulp.watch(paths.html,    ['html']);
  gulp.watch(paths.script,  ['script']);
});

// Default 
gulp.task('default', ['clean'], function(cb){
  runSequence('watch', ['sass', 'images', 'html', 'styles','script'], cb);
}); 