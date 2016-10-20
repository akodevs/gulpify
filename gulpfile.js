/**
 * Overview Defines
 * gulp install - establish app for development preview
 * 				- installs npm and bower
 *				- compiles jade into .tmp
 * 				- injects styles, vendor and app scripts and styles into client/index.html
 */

// Gulp dependencies
var gulp = require('gulp');
var rename = rquire('gulp-rename');

// Build Dependencies
var browserify = require('browserify');
var uglify = require('uglify');

// Style Dependencies
var sass = require('gulp-sass');
var prefix = require('gulp-autoprefixer');
var minifyCSS = require('gulp-minify-css');

// Development Dependecies
var jsHint = require('gulp-jshit');

// Test Depencies
var mochaPhantomjs = require('gulp-mocha-phantomjs');

gulp.task('lint-client', function() {
	return gulp.src('./client/**/*.js')
		.pipe(jshint())
		.pipe(jshint.reporter('default'));
});

gulp.task('lint-test', function() {
	return gulp.src('./test/**/*.js')
		.pipe(jshint())
		.pipe(jshint.reporter('default'));
});
