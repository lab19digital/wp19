const themeUrl     = 'wordpress/wp-content/themes/default';
const wpCli        = 'https://raw.github.com/wp-cli/builds/gh-pages/phar/wp-cli.phar';
const cssBrowsers  = ['> 1%', 'last 2 versions','ie >= 10'];

// Required dependencies
import gulp from "gulp";
import connect from "gulp-connect-php";
import shell from "gulp-shell";
import prompt from "gulp-prompt";
import replace from "gulp-replace";
import jshint from "gulp-jshint";
import sass from "gulp-sass";
import less from "gulp-less";
import concat from "gulp-concat";
import uglify from "gulp-uglify";
import rename from "gulp-rename";
import gunzip from "gulp-gunzip";
import request from "request";
import source from "vinyl-source-stream";
import fs from "fs";
import del from "del";
import plumber from "gulp-plumber";
import configPrompt	from "./config-prompt";
import packageJs 	from "./package.json";
import webpack from "webpack-stream";
import webpackConfig from "./webpack.config.js";

// Optional dependencies
import autoprefixer from "autoprefixer";
import sourcemaps from "gulp-sourcemaps";
import postcss from "gulp-postcss";
import cssnano from "cssnano";

/*
	Initialization tasks
	-------------------------------------------------------------------------
*/

/*
	Get wordpress CLI latest
*/

gulp.task('wpcli', () => {
  return request(wpCli)
  	.pipe(source('wp-cli.phar'))
  	.pipe(gulp.dest('./'))
});


/*
	Initialize wordpress config
*/

gulp.task('wpinit', () => {

  let res = {};
  gulp.src('wp-config.template.php').pipe(

      prompt.prompt( configPrompt, ( res ) => {

        gulp.src('wp-config.template.php')
          .pipe(replace('{DB_NAME}', res.db))
          .pipe(replace('{DB_USER}', res.user))
          .pipe(replace('{DB_PASSWORD}', res.password))
          .pipe(replace('{WP_USER}', res.wpuser))
          .pipe(replace('{WP_PASSWORD}', res.wppass))
          .pipe(rename('wp-config.php'))
          .pipe(gulp.dest('./'))

        gulp.src('wp-cli.template.yml')
          .pipe(replace('{DB_NAME}', res.db))
          .pipe(replace('{DB_USER}', res.user))
          .pipe(replace('{DB_PASSWORD}', res.password))
          .pipe(replace('{WP_USER}', res.wpuser))
          .pipe(replace('{WP_PASSWORD}', res.wppass))
          .pipe(replace('{WP_EMAIL}', res.wpemail))
          .pipe(replace('{WP_SITE_TITLE}', res.wpsitetitle))
          .pipe(replace('{WP_BASE_URL}', res.wpbase))
          .pipe(rename('wp-cli.yml'))
          .pipe(gulp.dest('./'))

        shell.task(['gulp wpsetup'])();

      })
  )

});

/*
	Copy the configuration
*/

gulp.task('wpcopyconfig', () => {
	gulp.src('wp-config.php').pipe(gulp.dest('./wordpress'));
});

/*
	Copy the basetheme
*/

gulp.task('wpcopytheme', () => {
  gulp.src(['wp19/**/*']).pipe(gulp.dest('./wordpress/wp-content/themes/default'));
});

/*
	Install Wordpress and setup
*/

gulp.task('wpsetup', () => {

  let plugins = packageJs.wpcli.plugins;
  let cmd = [];

  for( var x in plugins ){
    plugins[x] = "php wp-cli.phar plugin install " + plugins[x] + ' --activate';
  }

  cmd = cmd.concat([

    'echo Wordpress download, installation, and configuration will take a few minutes...',

    // Get the CLI tool
    'echo Fetching the CLI tool...',

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

    'echo Download and install plugins...',

   ])

   .concat( plugins )
	
   .concat(

    'echo Cleaning up the installation...',

    // Post install cleanup
    'php wp-cli.phar plugin uninstall hello',
    'php wp-cli.phar theme delete twentythirteen',
    'php wp-cli.phar theme delete twentyfourteen',
    'php wp-cli.phar theme delete twentyfifteen',
    'php wp-cli.phar theme delete twentysixteen',


    'echo All set! Thanks for waiting.'

  );

  // cmd.push('gulp cleanup');

  // Run these tasks

  shell.task( cmd )();

});

/*
	Post install cleanup
*/

gulp.task('cleanup', (cb) => {
    return del([
      '.git/**/*',
      'wp19/**/*',
      'wp-cli.template.yml',
      'wp-config.template.php'
    ]);
});


/*
	Build tasks
	-------------------------------------------------------------------------
*/

let plumber_cfg = function( done ){
  return {
    errorHandler: function (err) {
      done(err);
    }
  }
}

// Compile Sass
gulp.task('sass', ( done ) => {
    return gulp.src( themeUrl + '/css/*.scss')
        .pipe(plumber(plumber_cfg(done)))
        .pipe(concat('main.dist.css'))
        .pipe(sass())
        .pipe(postcss([ 
          //== If you need autoprefixer, you can uncomment it below == //
          // autoprefixer({ browsers: [cssBrowsers] }),
          
          //== If you need css minification, you can uncomment it below == //
          // cssnano()

        ]))
        .pipe(gulp.dest(themeUrl + '/dist/css'));
});

// Compile Less
gulp.task('less', ( done ) => {
    return gulp.src( themeUrl + '/css/*.less')
        .pipe(plumber(plumber_cfg(done)))
        .pipe(concat('main.dist.css'))
        .pipe(less())
        .pipe(postcss([ 
          //== If you need autoprefixer, you can uncomment it below == //
          // autoprefixer({ browsers: [cssBrowsers] }),

          //== If you need css minification, you can uncomment it below == //
          // cssnano()
        ]))
        .pipe(gulp.dest(themeUrl + '/dist/css'));
});

// Concatenate & Minify JS
gulp.task('scripts', ( done ) => {
    return gulp.src( themeUrl + '/js/main.js' )
        .pipe(plumber(plumber_cfg(done)))
        .pipe(jshint())
        .pipe(jshint.reporter('default'))
        .pipe(webpack(webpackConfig))
        .pipe(gulp.dest("./"));
});

gulp.task("build", ["scripts", "sass", "less"] );

gulp.task('php', function() {

  connect.server({
    port : 8000,
    open : false,
    hostname : "0.0.0.0", // Hostname is like this for over-wifi testing on mobile
    base : 'wordpress'
  });

  // Watch files except for the compiled files
  gulp.watch( [themeUrl + '/js/**/*.js', '!' + themeUrl + '/js/*.dist.js'], ['scripts']);
  gulp.watch( [themeUrl + '/css/*.scss', '!' + themeUrl + '/js/*.dist.css'], ['sass']);
  gulp.watch( [themeUrl + '/css/*.less', '!' + themeUrl + '/js/*.dist.css'], ['less']);

});