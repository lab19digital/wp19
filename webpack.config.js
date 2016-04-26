var path    = require('path');
var webpack = require('webpack');

module.exports = {
  // devtool: 'sourcemap',
  entry: './wordpress/wp-content/themes/default/js/main.js',
  output : {
    filename : './wordpress/wp-content/themes/default/js/main.dist.js'
  },
  module: {
    loaders: [
      {
        test: /\.js?$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel', // 'babel-loader' is also a legal name to reference
        query: {
          presets: ['es2015']
        }
      }
    ]
  },
  plugins : [

    new webpack.optimize.UglifyJsPlugin({
        compress: {
            warnings: false
        }
    }),

    new webpack.ProvidePlugin({
        $: "jQuery",
        jQuery: "jQuery",
        jquery: "jQuery",
        "window.jQuery": "jQuery"
    })

  ],
  resolve: {
    extensions: ['', '.js', '.jsx'],
    alias: {
        // You may need to use these aliases for GSAP
        // "TweenLite": path.resolve('node_modules', 'gsap/src/uncompressed/TweenLite.js'),
        // "TweenMax": path.resolve('node_modules', 'gsap/src/uncompressed/TweenMax.js'),
        // "TimelineLite": path.resolve('node_modules', 'gsap/src/uncompressed/TimelineLite.js'),
        // "TimelineMax": path.resolve('node_modules', 'gsap/src/uncompressed/TimelineMax.js'),
        // "ScrollMagic": path.resolve('node_modules', 'scrollmagic/scrollmagic/uncompressed/ScrollMagic.js'),
        // "animation.gsap": path.resolve('node_modules', 'scrollmagic/scrollmagic/uncompressed/plugins/animation.gsap.js'),
        // "debug.addIndicators": path.resolve('node_modules', 'scrollmagic/scrollmagic/uncompressed/plugins/debug.addIndicators.js'),
        // "jQuery":"jquery"
    }
  }
};
