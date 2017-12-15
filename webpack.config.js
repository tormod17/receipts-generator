const path = require('path');
const webpack = require('webpack');
const extractTextPlugin = require('extract-text-webpack-plugin');

const HtmlWebpackPlugin = require('html-webpack-plugin');

const HtmlWebpackPluginConfig = new HtmlWebpackPlugin({
  template: './public/blogger.html',
  filename: 'blogger.html',
  inject: 'body'
});

var cssName = 'index.css';

const extractText =  new extractTextPlugin(cssName);


module.exports = {
  entry: ['./src/index.css', './src/index.js'],
  output: {
    path:  path.resolve('public'),
    filename: 'index_bundle.js'
  },
  plugins: [
    extractText,
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery'
    })
  ],
 
  module: {
    loaders: [
    {
      test: /\.css$/,  
      exclude: /node_modules/,  
      loader: ['style-loader', 'css-loader']
    },{
      test: /\.scss$/,
      loaders: ['style-loader', 'css-loader', 'sass-loader']
    },{ 
      test: /\.(png|woff|woff2|eot|ttf|svg|jpg|jpeg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
      loader: 'url-loader?limit=10000&mimetype=application/font-woff'
    },{
      test: /\.less$/,
      loader: 'style!css!less'
    },{ 
      test: /\.jsx?$/, 
      loader: 'babel-loader',
      exclude: /node_modules/,
      query: {
        cacheDirectory: true,
        presets:[ 'es2015', 'react', 'stage-2' ]
      }
    }]
  }
};
