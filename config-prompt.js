import crypto from "crypto";
let password = crypto.randomBytes(12).toString('hex');

export default [
      {
        type : 'input',
        name : 'db',
        message : 'Database name',
        validate : function( val ){
          return val.length > 0;
        }
      },
        {
        type : 'input',
        name : 'user',
        message : 'Database user',
        default : 'root'
      },
      {
        type : 'input',
        name : 'password',
        message : 'Database password',
        default : 'root'
      },
      {
        type : 'input',
        name : 'wpuser',
        message : 'WP-Admin user',
        default : 'admin'
      },
      {
        type : 'input',
        name : 'wppass',
        message : 'WP-Admin password',
        default : password
      },
      {
        type : 'input',
        name : 'wpemail',
        message : 'WP-Admin email',
        default : 'admin@example.com'
      },
      {
        type : 'input',
        name : 'wpbase',
        message : 'Base url',
        default : 'http://localhost:8000'
      },
      {
        type : 'input',
        name : 'wpsitetitle',
        message : 'Site title',
        default : 'My wordpress site'
      }
];