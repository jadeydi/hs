const webpack = require('webpack');

module.exports = {
  entry: ['./assets/javascripts/app.js'],
  output: {
    path: './public/javascripts',
    filename: 'app.js',
  },
  module: {
    loaders: [{
      test: /\.jsx?$/,
      exclude: /node_modules/,
      loader: 'babel-loader',
      query: {
        presets: ['react', 'es2015']
      }
    },
    {
      test: /\.css$/,
      loader: "style-loader!css-loader"
    },
      {
        test:   /\.scss$/,
        loader: 'style-loader!css-loader!sass-loader',
      }]
  },
  plugins: [
    new webpack.EnvironmentPlugin([
      "NODE_ENV"
    ]),
    new webpack.ProvidePlugin({
      $: "jquery",
      jQuery: "jquery",
      "window.jQuery": "jquery"
    }),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false,
      },
      output: {
        comments: false,
      },
    }),
  ]
}
