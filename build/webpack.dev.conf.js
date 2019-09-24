const path = require('path');
const webpack = require('webpack');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const merge = require('webpack-merge');
const baseConfig = require('./webpack.base.conf');

const webpackConfig = merge(baseConfig, {
  mode: 'development',
  devtool: 'eval-source-map',
  devServer: {
    host: '0.0.0.0',
    publicPath: '/dist/',
    contentBase: path.resolve(__dirname, '../dist'),
    compress: true,
    open: true,
    watchContentBase: true,
    openPage: 'http://0.0.0.0:9000/dist/index.html',
    port: 9000
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('development')
    })
  ]
});

module.exports = webpackConfig;