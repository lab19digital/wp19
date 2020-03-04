// Dependencies
import { src, dest } from 'gulp';
import replace           from 'gulp-replace';
import rename            from 'gulp-rename';
import themeJSON         from './theme.json';

let theme = themeJSON.theme;

export default () => {

  const res = {
    db: 'wp19_test',
    user: 'root',
    password: '',
    host: '127.0.0.1',
    wpuser: 'wp19-user',
    wppass: 'wp19-pass',
    wpemail: 'admin@example.com',
    wpsitetitle: 'test site title',
    wpbase: 'http://127.0.0.1',
    wptheme: 'wp19test'
  }

  const createPromise = () => new Promise(( resolve, reject ) => {
    return promiseAll([
      src('./wp-config.template.php')
        .pipe(replace('{DB_NAME}', res.db))
        .pipe(replace('{DB_USER}', res.user))
        .pipe(replace('{DB_PASSWORD}', res.password))
        .pipe(replace('{DB_HOST}', res.host))
        .pipe(replace('{WP_USER}', res.wpuser))
        .pipe(replace('{WP_PASSWORD}', res.wppass))
        .pipe(rename('wp-config.php'))
        .pipe(dest('./')),

      src('./wp-config-staging.php')
        .pipe(replace('{DB_NAME}', res.db))
        .pipe(replace('{WP_USER}', res.wpuser))
        .pipe(replace('{WP_PASSWORD}', res.wppass))
        .pipe(dest('./')),

      src('./wp-cli.template.yml')
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
        .pipe(dest('./')),

      src('./wp19/style.css')
        .pipe(replace('wp19', res.wpsitetitle))
        .pipe(dest('./wp19')),

      src('./theme.json')
        .pipe(replace(theme, res.wptheme))
        .pipe(dest('./'))

    ]).then( () => {
      resolve( res )
    }).catch( err  => {
      reject( err );
    });
  })

  return {
    test_prompt: createPromise,
    test_theme: res.wptheme
  }
}


const promiseAll = ( pipes ) => {
  return Promise.all(pipes.map(( each ) => {
    return new Promise( (resolve, reject) => {
      each.on('end', resolve )
      each.on('error', reject )
    })
  }))
}
