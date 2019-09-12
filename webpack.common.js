const path = require('path');
const theme = require('./theme.json').theme;
const themeUrl = `wp/wp-content/themes/${theme}`;

module.exports = {
  entry: {
    main: `./${themeUrl}/js/main.js`
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, `${themeUrl}/dist`)
  },
  module: {
    rules: [
      {
        test: /\.js?$/,
        exclude:  [/node_modules/],
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
      'TweenLite': 'gsap/src/uncompressed/TweenLite.js',
      'TweenMax': 'gsap/src/uncompressed/TweenMax.js',
      'TimelineLite': 'gsap/src/uncompressed/TimelineLite.js',
      'TimelineMax': 'gsap/src/uncompressed/TimelineMax.js',
      'ScrollMagic': 'scrollmagic/scrollmagic/uncompressed/ScrollMagic.js',
      'animation.gsap': 'scrollmagic/scrollmagic/uncompressed/plugins/animation.gsap.js',
      'debug.addIndicators': 'scrollmagic/scrollmagic/uncompressed/plugins/debug.addIndicators.js'
    }
  }
}
