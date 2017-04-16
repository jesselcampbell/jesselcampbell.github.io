// Source: Optimizing Jekyll Performance with Gulp
// http://savaslabs.com/2016/10/19/optimizing-jekyll-with-gulp.html

// Requirements
var autoprefixer = require('autoprefixer');
var browserSync  = require('browser-sync').create();
var cleancss     = require('gulp-clean-css');
var concat       = require('gulp-concat');
var del          = require('del');
var gulp         = require('gulp');
var gutil        = require('gulp-util');
var imagemin     = require('gulp-imagemin');
var notify       = require('gulp-notify');
var postcss      = require('gulp-postcss');
var rename       = require('gulp-rename');
var run          = require('gulp-run');
var runSequence  = require('run-sequence');
var sass         = require('gulp-ruby-sass');
var uglify       = require('gulp-uglify');

// Include paths file
var paths = require('./_tooling/paths');

// Process SCSS
gulp.task('build:styles', function() {
  return sass(paths.sassFiles + '/app.scss', {
    style: 'compressed',
    trace: true,
    loadPath: [paths.sassFiles]
  }).pipe(postcss([ autoprefixer({ browsers: ['last 2 versions'] }) ]))
    .pipe(cleancss())
    .pipe(gulp.dest(paths.jekyllCssFiles))
    .pipe(gulp.dest(paths.siteCssFiles))
    .pipe(browserSync.stream())
    .on('error', gutil.log);
});

// Delete processed CSS
gulp.task('clean:styles', function(callback) {
  del([
    paths.jekyllCssFiles + 'app.css',
    paths.siteCssFiles + 'app.css',
  ]);
  callback();
});

// Process JS
gulp.task('build:scripts', function() {
  return gulp.src([
    paths.jsFiles + '/global/lib' + paths.jsPattern,
    paths.jsFiles + '/global/*.js'
  ])
    .pipe(concat('app.js'))
    .pipe(uglify())
    .pipe(gulp.dest(paths.jekyllJsFiles))
    .pipe(gulp.dest(paths.siteJsFiles))
    .on('error', gutil.log);
});

// Delete processed JS
gulp.task('clean:scripts', function(callback) {
  del([
    paths.jekyllJsFiles + 'app.js',
    paths.siteJsFiles + 'app.js'
  ]);
  callback();
});

// Copies fonts
gulp.task('build:fonts', function() {
  return gulp.src(paths.fontFiles + '/**.*')
    .pipe(rename(function(path) {path.dirname = '';}))
    .pipe(gulp.dest(paths.jekyllFontFiles))
    .pipe(gulp.dest(paths.siteFontFiles))
    .pipe(browserSync.stream())
    .on('error', gutil.log);
});

// Deletes copied fonts
gulp.task('clean:fonts', function(callback) {
    del([
      paths.jekyllFontFiles,
      paths.siteFontFiles
    ]);
    callback();
});

// Process images
gulp.task('build:images', function() {
  return gulp.src(paths.imageFilesGlob)
    .pipe(imagemin())
    .pipe(gulp.dest(paths.jekyllImageFiles))
    .pipe(gulp.dest(paths.siteImageFiles))
    .pipe(browserSync.stream());
});

// Delete processed images
gulp.task('clean:images', function(callback) {
  del([
    paths.jekyllImageFiles,
    paths.siteImageFiles
  ]);
  callback();
});

// Run Jekyll build command
gulp.task('build:jekyll', function() {
  var shellCommand = 'bundle exec jekyll build --config _config.yml';
  return gulp.src('')
    .pipe(run(shellCommand))
    .on('error', gutil.log);
});

// Delete the _site directory
gulp.task('clean:jekyll', function(callback) {
  del(['_site']);
  callback();
});

// Build site anew
gulp.task('build', function(callback) {
  runSequence('clean',
    [
      'build:scripts',
      'build:images',
      'build:styles',
      'build:fonts'
    ],
    'build:jekyll',
    callback);
});

gulp.task('clean', [
  'clean:jekyll',
  'clean:fonts',
  'clean:images',
  'clean:scripts',
  'clean:styles'
]);

// Default task
gulp.task('default', ['build']);

// Build Jekyll and then reload BrowserSync
gulp.task('build:jekyll:watch', ['build:jekyll'], function(callback) {
  browserSync.reload();
  callback();
});

// Build scripts and then reload BrowserSync
gulp.task('build:scripts:watch', ['build:scripts'], function(callback) {
  runSequence('build:jekyll');
  browserSync.reload();
  callback();
});

// Serve task
gulp.task('serve', ['build'], function() {
  browserSync.init({
    server: paths.siteDir,
    ghostMode: false, // Toggle to mirror clicks, reloads etc. (performance)
    logFileChanges: true,
    logLevel: 'debug',
    open: true // Toggle to automatically open page when starting.
  });

  // Watch site settings
  gulp.watch(['_config.yml'], ['build:jekyll:watch']);

  // Watch .scss files; changes are piped to BrowserSync
  gulp.watch('_assets/styles/**/*.scss', ['build:styles']);

  // Watch .js files.
  gulp.watch('_assets/js/**/*.js', ['build:scripts:watch']);

  // Watch image files; changes are piped to BrowserSync
  gulp.watch('_assets/img/**/*', ['build:images']);

  // Watch posts
  gulp.watch('_posts/**/*.+(md|markdown|MD)', ['build:jekyll:watch']);
  gulp.watch('_work/**/*.+(md|markdown|MD)', ['build:jekyll:watch']);

  // Watch HTML and markdown files
  gulp.watch(['**/*.+(html|md|markdown|MD|json)', '!_site/**/*.*'], ['build:jekyll:watch']);

  // Watch favicon.png
  gulp.watch('favicon.png', ['build:jekyll:watch']);
});
