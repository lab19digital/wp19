// Dependencies
import path              from 'path';
import gulp              from 'gulp';
import connectPHP        from 'gulp-connect-php';
import plumber           from 'gulp-plumber';
import notify            from 'gulp-notify';
import sass              from 'gulp-sass';
import postcss           from 'gulp-postcss';
import autoprefixer      from 'autoprefixer';
import sourcemaps        from 'gulp-sourcemaps';
import watch             from 'gulp-watch';
import shell             from 'gulp-shell';
import prompt            from 'gulp-prompt';
import replace           from 'gulp-replace';
import concat            from 'gulp-concat';
import rename            from 'gulp-rename';
import request           from 'request';
import source            from 'vinyl-source-stream';
import fs                from 'fs';
import del               from 'del';
import webpack           from 'webpack-stream';
import webpackConfigDEV  from './webpack.dev';
import webpackConfigPROD from './webpack.prod';
import promptConfig      from './prompt-config';
import packageJSON       from './package.json';
import { create as browserSyncCreate } from 'browser-sync';



// Settings
const wpCli = 'https://github.com/wp-cli/wp-cli/releases/download/v1.5.0/wp-cli-1.5.0.phar';

const browserSync = browserSyncCreate();
const browserSyncReload = browserSync.reload;
const browserSyncProxy = 'local-url.test';

let theme = require('./theme.json').theme;
let themePath = `wp/wp-content/themes/${theme}`;

const nodePath = `${__dirname}/node_modules`;
const dest = `${themePath}/dist`;



// PROJECT SETUP
// =======================================================================

// Fetch WP CLI
gulp.task('get-wp-cli', () => {
  return request(wpCli)
    .pipe(source('wp-cli.phar'))
    .pipe(gulp.dest('./'))
});

// Initialize Setup
// Runs through a series of prompts, altering the wp-config template and
// finally outputting a wp-config file and a wp-cli template file, used
// for the remaining installation. You can add more prompt options in
// prompt-config.js and use the prompt values returned below.
gulp.task('wp-init', () => {
  let res = {};

  gulp.src('wp-config.template.php').pipe(
    prompt.prompt(promptConfig, (res) => {
      gulp.src('wp-config.template.php')
        .pipe(replace('{DB_NAME}', res.db))
        .pipe(replace('{DB_USER}', res.user))
        .pipe(replace('{DB_PASSWORD}', res.password))
        .pipe(replace('{WP_USER}', res.wpuser))
        .pipe(replace('{WP_PASSWORD}', res.wppass))
        .pipe(rename('wp-config.php'))
        .pipe(gulp.dest('./'));

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
        .pipe(gulp.dest('./'));

      gulp.src('wp19/style.css')
        .pipe(replace('wp19', res.wpsitetitle))
        .pipe(gulp.dest('./wp19'));

      gulp.src('theme.json')
        .pipe(replace(theme, res.wptheme))
        .pipe(gulp.dest('./'));

      theme = res.wptheme;
      themePath = `wp/wp-content/themes/${theme}`;

      shell.task(['gulp wp-setup'])();
    })
  );
});

// Copy WP Configuration File
gulp.task('copy-wp-config', () => {
  gulp.src('wp-config.php')
    .pipe(gulp.dest('./wp'));
});

// Copy WP Base Theme
gulp.task('copy-wp-base-theme', () => {
  gulp.src(['wp19/**/*'])
    .pipe(gulp.dest(themePath));
});

