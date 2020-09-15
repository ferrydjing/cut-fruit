const path = require('path');
const glob = require('glob');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const opimizeCss = require('optimize-css-assets-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const copyWebpackPlugin = require('copy-webpack-plugin');
var webpack = require('webpack');

module.exports = {
  entry: getEntry(),
  output: {
    filename: 'js/[name].[hash:8].js',
    // chunkFilename: '[name]-vendors-[hash:8].js',
    path: path.resolve(__dirname, 'dist'),
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        include: [path.resolve(__dirname, 'src')],
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
            plugins: ['@babel/plugin-transform-runtime'],
            // outputPath: 'js/'
          },
        },
      },

      {
        test: /\.scss$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              // publicPath: path.resolve(__dirname, 'dist')
              outputPath: 'css',
            },
          },
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              ident: 'postcss',
              sourceMap: true,
              plugins: (loader) => [
                // 可以配置多个插件
                require('autoprefixer')({
                  overrideBrowserslist: ['> 1%', 'last 2 versions', 'ie >= 8'],
                }),
              ],
            },
          },
          {
            loader: 'sass-loader',
            options: {
              sourceMap: true,
            },
          },
        ],
      },
      {
        test: /\.(png|gif|jpg|svg)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              esModule: false,
              limit: 1024,
              name: 'imgs/[name].[hash:8].[ext]',
              publicPath: '../',
            },
          },
        ],
      },
      // 路径
      {
        test: /\.html$/,
        use: [
          {
            loader: 'html-loader',
            options: {
              attrs: ['img:src'],
              // publicPath: './'
            },
          },
        ],
      },
      {
        test: /\.(woff|woff2|eot|ttf|ttc|otf)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: 'fonts/[name].[hash:8].[ext]',
              publicPath: '../',
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({
      // Options similar to the same options in webpackOptions.output
      // both options are optional
      filename: 'css/[name].[hash:8].css',
      chunkFilename: 'css/[id].css',
    }),
    new copyWebpackPlugin([
      {
        from: path.resolve(__dirname, './src/js/libs'),
        to: './js/libs',
        ignore: ['.*'],
      },
    ]),
    require('autoprefixer'),
  ],
  resolve: {
    extensions: ['.js', '.json', '.jsx', '.scss', '.css'], //用到文件的扩展名
    alias: {
      //模快别名列表
      '@': path.resolve(__dirname, 'src'),
    },
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        vendor: {
          // 抽离第三方插件
          test: /node_modules/, // 指定是node_modules下的第三方包
          chunks: 'initial',
          name: 'vendor', // 打包后的文件名，任意命名
          // 设置优先级，防止和自定义的公共代码提取时被覆盖，不进行打包
          priority: 10,
        },
      },
    },
    minimizer: [
      new TerserPlugin({
        cache: true, //是否缓存
        parallel: true, //是否并发打包，同时打包多个文件
        sourceMap: true, //打包后的代码与源码的映射，方便调试
        terserOptions: {
          output: {
            ecma: 4,
            beautify: false,
            comments: false,
          },
          compress: {
            drop_console: false,
          },
        },
      }),
      new opimizeCss({
        cssProcessor: require('cssnano'),
        cssProcessorOptions: {
          safe: true,
          discardComments: { removeAll: true },
        },
        canPrint: true,
      }),
    ],
  },
  devServer: {
    port: 3000,
    contentBase: './dist',
    open: true,
    progress: true,
    compress: true,
    publicPath: '/',
    disableHostCheck: true,
    host: '0.0.0.0',
    proxy: {
      //可以配置跨域
      '/server': {
        target: 'https://club.ufobot.com/api',
        changeOrigin: true,
        secure: false,
        pathRewrite: {
          '/server': '/',
        },
      },
    },
  },
};

// 获取html-webpack-plugin参数的方法
var getHtmlConfig = function (name, chunks) {
  return {
    template: `./src/${name}.html`,
    filename: `${name.slice(name.lastIndexOf('/') + 1)}.html`,
    hash: false, //开启hash  ?[hash]
    chunks: chunks,
    // favicon: './src/assets/imgs/favicon.png',
    // favicon: path.resolve(__dirname, 'src/assets/imgs/favicon.png'),
    minify:
      process.env.NODE_ENV === 'development'
        ? false
        : {
            removeComments: true, //移除HTML中的注释
            collapseWhitespace: false, //折叠空白区域 也就是压缩代码
            removeAttributeQuotes: true, //去除属性引用
          },
  };
};

function getEntry() {
  var entry = {};
  //读取src目录所有page入口
  glob.sync('./src/*.html').forEach(function (name) {
    var start = name.indexOf('src/') + 4,
      end = name.length - 4;
    var n = name.slice(start, end);
    n = n.slice(0, n.lastIndexOf('/')); //保存各个组件的入口
    entry[n] = `./src/js/${n}.js`;
  });
  return entry;
}

//配置页面
const entryObj = getEntry();
const htmlArray = [];
Object.keys(entryObj).forEach((element) => {
  htmlArray.push({
    _html: element,
    title: '',
    chunks: ['vendor', element],
  });
});
//自动生成html模板
htmlArray.forEach((element) => {
  module.exports.plugins.push(new HtmlWebpackPlugin(getHtmlConfig(element._html, element.chunks)));
});
