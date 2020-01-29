# Quick start

`npm install -g gulp` or `yarn global add gulp` (You can skip this step if you already have gulp installed)

`npm install` or `yarn`

`gulp wp_init` (Builds an installation from scratch)

`gulp cleanup` (Removes scaffolding files)

`gulp`

# wp19

Scaffold a Wordpress project with a minimal starter theme in Bootstrap using Gulp.

Make sure you're running the latest version of NodeJS: [https://nodejs.org/en/download/](https://nodejs.org/en/download/). You should also have gulp installed.

    npm install -g gulp
    git clone https://github.com/lab19digital/wp19.git . && npm install

To build an installation from scratch

    gulp wp_init

After installation, you will need to cleanup the scaffolding files (and remove the old repo)

    gulp cleanup

To run the server after build or on an existing project. This starts browsersync. By default the site will serve from http://localhost:3000. You may need to wait a few seconds for browsersync to open the tab.

    gulp php

## Out the box

This generator includes:

* Latest wordpress
* Latest wp-cli
* Gulp for compiling JavaScript, Sass (or whatever else you need)
* Webpack for compiling JavaScript

After installation the server will run automatically. A theme called "default" is generated. To start the server in future, run `gulp php` from the root.

#### Wordpress Plugins

Automatically installs the following plugins:

* timber-library (Twig templating)
* wordpress-seo
* wp-migrate-db

Edit `package.json` if you want to install any of the following:

* advanced-custom-fields
* contact-form-7
* custom-post-type-ui
* duplicate-post
* manual-image-crop
* wordfence

Also removes the hello and akismet plugins and standard themes

#### JavaScript Plugins

Comes with jQuery, several other plugins are available but may not be imported by default:
- mustache
- parsleyjs
- gsap
- scrollmagic
- slick-carousel

#### A note about JavaScript implementation

We use Babel/ES6/Webpack to transpile ES6 JavaScript. This means it's easy to import modules
into your code, but may have some issues with older libraries or libraries without commonJS
implementation. You will see inside webpack.config.js that several aliases have been setup
for GSAP for this purpose. You can uncomment these to get GSAP/Scrollmagic working correctly.

You may require a similar approach for other JavaScript libraries.

#### BEM (Block Element Modifier)

A bem linter has been setup and will run when the `scss` code is compiled. Add your **blocks (components)** inside the `scss/blocks` folder and **utilities** inside `scss/utils` folder. For more info about how to define components/utilities check the documentation https://github.com/postcss/postcss-bem-linter#define-componentsutilities-with-a-comment.

# A word about the built in PHP server for Mac users

Mac users have reported issues with the built in PHP server not connecting to the MySQL database correctly.
This seems to happen for MAMP users. A php.ini file is not defined for MAMP users when using the built
in server. You should copy your MAMP php.ini file to /etc/

The command `php --ini` should tell you where to find the file you need.

For example:

    /Applications/MAMP/bin/php/phpX.X.XX/conf

Should be copied to:

    /etc/

Once this is done, the socket file for MySQL socket connections will be found. If this is not the case
you need to confirm your socket files exists and is configured correctly in the PHP.ini file being used.

    mysql.default_socket = /Applications/MAMP/tmp/mysql/mysql.sock
    pdo_mysql.default_socket = /Applications/MAMP/tmp/mysql/mysql.sock

# Available gulp tasks

`gulp wp_init` - install wordpress / setup project  
`gulp build` - compile production ready files (minified & autoprefixed)  
`gulp proxy` - run BrowserSync proxying a local url, you need to modify `browserSyncProxy` setting  
`gulp php` - (default task) run the server and watch for files changes  



Created by <a href="https://lab19.dev/" target="_blank">Lab19 Digital</a>.
