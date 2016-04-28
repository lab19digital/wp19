# Start here 

// You can skip this step if you already have gulp installed
npm install -g gulp

npm install

gulp wpsetup (Builds an installation from scratch)


# wp19

Scaffold a Wordpress project with a minimal starter theme in Bootstrap using Gulp.

Make sure you're running the latest version of NodeJS: [https://nodejs.org/en/download/](https://nodejs.org/en/download/). You should also have gulp and bower installed.
	
	npm install -g gulp bower
	git clone https://github.com/lab19digital/wp19.git . && npm install

To build an installation from scratch

	gulp wpsetup

To run the server after build or on an existing project

	gulp php

This generator includes:

* Latest wordpress
* Latest wp-cli
* Gulp for compiling JavaScript, Sass, or Less (or whatever else you need)
* Webpack for compiling JavaScript

After installation the server will run automatically. A theme called "default" is generated. To start the server in future, run <code>gulp php</code> from the root.

**Sass**
We're using Less until Bootstrap 4 comes out, at which time we'll be switching over to Sass, which is why it's also included but optional for use.

**Wordpress Plugins**
Automatically installs the following plugins:

* advanced-custom-fields
* yoast-seo
* wordfence
* timber (twig)

Also removes the hello plugin and standard themes

**JavaScript Plugins**

Created by <a href="http://lab19digital.com">Lab19 Digital</a>.