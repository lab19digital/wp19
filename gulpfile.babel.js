// Dependencies
import { series, parallel, watch, src, dest } from 'gulp';
import path              from 'path';
import shell             from 'gulp-shell';
import prompt            from 'gulp-prompt';
import replace           from 'gulp-replace';
import rename            from 'gulp-rename';
import request           from 'request';
import source            from 'vinyl-source-stream';
import del               from 'del';
import connectPHP        from 'gulp-connect-php';
import plumber           from 'gulp-plumber';
import notify            from 'gulp-notify';
import sass              from 'gulp-sass';
import postcss           from 'gulp-postcss';
import autoprefixer      from 'autoprefixer';
import sourcemaps        from 'gulp-sourcemaps';
import webpack           from 'webpack';
import webpackStream     from 'webpack-stream';
import webpackConfigDEV  from './webpack.dev';
import webpackConfigPROD from './webpack.prod';
import promptConfig      from './prompt-config';
import packageJSON       from './package.json';
import themeJSON         from './theme.json';
import { create as browserSyncCreate } from 'browser-sync';



// Settings
const wpCli = 'https://github.com/wp-cli/wp-cli/releases/download/v2.1.0/wp-cli-2.1.0.phar';

const browserSync = browserSyncCreate();
const browserSyncProxy = 'local-url.test';

let theme = themeJSON.theme;
const themePath = path.resolve(__dirname, `wp/wp-content/themes/${theme}`);
const nodePath = path.resolve(__dirname, 'node_modules');
const destPath = `${themePath}/dist`;



// PROJECT SETUP
// =======================================================================

// Fetch WP CLI
function get_wp_cli() {
  return request(wpCli)
    .pipe(source('wp-cli.phar'))
    .pipe(gulp.dest('./'))
}

// Initialize Setup
// Runs through a series of prompts, altering the wp-config template and
// finally outputting a wp-config file and a wp-cli template file, used
// for the remaining installation. You can add more prompt options in
// prompt-config.js and use the prompt values returned below.
function wp_init() {
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

      shell.task(['gulp wp_setup'])();
    })
  );
}

// Copy WP Configuration File
function copy_wp_config() {
  gulp.src('wp-config.php')
    .pipe(gulp.dest('./wp'));
}

// Copy WP Base Theme
function copy_wp_base_theme() {
  gulp.src(['wp19/**/*'])
    .pipe(gulp.dest(themePath));
}

// Main WP Setup Task
// Runs through all remaining commands to install Wordpress and plugins
// NOTE: More plugins can be defined in package.json
function wp_setup() {
  let plugins = packageJSON.wpcli.plugins;
  let cmd = [];

  for (let i = 0; i < plugins.length; i++) {
    plugins[i] = `php wp-cli.phar plugin install ${plugins[i]} --activate`;
  }

  cmd = cmd.concat([
    `echo Wordpress download, installation, and configuration will take a few minutes...`,

    // Get the CLI tool
    `echo Fetching the CLI tool...`,
    `gulp get_wp_cli`,

    // Install WP
    `php wp-cli.phar core download`,
    `php wp-cli.phar db create`,
    `php wp-cli.phar core install`,

    // Copy the config
    `gulp copy_wp_config`,
    `gulp copy_wp_base_theme`,
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
}

// Cleanup
// Removes the .git folder. This repo should be cloned and used for another
// project, and does not require a git history.
// Removes other setup files that won't be required
function cleanup() {
  return del([
    '.git/**/*',
    'wp19/**/*',
    'wp19',
    'wp-cli.template.yml',
    'wp-config.template.php',
    'wp-config.php'
  ]);
}



// DEV TASKS
// =======================================================================

// Plumber
const plumberHandler = {
  errorHandler: notify.onError({
    title: 'Gulp Error',
    message: '<%= error.message %>'
  })
};

// Reload
function reload(done) {
  browserSync.reload();
  done();
}

// SCSS
function scss() {
  return src(`${basePath}/scss/**/*.scss`)
    .pipe(plumber(plumberHandler))
    .pipe(sourcemaps.init())
    .pipe(sass({
      precision: 10,
      includePaths: [nodePath]
    }))
    .pipe(postcss([
      autoprefixer({ cascade: false })
    ]))
    .pipe(sourcemaps.write())
    .pipe(dest(destPath))
    .pipe(browserSync.stream());
}

function scss_prod() {
  return src(`${basePath}/scss/**/*.scss`)
    .pipe(plumber(plumberHandler))
    .pipe(sass({
      precision: 10,
      outputStyle: 'compressed',
      includePaths: [nodePath]
    }))
    .pipe(postcss([
      autoprefixer({ cascade: false })
    ]))
    .pipe(dest(destPath));
}

// JS
function js() {
  return src(`${themePath}/js/main.js`)
    .pipe(plumber(plumberHandler))
    .pipe(webpackStream(webpackConfigDEV, webpack))
    .pipe(dest(destPath));
}

function js_prod() {
  return src(`${themePath}/js/main.js`)
    .pipe(plumber(plumberHandler))
    .pipe(webpackStream(webpackConfigPROD, webpack))
    .pipe(dest(destPath));
}

// Watch
function watch_files() {
  watch(`${basePath}/scss/**/*.scss`, scss);
  watch(`${basePath}/js/**/*.js`, series(js, reload));
  watch(`${basePath}/**/*.twig`, reload);
  watch(`${basePath}/**/*.php`, reload);
  watch(`${basePath}/**/*.html`, reload);
}

// PHP
function php() {
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
}

// Proxy
function proxy() {
  browserSync.init({
    ghostMode: false,
    ui: false,
    notify: false,
    proxy: browserSyncProxy
  });
}

const proxy = parallel(proxy, watch_files);
const build = parallel(scss_prod, js_prod);

export {
  wp_init,
  wp_setup,
  get_wp_cli,
  copy_wp_base_theme,
  copy_wp_config,
  cleanup,
  scss,
  scss_prod,
  js,
  js_prod,
  proxy,
  build
};

export default parallel(php, watch_files);
