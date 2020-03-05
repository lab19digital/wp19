// Dependencies
import gulp      from 'gulp';
import replace   from 'gulp-replace';
import rename    from 'gulp-rename';
import themeJSON from './theme.json';

let theme = themeJSON.theme;


export default () => {

  const res = {
    dbname: 'wp19_test',
    dbuser: 'root',
    dbpassword: '',
    dbhost: '127.0.0.1',
    wpuser: 'wp19-user',
    wppassword: 'wp19-password',
    wpemail: 'admin@domain.com',
    wptheme: 'wp19test',
    wpbaseurl: 'http://127.0.0.1',
    wpsitetitle: 'Test Site Title'
  }

  const createPromise = () => new Promise(async (resolve, reject) => {
    try {
      await promiseAll([
        gulp.src('./wp-config.template.php')
          .pipe(replace('{DB_NAME}', res.dbname))
          .pipe(replace('{DB_USER}', res.dbuser))
          .pipe(replace('{DB_PASSWORD}', res.dbpassword))
          .pipe(replace('{DB_HOST}', res.dbhost))
          .pipe(replace('{WP_USER}', res.wpuser))
          .pipe(replace('{WP_PASSWORD}', res.wppassword))
          .pipe(rename('wp-config.php'))
          .pipe(gulp.dest('./')),

        gulp.src('./wp-config-staging.php')
          .pipe(replace('{DB_NAME}', res.dbname))
          .pipe(replace('{WP_USER}', res.wpuser))
          .pipe(replace('{WP_PASSWORD}', res.wppassword))
          .pipe(gulp.dest('./')),

        gulp.src('./wp-cli.template.yml')
          .pipe(replace('{DB_NAME}', res.dbname))
          .pipe(replace('{DB_USER}', res.dbuser))
          .pipe(replace('{DB_PASSWORD}', res.dbpassword))
          .pipe(replace('{DB_HOST}', res.dbhost))
          .pipe(replace('{WP_USER}', res.wpuser))
          .pipe(replace('{WP_PASSWORD}', res.wppassword))
          .pipe(replace('{WP_EMAIL}', res.wpemail))
          .pipe(replace('{WP_BASE_URL}', res.wpbase))
          .pipe(replace('{WP_SITE_TITLE}', res.wpsitetitle))
          .pipe(rename('wp-cli.yml'))
          .pipe(gulp.dest('./')),

        gulp.src('./wp19/style.css')
          .pipe(replace('wp19', res.wpsitetitle))
          .pipe(gulp.dest('./wp19')),

        gulp.src('./theme.json')
          .pipe(replace(theme, res.wptheme))
          .pipe(gulp.dest('./'))
      ]);

      return resolve(res);
    }
    catch (err) {
      return reject(err);
    }
  });

  return {
    test_prompt: createPromise,
    test_theme: res.wptheme
  }

}


const promiseAll = (pipes) => {
  return Promise.all(pipes.map(each => {
    return new Promise((resolve, reject) => {
      each.on('end', resolve);
      each.on('error', reject);
    });
  }));
}
