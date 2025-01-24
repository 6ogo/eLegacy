const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  entry: './src/client/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].[contenthash].js',
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react']
          }
        }
      },
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'postcss-loader'
        ]
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: 'asset/resource',
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/client/index.html',
      favicon: './src/client/assets/favicon.ico'
    }),
    new MiniCssExtractPlugin({
      filename: '[name].[contenthash].css'
    })
  ],
  resolve: {
    extensions: ['.js', '.jsx'],
    alias: {
      '@': path.resolve(__dirname, 'src/client')
    }
  },
  devServer: {
    historyApiFallback: true,
    hot: true,
    port: 3000,
    proxy: {
      '/api': 'http://localhost:5000',
      '/ws': {
        target: 'ws://localhost:5000',
        ws: true
      }
    }
  },
  optimization: {
    splitChunks: {
      chunks: 'all',
    },
  },
  performance: {
    hints: false
  }
};