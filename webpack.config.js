"use strict";

var path = require("path");
var webpack = require("webpack");
var HtmlWebpackPlugin = require("html-webpack-plugin");
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var CopyWebpackPlugin = require("copy-webpack-plugin");

console.log("Node environment ", process.env.NODE_ENV);

if (process.env.NODE_ENV !== "development" && process.env.NODE_ENV !== "production") {
  throw new Error("NODE_ENV is required, values are 'development' or 'production'");
}

var config = {
  plugins: [
    new HtmlWebpackPlugin({
      template: "app/index.tpl.html",
      inject: "body",
      favicon: "app/favicon.ico",
      filename: "index.html"
    }),
    new ExtractTextPlugin("[name]-[hash].min.css"),
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.NoErrorsPlugin(),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
    }),
    new webpack.ProvidePlugin({
      $: "jquery",
      jQuery: "jquery"
    })
  ],
  module: {
    loaders: [{
      test: /\.js?$/,
      exclude: /node_modules/,
      loader: "babel"
    }, {
      test: /\.css$/,
      loader: ExtractTextPlugin.extract("style", "css")
    }, {
      test: /\.(ttf|eot|woff2|svg|png|woff|php)$/,
      loader: "file-loader?name=assets/[name].[ext]"
    }, {
      test: /\.(jpg|jpeg)$/,
      loader: "file-loader?name=images/[name].[ext]"
    }]
  }
};

if (process.env.NODE_ENV === "development") {
  config.devtool = "eval";
  config.entry = [
    "webpack-hot-middleware/client?reload=true",
    path.resolve(__dirname, "app/main.js")
  ];
  config.output = {
    path: path.resolve(__dirname, "dist"),
    filename: "[name].js",
    publicPath: "/"
  };
  config.plugins.push(new CopyWebpackPlugin([
    {from: "app/images/", to: "images/"}, {
      from: "app/extras"
    }
  ]));
  config.plugins.push(new webpack.HotModuleReplacementPlugin());
} else {
  config.entry = [
    path.resolve(__dirname, "app/main.js")
  ];
  config.output = {
    path: path.resolve(__dirname, "dist"),
    filename: "[name]-[hash].min.js",
    publicPath: "/"
  };
  config.plugins.push(new CopyWebpackPlugin([
    {from: "app/images/", to: "images/"}, {
      from: "app/extras"
    }, {from: "app/runtime"}
  ]));
  config.plugins.push(new webpack.optimize.UglifyJsPlugin({
    compressor: {
      warnings: false,
      screw_ie8: true
    }
  }));
}

module.exports = config;
