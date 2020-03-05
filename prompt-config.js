import crypto from 'crypto';

let password = (crypto.randomBytes(256).toString('hex')).substr(0, 20);

export default [
  {
    type: 'input',
    name: 'dbname',
    message: 'Database Name',
    validate: function (value) {
      return value.length > 0;
    }
  }, {
    type: 'input',
    name: 'dbuser',
    message: 'Database User',
    default: 'root'
  }, {
    type: 'input',
    name: 'dbpassword',
    message: 'Database Password',
    default: 'root'
  }, {
    type: 'input',
    name: 'dbhost',
    message: 'Database Host',
    default: '127.0.0.1'
  }, {
    type: 'input',
    name: 'wpuser',
    message: 'WP-Admin User',
    default: 'admin'
  }, {
    type: 'input',
    name: 'wppassword',
    message: 'WP-Admin Password',
    default: password
  }, {
    type: 'input',
    name: 'wpemail',
    message: 'WP-Admin Email',
    default: 'admin@domain.com'
  }, {
    type: 'input',
    name: 'wptheme',
    message: 'Theme Name',
    default: 'default'
  }, {
    type: 'input',
    name: 'wpbaseurl',
    message: 'Base URL',
    default: 'http://localhost:8000'
  }, {
    type: 'input',
    name: 'wpsitetitle',
    message: 'Site Title',
    default: 'My Wordpress Site'
  }
];
