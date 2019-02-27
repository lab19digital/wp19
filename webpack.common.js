const path = require('path');
const webpack = require('webpack');
const theme = require('./theme.json').theme;
const themeUrl = `wp-content/themes/${theme}`;

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
    extensions: ['.js', '.json', '.jsx']
  }
}
