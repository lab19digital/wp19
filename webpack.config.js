var path    = require('path');
var webpack = require('webpack');
var theme       = require("./theme.json").theme;
var themeUrl    = 'wp/wp-content/themes/' + theme;

module.exports = {
  // devtool: 'sourcemap',
  entry: './' + themeUrl + '/js/main.js',
  output : {
    filename : './' + themeUrl + '/js/main.dist.js'
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
      },
      {
          test: require.resolve("jquery"), loader: "expose?$!expose?jQuery"
      }
    ]
  },
  plugins : [

    new webpack.optimize.UglifyJsPlugin({
        compress: {
            warnings: false
        }
    }),

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
