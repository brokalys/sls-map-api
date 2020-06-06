const path = require('path');
const webpack = require('webpack');
const nodeExternals = require('webpack-node-externals');
const slsw = require('serverless-webpack');

require('dotenv').config();

const env = Object.entries(process.env).reduce(
  (common, [key, value]) => ({
    ...common,
    [`process.env.${key}`]: JSON.stringify(value),
  }),
  {},
);

module.exports = {
  entry: slsw.lib.entries,
  target: 'node',
  mode: 'production',
  externals: [nodeExternals()],
  plugins: [new webpack.DefinePlugin(env)],
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
      },

      {
        test: /\.(graphql|gql)$/,
        exclude: /node_modules/,
        loader: 'graphql-tag/loader',
      },
    ],
  },
  resolve: {
    alias: {
      lib: path.resolve(__dirname, './src/lib'),
    },
  },
  output: {
    libraryTarget: 'commonjs',
    path: path.join(__dirname, '.webpack'),
    filename: '[name].js',
  },
};
