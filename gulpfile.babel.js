// Dependencies
import gulp, { series, parallel, watch, src, dest } from 'gulp';
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
import colors            from 'colors/safe';
import sass              from 'gulp-sass';
import postcss           from 'gulp-postcss';
import postcssScss       from 'postcss-scss';
import postcssBemLinter  from 'postcss-bem-linter';
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
const wpCli = 'https://github.com/wp-cli/wp-cli/releases/download/v2.4.0/wp-cli-2.4.0.phar';

let theme = themeJSON.theme;
const basePath = __dirname;
const themePath = path.resolve(__dirname, `wp-content/themes/${theme}`);
const nodePath = path.resolve(__dirname, 'node_modules');
const destPath = `${themePath}/dist`;

const baseName = path.basename(basePath);

// console.log(colors.bold('Base name: ') + baseName);
// console.log(colors.bold('Base path: ') + basePath);
// console.log(colors.bold('Theme name: ') + theme);
// console.log(colors.bold('Theme path: ') + themePath);
// console.log(colors.bold('Build path: ') + destPath);

const browserSync = browserSyncCreate();
const browserSyncProxy = `${baseName}.test`;

const bemUtilitySelectors = /^\.u-/;
const bemIgnoreSelectors = [
  /^\.has-/,
  /\.container/,
  /\.row/,
  /\.col/,
  /#{\$this}/
];



// PROJECT SETUP
// =======================================================================

// Fetch WP CLI
function get_wp_cli() {
  return request(wpCli)
    .pipe(source('wp-cli.phar'))
    .pipe(dest('./'))
}

// Initialize Setup
// Runs through a series of prompts, altering the wp-config template and
// finally outputting a wp-config file and a wp-cli template file, used
// for the remaining installation. You can add more prompt options in
// prompt-config.js and use the prompt values returned below.
function wp_init( done ){
  return wp_prompt().then(( res ) => {
    return wp_preflight( res );
  }).then(() => {
    return wp_setup();
  }).catch(( err ) => {
    process.stderr.write( colors.red.bold(err) + "\n" )
    done();
  })
}

function wp_prompt() {
  let result = {};
  return new Promise(( resolve, reject ) => {
    src('wp-config.template.php').pipe(
      prompt.prompt(promptConfig, (res) => {
        result = res;
        src('wp-config.template.php')
          .pipe(replace('{DB_NAME}', res.db))
          .pipe(replace('{DB_USER}', res.user))
          .pipe(replace('{DB_PASSWORD}', res.password))
          .pipe(replace('{DB_HOST}', res.host))
          .pipe(replace('{WP_USER}', res.wpuser))
          .pipe(replace('{WP_PASSWORD}', res.wppass))
          .pipe(rename('wp-config.php'))
          .pipe(dest('./'));

        src('wp-config-staging.php')
          .pipe(replace('{DB_NAME}', res.db))
          .pipe(replace('{WP_USER}', res.wpuser))
          .pipe(replace('{WP_PASSWORD}', res.wppass))
          .pipe(dest('./'));

        src('wp-cli.template.yml')
          .pipe(replace('{DB_NAME}', res.db))
          .pipe(replace('{DB_USER}', res.user))
          .pipe(replace('{DB_PASSWORD}', res.password))
          .pipe(replace('{DB_HOST}', res.host))
          .pipe(replace('{WP_USER}', res.wpuser))
          .pipe(replace('{WP_PASSWORD}', res.wppass))
          .pipe(replace('{WP_EMAIL}', res.wpemail))
          .pipe(replace('{WP_SITE_TITLE}', res.wpsitetitle))
          .pipe(replace('{WP_BASE_URL}', res.wpbase))
          .pipe(rename('wp-cli.yml'))
          .pipe(dest('./'));

        src('wp19/style.css')
          .pipe(replace('wp19', res.wpsitetitle))
          .pipe(dest('./wp19'));

        src('theme.json')
          .pipe(replace(theme, res.wptheme))
          .pipe(dest('./'));

        theme = res.wptheme;
      })
    ).on('end', () => {
      resolve( result );
    }).on('error', reject);
  })

}

// Copy WP Base Theme
function copy_wp_base_theme() {
  return src(['wp19/**/*'])
    .pipe(dest(themePath));
}

// Copy 'pre-commit' git hook
function copy_git_pre_commit_hook() {
  return src('git-pre-commit-hook')
    .pipe(rename('pre-commit'))
    .pipe(dest('./.git/hooks'));
}

// Check if requirements are met
function wp_preflight( res ){
  const exec = require('child_process').execSync;
  const mysqlCheckPath = exec(`mysql --version || echo 'NO_MYSQL'`);
  const mysqlCheckCred = exec(`mysql -u${res.user} ${ res.password && res.password != '""' ? `-p${res.password}` : '' } -e "SHOW DATABASES" || echo 'NO_MYSQL'`);
  return new Promise(( resolve, reject ) => {
    if( mysqlCheckPath.toString().indexOf('NO_MYSQL') > -1 ){
      reject('mysql not available on PATH and required by wp-cli');
    } else if( mysqlCheckCred.toString().indexOf('NO_MYSQL') > -1 ){
      reject('mysql credentials invalid or server not started');
    } else {
      resolve();
    }
  })
}