// Main WP Setup Task
// Runs through all remaining commands to install Wordpress and plugins
// NOTE: More plugins can be defined in package.json
gulp.task('wp-setup', () => {
  let plugins = packageJSON.wpcli.plugins;
  let cmd = [];

  for (let i = 0; i < plugins.length; i++) {
    plugins[i] = `php wp-cli.phar plugin install ${plugins[i]} --activate`;
  }

  cmd = cmd.concat([
    `echo Wordpress download, installation, and configuration will take a few minutes...`,

    // Get the CLI tool
    `echo Fetching the CLI tool...`,
    `gulp get-wp-cli`,

    // Install WP
    `php wp-cli.phar core download`,
    `php wp-cli.phar db create`,
    `php wp-cli.phar core install`,

    // Copy the config
    `gulp copy-wp-config`,
    `gulp copy-wp-base-theme`,
    `php wp-cli.phar theme activate ${theme}`,

    // Create basic menu
    `php wp-cli.phar menu create Primary`,
    `php wp-cli.phar menu location assign Primary primary-nav`,
    `php wp-cli.phar menu item add-custom Primary Home / --porcelain`,

    `echo Download and install plugins...`
  ])
  .concat(plugins)
  .concat(
    `echo Cleaning up the installation...`,

    // Post install cleanup
    `php wp-cli.phar plugin uninstall hello`,
    `php wp-cli.phar plugin uninstall akismet`,
    `php wp-cli.phar theme delete twentyfifteen`,
    `php wp-cli.phar theme delete twentysixteen`,
    `php wp-cli.phar theme delete twentyseventeen`,

    // Build dist files
    `gulp build`,

    `echo All set! Thanks for waiting.`,
    `echo IMPORTANT: You need to remove several files from your installation.`,
    `echo Please run gulp cleanup. This will remove the .git folder and other setup files.`
  );

  // Disabled
  // cmd.push('gulp cleanup');

  // Run these tasks
  shell.task(cmd)();
});

// Cleanup
// Removes the .git folder. This repo should be cloned and used for another
// project, and does not require a git history.
// Removes other setup files that won't be required
gulp.task('cleanup', () => {
  return del([
    '.git/**/*',
    'wp19/**/*',
    'wp19',
    'wp-cli.template.yml',
    'wp-config.template.php',
    'wp-config.php'
  ]);
});



// DEV TASKS -> sass / js / watch / php / proxy / build
// =======================================================================

// Plumber
var plumberHandler = {
  errorHandler: notify.onError({
    title: 'Gulp Error',
    message: '<%= error.message %>'
  })
};

// SASS
gulp.task('sass', () => {
  return gulp.src(`${themePath}/scss/**/*.scss`)
    .pipe(plumber(plumberHandler))
    .pipe(sourcemaps.init())
    .pipe(sass({
      precision: 10,
      includePaths: [nodePath]
    }))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(dest))
    .pipe(browserSync.stream());
});

gulp.task('sass:prod', () => {
  return gulp.src(`${themePath}/scss/**/*.scss`)
    .pipe(plumber(plumberHandler))
    .pipe(sass({
      precision: 10,
      outputStyle: 'compressed',
      includePaths: [nodePath]
    }))
    .pipe(postcss([
      autoprefixer({ cascade: false })
    ]))
    .pipe(gulp.dest(dest));
});

// JS
gulp.task('js', () => {
  return gulp.src(`${themePath}/js/main.js`)
    .pipe(plumber(plumberHandler))
    .pipe(webpack(webpackConfigDEV))
    .pipe(gulp.dest(dest));
});

gulp.task('js:prod', () => {
  return gulp.src(`${themePath}/js/main.js`)
    .pipe(plumber(plumberHandler))
    .pipe(webpack(webpackConfigPROD))
    .pipe(gulp.dest(dest));
});

gulp.task('js-watch', ['js'], (done) => {
  browserSync.reload();
  done();
});

// Watch
gulp.task('watch', () => {
  watch(`${themePath}/scss/**/*.scss`, () => gulp.start('sass'));
  watch(`${themePath}/js/**/*.js`, () => gulp.start('js-watch'));
  watch(`${themePath}/**/*.twig`, () => browserSync.reload());
  watch(`${themePath}/**/*.php`, () => browserSync.reload());
});

// PHP
gulp.task('php', ['watch'], () => {
  connectPHP.server({
    port: 8000,
    open: false,
    hostname: '127.0.0.1',
    base: __dirname,
    stdio: 'ignore'
  }, () => {
    browserSync.init({
      ghostMode: false,
      ui: false,
      notify: false,
      proxy: '127.0.0.1:8000'
    });
  });
});

// Proxy
gulp.task('proxy', ['watch'], () => {
  browserSync.init({
    ghostMode: false,
    ui: false,
    notify: false,
    proxy: browserSyncProxy
  });
});

// Build
gulp.task('build', ['sass:prod', 'js:prod']);

// Default
gulp.task('default', ['php']);
