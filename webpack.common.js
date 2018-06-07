const path = require('path');
const theme = require('./theme.json').theme;
const themeUrl = `wp/wp-content/themes/${theme}`;

module.exports = {
  entry: `./${themeUrl}/js/main.js`,
  output: {
    path: path.resolve(__dirname, `${themeUrl}/dist`),
    filename: '[name].js'
  },
  module: {
    rules: [
      {
        test: /\.js?$/,
        exclude:  [
          path.resolve(__dirname, 'node_modules')
        ],
        loader: 'babel-loader'
      }, {
        test: require.resolve('jquery'),
        loader: 'expose-loader?jQuery!expose-loader?$'
      }
    ]
  },
  resolve: {
    modules: ['node_modules'],
    extensions: ['.js', '.json', '.jsx'],
    alias: {
      // jquery: 'jquery',
      // timelinelite: path.resolve(__dirname, 'node_modules/gsap/src/uncompressed/TimelineLite.js'),
      // timelinemax: path.resolve(__dirname, 'node_modules/gsap/src/uncompressed/TimelineMax.js'),
      // tweenlite: path.resolve(__dirname, 'node_modules/gsap/src/uncompressed/TweenLite.js'),
      // tweenmax: path.resolve(__dirname, 'node_modules/gsap/src/uncompressed/TweenMax.js'),
      // scrollmagic: path.resolve(__dirname, 'node_modules/scrollmagic/uncompressed/ScrollMagic.js'),
      // scrollmagicAnimationGsap: path.resolve(__dirname, 'node_modules/scrollmagic/uncompressed/plugins/animation.gsap.js'),
      // scrollmagicDebugAddIndicators: path.resolve(__dirname, 'node_modules/scrollmagic/uncompressed/plugins/debug.addIndicators.js')
    }
  }
}