// Main WP Setup Task
// Runs through all remaining commands to install Wordpress and plugins
// NOTE: More plugins can be defined in package.json
function wp_setup() {
  let plugins = packageJSON.wpcli.plugins;
  let pluginsString = '';
  let cmd = [];

  for (let i = 0; i < plugins.length; i++) {
    pluginsString = `${pluginsString} ${plugins[i]}`
  }

  cmd = cmd.concat([
    `echo ${colors.blue.bold('Wordpress download, installation, and configuration will take a few minutes...')}`,

    // Get the CLI tool
    `echo ${colors.blue.bold('Fetching the CLI tool...')}`,
    `gulp get_wp_cli`,

    // Install WP
    `php wp-cli.phar core download`,
    `php wp-cli.phar db create`,
    `php wp-cli.phar core install`,

    // Copy the config
    `gulp copy_wp_base_theme`,
    `php wp-cli.phar theme activate ${theme}`,

    // Create basic menu
    `php wp-cli.phar menu create Primary`,
    `php wp-cli.phar menu location assign Primary primary-nav`,
    `php wp-cli.phar menu item add-custom Primary Home /`,

    // Install plugins
    `echo ${colors.blue.bold('Download and install plugins...')}`,
    `php wp-cli.phar plugin install${pluginsString} --activate`,

    // Remove unused themes and plugins
    `echo ${colors.blue.bold('Removing unused themes and plugins...')}`,
    `php wp-cli.phar plugin uninstall hello akismet`,
    `php wp-cli.phar theme delete twentysixteen twentyseventeen twentynineteen twentytwenty`,

    // Change Permalinks
    `echo ${colors.blue.bold('Saving permalinks...')}`,
    `php wp-cli.phar rewrite structure '/%postname%/'`,

    // Clean up
    `echo ${colors.blue.bold('Cleaning the project...')}`,
    `gulp cleanup`,
    `gulp build`,

    // Setting up new repo Git
    `echo ${colors.blue.bold('Setting up new git repository...')}`,
    `git init`,
    `git add . --all`,
    `git commit -m "Initial commit"`,
    `gulp copy_git_pre_commit_hook`,
    `git commit --amend --no-edit`,

    // Done
    `echo ${colors.bgGreen.white.bold('All set! Thanks for waiting.')}`
  ]);

  // Run these tasks
  return shell.task(cmd)();
}

function download_wp() {
  let cmd = [];

  cmd = cmd.concat([
    `echo ${colors.blue.bold('Downloading Wordpress...')}`,

    // Download WP
    `php wp-cli.phar core download --skip-content --force`,

    // Copy git hook
    `echo ${colors.blue.bold('Copying git hook...')}`,
    `gulp copy_git_pre_commit_hook`,

    // Done
    `echo ${colors.bgGreen.white.bold('All set! Thanks for waiting.')}`
  ]);

  // Run these tasks
  return shell.task(cmd)();
}

// Cleanup
// Removes the .git folder. This repo should be cloned and used for another
// project, and does not require a git history.
// Removes other setup files that won't be required
function cleanup() {
  return del([
    '.git',
    'wp19',
    'wp-cli.template.yml',
    'wp-config.template.php'
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
  return src(`${themePath}/scss/**/*.scss`)
    .pipe(plumber(plumberHandler))
    .pipe(postcss([
      postcssBemLinter({
        preset: 'bem',
        implicitComponents: `wp-content/themes/${theme}/scss/blocks/**/*.scss`,
        implicitUtilities: `wp-content/themes/${theme}/scss/utils/**/*.scss`,
        utilitySelectors: bemUtilitySelectors,
        ignoreSelectors: bemIgnoreSelectors
      })
    ], {
      syntax: postcssScss
    }))
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
  return src(`${themePath}/scss/**/*.scss`)
    .pipe(postcss([
      postcssBemLinter({
        preset: 'bem',
        implicitComponents: `wp-content/themes/${theme}/scss/blocks/**/*.scss`,
        implicitUtilities: `wp-content/themes/${theme}/scss/utils/**/*.scss`,
        utilitySelectors: bemUtilitySelectors,
        ignoreSelectors: bemIgnoreSelectors
      })
    ], {
      syntax: postcssScss
    }))
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
    .pipe(webpackStream(webpackConfigPROD, webpack))
    .pipe(dest(destPath));
}

// Watch
function watch_files() {
  watch(`${themePath}/scss/**/*.scss`, scss);
  watch(`${themePath}/js/**/*.js`, series(js, reload));
  watch(`${themePath}/**/*.twig`, reload);
  watch(`${themePath}/**/*.php`, reload);
  watch(`${themePath}/**/*.html`, reload);
}

// PHP
function php_fn() {
  connectPHP.server({
    port: 8000,
    open: false,
    hostname: '127.0.0.1',
    base: basePath,
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
function proxy_fn() {
  browserSync.init({
    ghostMode: false,
    ui: false,
    notify: false,
    proxy: browserSyncProxy
  });
}


const php = parallel(php_fn, watch_files);
const proxy = parallel(proxy_fn, watch_files);
const build = parallel(scss_prod, js_prod);

// Used for automated tests
function wp_test( done ){
  let {
    test_prompt,
    test_theme
  } = require('./prompt-test.js').default()

  theme = test_theme

  gulp.on('err', function(){
    process.exit(1);
  });

  return test_prompt().then(( res ) => {
    return wp_preflight( res );
  }).then(() => {
    return wp_setup();
  }).then(() => {
    return shell.task([
      'yarn run block test-block-create'
    ])();
  }).catch(( err ) => {
    process.stderr.write( colors.red.bold(err) + "\n" )
    done();
  })
}

export {
  wp_init,
  wp_setup,
  wp_preflight,
  wp_test,
  get_wp_cli,
  download_wp,
  copy_wp_base_theme,
  copy_git_pre_commit_hook,
  cleanup,
  scss_prod,
  js_prod,
  php,
  proxy,
  build
}

export default php;
