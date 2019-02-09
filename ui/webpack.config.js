// Copyright (c) 2018 Uber Technologies, Inc.
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.

// NOTE: To use this example standalone (e.g. outside of deck.gl repo)
// delete the local development overrides at the bottom of this file

// avoid destructuring for older Node version support
const resolve = require('path').resolve;
const join = require('path').join;
const webpack = require('webpack');
const path = require('path');


const CONFIG = {
  // bundle app.js and everything it imports, recursively.
  entry: {
    app: resolve('./src/main.js')
  },

  devtool: 'eval',

  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        include: join(__dirname, 'src'),
        exclude: [/node_modules/]
      },
      {
        // The example has some JSON data
        test: /\.json$/,
        loader: 'json-loader',
        exclude: [/node_modules/]
      },
      {
        test: /\.css$/,
        use: [
          { loader: "style-loader" },
          { loader: "css-loader" },
        ],
      }
      // {
      //   test: /\.svg$/,
      //   loader: 'svg-inline-loader'
      // }
      /*
      {
        test: /\.css$/,
        loader: 'style-loader'
      }, {
        test: /\.css$/,
        loader: 'css-loader',
        query: {
          modules: true,
          // localIdentName: '[name]__[local]___[hash:base64:5]'
        }
      }
      */
    ]
  },

  node: {
    fs: 'empty'
  },
};

const PROD = {
  output: {
      path: path.resolve(__dirname, '../src/main/resources/assets/'),
      filename: "bundle.js"
  },

  // bundle app.js and everything it imports, recursively.
  entry: {
    app: resolve('./src/main.js')
  },

  devtool: 'eval',

  module: {
    rules: [
      {
        test: /\.(png|jpg|gif)$/,
        use: [
          {
            loader: 'file-loader',
            options: {},
          },
        ],
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        include: join(__dirname, 'src'),
        exclude: [/node_modules/]
      },
      {
        // The example has some JSON data
        test: /\.json$/,
        loader: 'json-loader',
        exclude: [/node_modules/]
      },
      {
        test: /\.css$/,
        use: [
          { loader: "style-loader" },
          { loader: "css-loader" },
        ],
      }
      /*
      {
        test: /\.css$/,
        loader: 'style-loader'
      }, {
        test: /\.css$/,
        loader: 'css-loader',
        query: {
          modules: true,
          //localIdentName: '[name]__[local]___[hash:base64:5]'
        }
      }
      */
    ]
  },

  node: {
    fs: 'empty'
  },
};



// This line enables bundling against src in this repo rather than installed deck.gl module
//module.exports = [CONFIG, PROD];
module.exports = [PROD];
