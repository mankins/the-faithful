//
// make a precompiled, nodejs ready version of our templates

var gulp = require('gulp');
// var inlineCss = require('gulp-inline-css');
//var shell = require('gulp-shell')
var handlebars = require('gulp-handlebars');
var defineModule = require('gulp-define-module');

gulp.task('precompile', function () {
  return gulp.src('./templates/merged/*.hbs')
    //      .pipe(inlineCss())
    .pipe(handlebars({
      handlebars: require('./handlebars') // to keep handlebars versions in sync and add our plugins
    }))
    .pipe(defineModule('commonjs', {
      require: {
        Handlebars: '../../handlebars'
      },
    }))
    .pipe(gulp.dest('./templates/built/'));
});


gulp.task('default', gulp.series('precompile'));

// gulp.task('merge', shell.task('./merge-templates'));

