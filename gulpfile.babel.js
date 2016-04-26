const themeUrl    = 'wordpress/wp-content/themes/default';
const wpCli       = 'https://raw.github.com/wp-cli/builds/gh-pages/phar/wp-cli.phar';

import gulp from "gulp";
import connect from "gulp-connect-php";
import run from "gulp-run";
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
          .pipe(rename('wp-cli.yml'))
          .pipe(gulp.dest('./'))
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
  gulp.src(['bower.json']).pipe(gulp.dest('./wordpress/wp-content/themes/default'));
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
    'php wp-cli.phar menu item add-custom main-menu Home / --porcelain'

   ])

   .concat( plugins )
	
   .concat(

    // Post install cleanup
    'php wp-cli.phar plugin uninstall hello',
    'php wp-cli.phar theme delete twentythirteen',
    'php wp-cli.phar theme delete twentyfourteen',
    'php wp-cli.phar theme delete twentyfifteen',
    'php wp-cli.phar theme delete twentysixteen',

    // 'gulp cleanup'

  );

  for(var x; x <= cmd.length; x++){
    run( cmd.join(" && ") ).exec();
  }

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

// Compile Sass
gulp.task('sass', () => {
    return gulp.src( themeUrl + '/css/*.scss')
        .pipe(plumber())
        .pipe(concat('main.dist.css'))
        .pipe(sass())
        .pipe(gulp.dest(themeUrl + '/css'));
});

// Compile Less
gulp.task('less', () => {
    return gulp.src( themeUrl + '/css/*.less')
        .pipe(plumber())
        .pipe(concat('main.dist.css'))
        .pipe(less())
        .pipe(gulp.dest(themeUrl + '/css'));
});

// Concatenate & Minify JS
gulp.task('scripts', () => {
    return gulp.src( themeUrl + '/js/main.js' )
        .pipe(plumber())
        .pipe(jshint())
        .pipe(jshint.reporter('default'))
        .pipe(webpack(webpackConfig))
        .pipe(gulp.dest("./"));
});

// Watch Files For Changes
gulp.task('watch', function() {
    gulp.watch( themeUrl + '/js/*.js', ['lint', 'scripts']);
    gulp.watch( themeUrl + '/css/*.scss', ['sass']);
    gulp.watch( themeUrl + '/css/*.less', ['less']);
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