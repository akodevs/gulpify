/**
 * Overview Defines
 * gulp install - establish app for development preview
 * 				- installs npm and bower
 *				- compiles jade into .tmp
 * 				- injects styles, vendor and app scripts and styles into client/index.html
 */

// Gulp Dependencies
var gulp = require('gulp');
var rename = require('gulp-rename');

// Build Dependencies
var browserify = require('gulp-browserify');
var uglify = require('gulp-uglify');

// Style Dependencies
var sass = require('gulp-sass');
var prefix = require('gulp-autoprefixer');
var minifyCSS = require('gulp-minify-css');

// Development Dependencies
var jshint = require('gulp-jshint');

// Test Dependencies
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

/** Compile and build our code - Copy result of the compile to public, so we can serve it unminified in development 
 *							   - Put a copy into build, where we'll grab it for minification
*/
gulp.task('browserify-client', ['lint-client'], function() {
  return gulp.src('client/index.js')
    .pipe(browserify({
      insertGlobals: true
    }))
    .pipe(rename('sample-app.js'))
    .pipe(gulp.dest('build/assets/scripts'))
    .pipe(gulp.dest('public/javascripts'));
}); 

/** Compile test for our code - this will also go into build */
gulp.task('browserify-test', ['lint-test'], function() {
  return gulp.src('test/client/index.js')
    .pipe(browserify({
      insertGlobals: true
    }))
    .pipe(rename('client-test.js'))
    .pipe(gulp.dest('build/assets/scripts'));
});
 
/** Watch our code - watch task to trigger rebuilds of the app and test when one og the source file changes*/
gulp.task('watch', function() {
  gulp.watch('client/**/*.js', ['browserify-client']);
  gulp.watch('test/client/**/*.js', ['browserify-test']);
}); 

/** Define a test Gulp task and add it our watch, require browserify-test as dependency for our task
 *  We should also update our watch to run the tests whenever we change any of the app or test files.
 */
gulp.task('test', ['lint-test', 'browserify-test'], function() {
  return gulp.src('test/client/index.html')
    .pipe(mochaPhantomjs());
});

gulp.task('watch', function() {
  gulp.watch('client/**/*.js', ['browserify-client', 'test']);
  gulp.watch('test/client/**/*.js', ['test']);
});

/** Use gulp-autoprfixer so we don't have to write vendor prefixes
*   - Create a devleopment copy and a build copy, and place them in public/assets/ and build, respectively
*   - Add sass to watch
*   - Uglify our JS files to imporve page load
*   - Task fo rminification and uglification, then copy minified production version of the files to public/styles
*	   and public/javascripts
*   Wrap it all up into a build task
*/
gulp.task('styles', function() {
  return gulp.src('client/sass/main.scss')
    .pipe(sass())
    .pipe(prefix({ cascade: true }))
    .pipe(rename('main.css'))
    .pipe(gulp.dest('build/assets/styles'));
});

gulp.task('minify', ['styles'], function() {
  return gulp.src('build/assets/styles/main.css')
    .pipe(minifyCSS())
    .pipe(rename('main.min.css'))
    .pipe(gulp.dest('public/styles'));
});

gulp.task('uglify', ['browserify-client'], function() {
  return gulp.src('build/assets/scripts/main.js')
    .pipe(uglify())
    .pipe(rename('main.min.js'))
    .pipe(gulp.dest('public/javascripts'));
});

gulp.task('build', ['uglify', 'minify']);