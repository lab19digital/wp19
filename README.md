# wp19

Scaffold a Wordpress project with a minimal starter theme in Bootstrap using Gulp.

Make sure you're running the latest version of NodeJS: [https://nodejs.org/en/download/](https://nodejs.org/en/download/). You should also have gulp and bower installed.
	
	npm install -g gulp bower
	git clone https://github.com/lab19digital/wp19.git . && npm install

This generator includes:

* Latest wordpress
* Latest wp-cli
* Gulp for compiling JavaScript and Sass (or whatever else you need)

After installation the server will run automatically. A theme called "default" is generated. To start the server in future, run <code>gulp php</code> from the root.

**JavaScript**
JavaScript requirements are stored in the [theme_directory]/js/require.json and are compiled to ./js/dist/scripts.min.js

**Sass**
We're using Less until Bootstrap 4 comes out, at which time we'll be switching over to Sass. Less compilation is not built in for this reason (we're currently using lessc binary with Sublime Text). 

**Wordpress Plugins**
Automatically installs the following plugins:

* advanced-custom-fields
* yoast-seo
* wordfence

Also removes the hello plugin and standard themes

**JavaScript Plugins**
A bower.json file is included in the root and is used to setup the theme. It includes the following plugins we commonly use at Lab19:

* bootstrap
* tweenjs
* slick
* slick-carousel
* scrollmagic
* gsap
* mustache

Created by <a href="http://lab19digital.com">Lab19 Digital</a>.