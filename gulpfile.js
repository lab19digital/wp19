var themeUrl    = 'wordpress/wp-content/themes/default';
var wpCli       = 'https://raw.github.com/wp-cli/builds/gh-pages/phar/wp-cli.phar';

// Include gulp
var gulp 	      = require('gulp'); 
var rimraf      = require('rimraf');
var connect     = require('gulp-connect-php');
var run         = require('gulp-run');
var prompt      = require('gulp-prompt');
var replace     = require('gulp-replace');
var jshint 	    = require('gulp-jshint');
var sass 	      = require('gulp-sass');
var concat 	    = require('gulp-concat');
var uglify 	    = require('gulp-uglify');
var rename 	    = require('gulp-rename');
var gunzip 	    = require('gulp-gunzip');
var untar 	    = require('gulp-untar');
var request     = require('request');
var source      = require('vinyl-source-stream');
var fs          = require('fs');

// Get Wordpress latest
gulp.task('wpcli', function () {
  return request(wpCli)
  .pipe(source('wp-cli.phar'))
  .pipe(gulp.dest('./'))
});

gulp.task('wpinit', function(){
  var res = {};
  gulp.src('wp-config.template.php').pipe(
      prompt.prompt([
      {
        type : 'input',
        name : 'db',
        message : 'Database name',
        validate : function( val ){
          return val.length > 0;
        }
      },
        {
        type : 'input',
        name : 'user',
        message : 'Database user',
        default : 'root'
      },
      {
        type : 'input',
        name : 'password',
        message : 'Database password',
        default : 'root'
      },
      {
        type : 'input',
        name : 'wpuser',
        message : 'WP-Admin user',
        default : 'admin'
      },
      {
        type : 'input',
        name : 'wppass',
        message : 'WP-Admin password',
        default : 'admin'
      },
      {
        type : 'input',
        name : 'wpemail',
        message : 'WP-Admin email',
        default : 'admin@example.com'
      }
      ], 
      function( res ){

        gulp.src('wp-config.template.php')
          .pipe(replace('{DB_NAME}', res.db))
          .pipe(replace('{DB_USER}', res.user))
          .pipe(replace('{DB_PASSWORD}', res.password))
          .pipe(rename('wp-config.php'))
          .pipe(gulp.dest('./'))

        gulp.src('wp-cli.template.yml')
          .pipe(replace('{DB_NAME}', res.db))
          .pipe(replace('{DB_USER}', res.user))
          .pipe(replace('{DB_PASSWORD}', res.password))
          .pipe(replace('{WP_USER}', res.wpuser))
          .pipe(replace('{WP_PASSWORD}', res.wppass))
          .pipe(replace('{WP_EMAIL}', res.wpemail))
          .pipe(rename('wp-cli.yml'))
          .pipe(gulp.dest('./'))
      })
  )
});

gulp.task('wpcopyconfig', function(){
  return gulp.src('wp-config.php')
    .pipe(gulp.dest('./wordpress'))
});

gulp.task('wpcopytheme', function(){
  return gulp.src(['wp19/**/*']).pipe(gulp.dest('./wordpress/wp-content/themes/default'));
});

gulp.task('wpsetup', function(){

  var cmd = [

    'gulp wpinit',

    // Get the CLI tool
    'gulp wpcli',

    // Install WP
    'php wp-cli.phar core download',
    'php wp-cli.phar db create',
    'php wp-cli.phar core install',

    // Copy the config
    'gulp wpcopyconfig',
    'gulp wpcopytheme',
    'php wp-cli.phar theme activate default',

    // Example menu
    'php wp-cli.phar menu create main-menu',
    'php wp-cli.phar menu location assign main-menu main-menu',
    'php wp-cli.phar menu item add-custom main-menu Home / --porcelain',

    // Get Plugins
    'php wp-cli.phar plugin install advanced-custom-fields --activate',
    'php wp-cli.phar plugin install yoast-seo --activate',
    'php wp-cli.phar plugin install wordfence --activate',

    // Cleanup
    'php wp-cli.phar plugin uninstall hello',
    'php wp-cli.phar theme delete twentythirteen',
    'php wp-cli.phar theme delete twentyfourteen',
    'php wp-cli.phar theme delete twentyfifteen',

    // Bower components
    'cd wordpress/wp-content/themes/default && bower install',
    'cd ../../../../',
    'gulp cleanup'

  ].join(" && ");
  return run( cmd ).exec();
});

// Get ACF latest
// Get ACF premium plugins
// Get Yoast latest
// Get security plugins
// Get/run wpscan?

// Lint Task
gulp.task('lint', function() {
    return gulp.src( themeUrl + '/js/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

// Compile Our Sass
gulp.task('sass', function() {
    return gulp.src( themeUrl + '/css/*.scss')
        .pipe(concat('main.css'))
        .pipe(sass())
        .pipe(gulp.dest(themeUrl + '/css/dist'));
});

// Concatenate & Minify JS
gulp.task('scripts', function() {
    var paths = JSON.parse( fs.readFileSync( themeUrl + '/js/require.json', 'utf8') );
    for(var x in paths){
      paths[x] = themeUrl + paths[x];
    }
    return gulp.src( paths )
        .pipe(concat('scripts.js'))
        .pipe(gulp.dest( themeUrl + '/js/dist/' ))
        .pipe(rename(themeUrl + '/js/dist/scripts.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest("./"));
});

// Watch Files For Changes
gulp.task('watch', function() {
    gulp.watch( themeUrl + '/js/*.js', ['lint', 'scripts']);
    gulp.watch( themeUrl + '/css/*.scss', ['sass']);
});

gulp.task('cleanup', function(cb) {
    rimraf('.git', cb);
    rimraf('wp19', cb);
});

gulp.task("build", ["scripts", "sass"] );

gulp.task('php', function() {

  connect.server({
    port : 8888,
    open : false,
    hostname : "0.0.0.0",
    base : 'wordpress'
  });

  gulp.watch( themeUrl + '/js/*.js', ['lint', 'scripts']);
  gulp.watch( themeUrl + '/css/*.scss', ['sass']);

});