const webpack = require('webpack')
const path = require('path')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const package = require('./package.json')

const ENV_PROD = 'production'
const ENV_DEV = 'development'
const ENV_HOST = 'host'
const env = (process.env.NODE_ENV && process.env.NODE_ENV.toLowerCase()) || ENV_DEV

const __DEV__ = env !== ENV_PROD
const __HOST__ = env === ENV_HOST
const GRAPHQL_URL = (() => {
  if (process.env.GRAPHQL_URL) {
    return process.env.GRAPHQL_URL
  } else if (__DEV__) {
    return 'https://dev.voamobileendpoints.com/server/graphql'
  } else {
    return 'https://prod.voamobileendpoints.com/server/graphql'
  }
})()

const srcDir = path.join(__dirname, 'src')

const GLOBAL_CSS = /globalStyle\.scss|node_modules\/mdi/

module.exports = {
  entry: [
    'react-hot-loader/patch',
    './src/index.tsx'
  ],
  output: {
    filename: 'index.js',
    path: path.join(__dirname, 'www'),
    publicPath: __HOST__ ? '/' : undefined
  },
  devServer: {
    port: 3000,
    historyApiFallback: true,
  },
  devtool: 'source-map',
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.json', '.scss', '.d.ts'],
    alias: {
      components: path.join(srcDir, 'components'),
      containers: path.join(srcDir, 'containers'),
      helpers: path.join(srcDir, 'helpers'),
      'redux-store': path.join(srcDir, 'redux-store'),
      routes: path.join(srcDir, 'routes'),
      labels: path.join(srcDir, 'labels'),
      svg: path.join(srcDir, 'svg'),
      react: path.join(__dirname, './node_modules/react'),
      static: path.join(__dirname, 'static'),
    }
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loaders: ['babel-loader']
      },
      {
        test: /\.graphql$/,
        exclude: /node_modules/,
        loaders: [{
          loader: 'graphql-tag/loader'
        }],
      },
      {
        test: /\.tsx?$/,
        loaders: [
          {
            loader: 'awesome-typescript-loader',
            options: {
              configFileName: path.join(__dirname, 'tsconfig.json')
            }
          }
        ]
      },
      {
        test: /\.s?css$/,
        loaders: [
          'style-loader',
          'css-loader?sourceMap&importLoaders=3&localIdentName=[name]__[local]___[hash:base64:5]',
          'postcss-loader?sourceMap',
          'resolve-url-loader?sourceMap',
          'sass-loader?sourceMap'
        ],
        include: GLOBAL_CSS
      },
      {
        test: /\.s?css$/,
        loaders: [
          'style-loader',
          'css-loader?sourceMap&modules&importLoaders=2&localIdentName=[name]__[local]___[hash:base64:5]',
          'resolve-url-loader',
          'sass-loader?sourceMap'
        ],
        exclude: GLOBAL_CSS
      },
      {
        test: /\.(jpg|png|gif|woff|woff2|eot|ttf|otf|svg)$/,
        loaders: [{
          loader: 'url-loader',
          options: {
            limit: 8 * 1024 * 1024, // 8 MB
            fallback: 'file-loader'
          }
        }]
      },
      {
        test: /\.json$/,
        loader: 'json-loader'
      }
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(env),
      'process.env.GRAPHQL_URL': JSON.stringify(GRAPHQL_URL),
      '__DEV__': JSON.stringify(__DEV__),
      '__HOST__': JSON.stringify(__HOST__),
    }),
    new HtmlWebpackPlugin({
      title: package.displayName,
      template: path.join(__dirname, 'src/index.ejs')
    }),
    new CopyWebpackPlugin([
      {
        from: path.join(__dirname, 'static/'),
        to: '.',
        toType: 'dir'
      }
    ]),
  ]
}
