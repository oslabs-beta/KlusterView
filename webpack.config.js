/* eslint-disable no-unused-vars */
const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  entry: [
    // entry point of our app
    './client/index.tsx'
  ],
  target: 'web',
  output: {
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/',
    filename: 'bundle.js',
    clean: true
  },
  mode: process.env.NODE_ENV,
  devServer: {
    host: '0.0.0.0',
    port: 8080,
    // enable HMR on the devServer
    hot: true,
    // fallback to root for other urls
    historyApiFallback: true,

    static: {
      // match the output path
      directory: path.resolve(__dirname, 'dist'),
      // match the output 'publicPath'
      publicPath: '/'
    },

    headers: { 'Access-Control-Allow-Origin': '*' },
    /**
     * proxy is required in order to make api calls to
     * express server while using hot-reload webpack server
     * routes api fetch requests from localhost:8080/api/* (webpack dev server)
     * to localhost:3000/api/* (where our Express server is running)
     */
    proxy: {
      '/**': {
        target: 'http://0.0.0.0:3000/',
        secure: false,
        headers: {
          Connection: 'keep-alive'
        }
      }
    }
  },
  module: {
    rules: [
      {
        test: /.(js|jsx|ts|tsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              '@babel/preset-env',
              '@babel/preset-typescript',
              '@babel/preset-react'
            ]
          }
        }
      },
      // {
      //   test: /\.(ts|tsx)$/,
      //   exclude: /node_modules/,
      //   use: ['ts-loader'],
      // },
      {
        test: /.(css|scss)$/,
        //exclude: /node_modules/,
        use: [
          //MiniCssExtractPlugin.loader,
          'style-loader',
          'css-loader',
          {
            loader: 'sass-loader',
            options: {
              sourceMap: true
            }
          }
        ]
      },

      {
        test: /\.(png|jpg|gif)$/i,
        type: 'asset/resource',

        // Added:
        generator: {
          filename: 'images/[name]-[hash][ext]'
        }
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './client/index.html'
    }),
    new MiniCssExtractPlugin()
  ],
  resolve: {
    // Enable importing JS / JSX files without specifying their extension
    extensions: ['.js', '.jsx', '.mjs', '.ts', '.tsx']
  }
};
