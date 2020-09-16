const path = require('path');
const webpack = require('webpack');
const { merge } = require('webpack-merge'); //这里引入merge
const common = require('./webpack.config.js');

module.exports = merge(common, {
  //注意这里的写法
  plugins: [
    new webpack.DefinePlugin({
      CUT_APP_ENV: '"dev"',
    }),
  ],
});
