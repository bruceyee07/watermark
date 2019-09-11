const path = require('path');
const webpack = require('webpack');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const HTMLWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode: 'development',
  entry: {
    app: './src/main.js'
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].bundle.js',
    library: 'WaterMark',
    libraryTarget: 'umd',
    libraryExport: 'default',
  },
  devtool: 'inline-source-map',
  devServer: {
    host: '0.0.0.0',
    publicPath: '/dist/',
    contentBase: path.resolve(__dirname, 'dist'),
    compress: true,
    open: true,
    watchContentBase: true,
    openPage: 'http://0.0.0.0:9000/dist/index.html',
    port: 9000
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: [
          { loader: 'babel-loader' }
        ]
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin(),
    new UglifyJsPlugin(),
    new HTMLWebpackPlugin({
      template: path.resolve(__dirname, 'index.html')
    }),
  ]
};