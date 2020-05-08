'use strict';
const path = require('path');

module.exports = {
  devtool: 'inline-source-map',
  entry: './example/index.js',
  output: {
    filename: './bundle.js',
    path: path.resolve(__dirname + '/example', 'dist')
  },
  module: {
    rules: [{
      test: /\.tsx?$/,
      loader: 'ts-loader',
      options: {
        // this will disable any type checking
        transpileOnly: true,
      }
    }]
  },
  target: 'node',
  resolve: {
    extensions: ['.ts', '.tsx', '.js']
  }
};
