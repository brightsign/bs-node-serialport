'use strict';
const path = require('path');

module.exports = {
  devtool: 'inline-source-map',
  entry: './src/index.js',
  output: {
    filename: './bundle.js',
    path: path.resolve(__dirname, 'dist')
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'ts-loader',
        options: {
          // this will disable any type checking
          transpileOnly: true,
        }
      }
    ]
  },
  target: 'node',
  resolve: {
    extensions: ['.ts', '.tsx', '.js']
  },
  externals: {
    '@brightsign/serialport': 'commonjs @brightsign/serialport',
    '@brightsign/serialportlist': 'commonjs @brightsign/serialportlist',
    '/usr/lib/node_modules/@brightsign/serialport-nodejs/package.json': 'commonjs /usr/lib/node_modules/@brightsign/serialport-nodejs/package.json',
  }
};
