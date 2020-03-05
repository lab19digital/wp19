## Table of contents

- [Quick start](#quick-start)
- [WP19](#wp19)
- [Generate New Blocks](#generate-new-blocks)
- [BEM Linter](#bem-linter)
- [Versioning / Caching](#versioning--caching)

## Quick start

- `npm install -g gulp` _or_ `yarn global add gulp` _(Skip if you already have gulp installed)_

- `npm install` _or_ `yarn` _(Install dependencies)_

If setting up for the first time:

- `npm run setup` _or_ `yarn run setup` _(Run boilerplate setup)_

If cloning existing project:

- `npm run get-wp` _or_ `yarn run get-wp` _(Download latest WP & copy git hook for [versioning](#versioning--caching))_

Then:

- `npm run dev` _or_ `yarn run dev` _(Run dev environment)_

## WP19

Scaffold a WordPress project with a minimal starter theme using Timber/Twig, Bootstrap and Gulp.

Make sure you're running the latest version of NodeJS: [https://nodejs.org/en/download/](https://nodejs.org/en/download/).

- `yarn global add gulp` _(Skip if you already have gulp installed)_

- `git clone https://github.com/lab19digital/wp19.git . && yarn`

To setup a project from scratch:

- `yarn run setup`

If you are cloning an existing project:

- `yarn run get-wp`

To run a local development server after setting up or on cloning an existing project. This will start BrowserSync and watch for file changes. By default the site will serve from http://localhost:3000. You may need to wait a few seconds for BrowserSync to open the browser tab.

- `yarn run dev`

#### Out the box

This boilerplate includes:

- Latest WordPress
- Latest WP-CLI
- Timber/Twig
- Gulp and webpack for compiling JavaScript and SCSS
- BEM Linter for SCSS
- New build version number on every commit
- Easy way to generate new WP Blocks

#### Wordpress Plugins

Automatically installs the following plugins:

* timber-library (Twig templating)
* advanced-custom-fields
* wordpress-seo
* wp-migrate-db

Edit `package.json` if you want to install any of the following:

* contact-form-7
* custom-post-type-ui
* duplicate-post
* manual-image-crop
* wordfence

Also removes the hello and akismet plugins and standard themes.

#### JavaScript Plugins

Comes with jQuery, several other plugins are available but may not be imported by default:
- mustache
- parsleyjs
- gsap
- scrollmagic
- slick-carousel

## Generate New Blocks

`yarn run block block-name` _or_  `php wp-cli.phar generate_block block-name`

This will generate all the required boilerplate for a block using the _block-name_ specified, and also include the new _.scss_ file in the `main.scss` file. Once generated you can immediately start editing the custom fields to target this block.

## BEM Linter

A BEM (Block Element Modifier) linter has been setup and will run when the `scss` code is compiled. Add your __blocks (components)__ inside the `scss/blocks` folder and __utilities__ inside `scss/utils` folder. You can also enable the linter on files outside of this default folders by adding the comment `/** @define my-component */` at the top of the file. For more info about how to define components and utilities check the [documentation](https://github.com/postcss/postcss-bem-linter#define-componentsutilities-with-a-comment).

## Versioning / Caching

A git hook is added when setting up the boilerplate for the first time that will create a file with the _build version_ every time a new commit is made.

If you are cloning this repository after the boilerplate was setup or you need to set the hook again, run the task `gulp copy_git_pre_commit_hook` to copy the hook to your git hooks folder, next time you make a new commit the build version will be updated.

---

### A note about JavaScript implementation

We use Babel/ES6/Webpack to transpile ES6 JavaScript. This means it's easy to import modules into your code, but may have some issues with older libraries or libraries without commonJS implementation. You will see inside webpack.config.js that several aliases have been setup. You can uncomment these to get them working correctly.

You may require a similar approach for other JavaScript libraries.

### A word about the built in PHP server for Mac users

Mac users have reported issues with the built in PHP server not connecting to the MySQL database correctly. This seems to happen for MAMP users. A php.ini file is not defined for MAMP users when using the built in server. You should copy your MAMP php.ini file to /etc/

The command `php --ini` should tell you where to find the file you need.

For example:

- `/Applications/MAMP/bin/php/phpX.X.XX/conf`

Should be copied to:

- `/etc/`

Once this is done, the socket file for MySQL socket connections will be found. If this is not the case you need to confirm your socket files exists and is configured correctly in the PHP.ini file being used.

- `mysql.default_socket = /Applications/MAMP/tmp/mysql/mysql.sock`
- `pdo_mysql.default_socket = /Applications/MAMP/tmp/mysql/mysql.sock`

---

Created by [Lab19](https://lab19.dev/).
