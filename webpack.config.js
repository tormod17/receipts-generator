const path = require('path');
const webpack = require('webpack');
const extractTextPlugin = require('extract-text-webpack-plugin');

// const HtmlWebpackPlugin = require('html-webpack-plugin');

// // const HtmlWebpackPluginConfig = new HtmlWebpackPlugin({
// //   template: './public/blogger.html',
// //   filename: 'blogger.html',
// //   inject: 'body'
// // });

var cssName = 'index.css';

const extractText =  new extractTextPlugin(cssName);

module.exports = {
  entry: ['./src/index.css', './src/index.js'],
  output: {
    path:  path.resolve('build'),
    filename: 'index_bundle.js'
  },
  plugins: [
    extractText,
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery'
    })
  ],
  devServer: {
    contentBase:  path.resolve('public'),
    compress: true,
    port: 9000,
    proxy: {
           '/api': {
               target: 'http://localhost:3000',
               secure: false
           }
       }
  },
  watch: true,
  module: {
    loaders: [
    {
      test: /\.css$/,  
      include: [ 
        path.resolve(__dirname, "./src"),  
        path.resolve(__dirname, "node_modules/font-awesome"),
        path.resolve(__dirname, "node_modules/react-day-picker")
      ],
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
