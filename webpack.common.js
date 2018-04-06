var path     = require('path');
var webpack  = require('webpack');
var theme    = require("./theme.json").theme;
var themeUrl = 'wp/wp-content/themes/' + theme;

module.exports = {
  entry: './' + themeUrl + '/js/main.js',
  output: {
    path: path.resolve(__dirname, themeUrl + '/dist'),
    filename: '[name].js'
  },
  module: {
    rules: [
      {
        test: /\.js?$/,
        exclude: [
          /(node_modules|bower_components)/
        ],
        loader: 'babel-loader'
      }, {
        test: require.resolve('jquery'),
        loader: 'expose-loader?jQuery!expose-loader?$'
      }
    ]
  },
  resolve: {
    modules: [
      'node_modules'
    ],
    extensions: ['.js', '.json', '.jsx'],
    alias: {
      // TweenLite: path.resolve('node_modules', 'gsap/src/uncompressed/TweenLite.js'),
      // TweenMax: path.resolve('node_modules', 'gsap/src/uncompressed/TweenMax.js'),
      // TimelineLite: path.resolve('node_modules', 'gsap/src/uncompressed/TimelineLite.js'),
      // TimelineMax: path.resolve('node_modules', 'gsap/src/uncompressed/TimelineMax.js'),
      // ScrollMagic: path.resolve('node_modules', 'scrollmagic/scrollmagic/uncompressed/ScrollMagic.js'),
      // 'animation.gsap': path.resolve('node_modules', 'scrollmagic/scrollmagic/uncompressed/plugins/animation.gsap.js'),
      // 'debug.addIndicators': path.resolve('node_modules', 'scrollmagic/scrollmagic/uncompressed/plugins/debug.addIndicators.js'),
      // jQuery: 'jquery'
    }
  },
  target: 'web'
}
