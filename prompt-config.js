import crypto from 'crypto';

let password = (crypto.randomBytes(20).toString(36)).substr(0,15);

export default [
  {
    type: 'input',
    name: 'db',
    message: 'Database Name',
    validate: function (value) {
      return value.length > 0;
    }
  }, {
    type: 'input',
    name: 'user',
    message: 'Database User',
    default: 'root'
  }, {
    type: 'input',
    name: 'password',
    message: 'Database Password',
    default: 'root'
  }, {
    type: 'input',
    name: 'wpuser',
    message: 'WP-Admin User',
    default: 'admin'
  }, {
    type: 'input',
    name: 'wppass',
    message: 'WP-Admin Password',
    default: password
  }, {
    type: 'input',
    name: 'wpemail',
    message: 'WP-Admin Email',
    default: 'admin@example.com'
  }, {
    type: 'input',
    name: 'wptheme',
    message: 'Theme Name',
    default: 'default'
  }, {
    type: 'input',
    name: 'wpbase',
    message: 'Base URL',
    default: 'http://localhost:8000'
  }, {
    type: 'input',
    name: 'wpsitetitle',
    message: 'Site Title',
    default: 'My Wordpress Site'
  }
];
