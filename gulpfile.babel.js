const wpCli        = 'https://github.com/wp-cli/wp-cli/releases/download/v0.22.0/wp-cli-0.22.0.phar';
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
import rename from "gulp-rename";
import browserSync from "browser-sync";
import request from "request";
import source from "vinyl-source-stream";
import fs from "fs";
import del from "del";
import plumber from "gulp-plumber";
import configPrompt from "./config-prompt";
import packageJs  from "./package.json";
import webpack from "webpack-stream";
import webpackConfig from "./webpack.config.js";

// Optional dependencies
import autoprefixer from "autoprefixer";
import sourcemaps from "gulp-sourcemaps";
import postcss from "gulp-postcss";
import cssnano from "cssnano";

// Set the theme URL, the theme.json will be altered by the 
// ========================================================================
let theme       = require("./theme.json").theme;
let themeUrl    = 'wp/wp-content/themes/' + theme;

// Fetch Wordpress CLI latest build 
// ========================================================================
// Wordpress CLI used for getting latest installation 
// You can also use wpcli in future for installing plugins and other tasks
// For more info see https://wp-cli.org/

gulp.task('wpcli', () => {
  return request(wpCli)
    .pipe(source('wp-cli.phar'))
    .pipe(gulp.dest('./'))
});

// Initialize the setup
// ========================================================================
// Runs through a series of prompts, altering the wp-config template and
// finally outputting a wp-config file and a wp-cli template file, used
// for the remaining installation. You can add more prompt options in 
// config-prompt.js and use the prompt values returned below. 

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

        gulp.src('theme.json')
          .pipe(replace(theme, res.wptheme))
          .pipe(gulp.dest('./'))

        theme       = res.wptheme;
        themeUrl    = 'wp/wp-content/themes/' + theme;

        shell.task(['gulp wpsetup'])();

      })
  )

});

// Copy the wordpress configuration
// ========================================================================
// Copies the config into the wp directory

gulp.task('wpcopyconfig', () => {
  gulp.src('wp-config.php').pipe(gulp.dest('./wp'));
});

// Copy the base theme
// ========================================================================
// Copies the base theme into the wp theme folder

gulp.task('wpcopytheme', () => {
  gulp.src(['wp19/**/*']).pipe(gulp.dest('./' + themeUrl + '/'));
});

// Main setup task
// ========================================================================
// Runs through all remaining commands to install Wordpress and plugins
// 
// NOTE: More plugins can be defined in package.json

gulp.task('wpsetup', () => {

  let plugins = packageJs.wpcli.plugins;
  let cmd = [];

  for(var i=0; i < plugins.length; i++ ){
    plugins[i] = "php wp-cli.phar plugin install " + plugins[i] + ' --activate';
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
    'php wp-cli.phar theme activate ' + theme,

    // Create basic menu
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
    'php wp-cli.phar theme delete twentyfourteen',
    'php wp-cli.phar theme delete twentyfifteen',
    'php wp-cli.phar theme delete twentysixteen',

    'echo All set! Thanks for waiting.',
    'echo IMPORTANT: You need to remove several files from your installation.',
    'echo Please run gulp cleanup. This will remove the .git folder and other setup files.'

  );

  // Disabled 
  // cmd.push('gulp cleanup');

  // Run these tasks

  shell.task( cmd )();

});

// Final cleanup tasks
// ========================================================================
// Removes the .git folder. This repo should be cloned and used for another
// project, and does not require a git history.
// 
// Removes other setup files that won't be required

gulp.task('cleanup', (cb) => {
    return del([
      '.git/**/*',
      'wp19/**/*',
      'wp19',
      'wp-cli.template.yml',
      'wp-config.template.php',
      'wp-config.php'
    ]);
});


// Build/compilation tasks
// ========================================================================
// Compiles sass or less
// You can also use autoprefixer and cssnano if needed
// Compiles JavaScript (ES6-style), using webpack

const plumberHandler = ( done ) => {
  return {
    errorHandler:(err) => {
      done(err);
    }
  }
}

// Compile Sass
gulp.task('sass', ( done ) => {
    return gulp.src( themeUrl + '/css/*.scss')
        .pipe(plumber(plumberHandler(done)))
        .pipe(concat('main.dist.css'))
        .pipe(sass())
        .pipe(postcss([ 

          //== If you need autoprefixer, you can uncomment it below == //
          // autoprefixer({ browsers: cssBrowsers }),
          
          //== If you need css minification, you can uncomment it below == //
          // cssnano()

        ]))
        .pipe(gulp.dest(themeUrl + '/dist/css'));
});

// Compile Less
gulp.task('less', ( done ) => {
    return gulp.src( themeUrl + '/css/*.less')
        .pipe(plumber(plumberHandler(done)))
        .pipe(concat('main.dist.css'))
        .pipe(less())
        .pipe(postcss([ 
          //== If you need autoprefixer, you can uncomment it below == //
          // autoprefixer({ browsers: cssBrowsers }),

          //== If you need css minification, you can uncomment it below == //
          // cssnano()
        ]))
        .pipe(gulp.dest(themeUrl + '/css'));
});

// Concatenate & Minify JS
gulp.task('scripts', ( done ) => {
    return gulp.src( themeUrl + '/js/main.js' )
        .pipe(plumber(plumberHandler(done)))
        .pipe(jshint())
        .pipe(jshint.reporter('default'))
        .pipe(webpack(webpackConfig))
        .pipe(gulp.dest("./"));
});

gulp.task("build", ["scripts", "sass", "less"] );

// PHP Task
// ========================================================================
// Using connect we can monitor the files as they change and recompile theme

gulp.task('php', () => {

  connect.server({
    port : 8000,
    open : false,
    hostname : "127.0.0.1", 
    base : './'
  }, () => {
    browserSync({
      proxy: '127.0.0.1:8000',
      snippetOptions: {
          ignorePaths: "wp/wp-admin/**"
      },
      notify: false
    });
  });

  // Watch files except for the compiled files
  // gulp.watch( [themeUrl + '/css/*.scss', '!' + themeUrl + '/js/*.dist.css'], ['sass', 'reload']);
  gulp.watch( [themeUrl + '/js/**/*.js', '!' + themeUrl + '/js/*.dist.js'], ['scripts', 'reload']);
  gulp.watch( [themeUrl + '/css/**/*.less', '!' + themeUrl + '/css/*.dist.css'], ['less', 'reload']);
  
});

gulp.task('reload', () => {
  browserSync.reload();
});

gulp.task('default', ['php']);