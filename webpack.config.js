"use strict";

const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");

console.log("Node environment", process.env.NODE_ENV);

if (process.env.NODE_ENV !== "development" && process.env.NODE_ENV !== "production") {
    throw new Error("NODE_ENV is required, values are 'development' or 'production'");
}

let config = {
    entry: path.resolve(__dirname, "app/main.tsx"),
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "[name]-[hash].min.js",
        publicPath: "/"
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: "app/index.tpl.html",
            inject: "body",
            filename: "index.html"
        }),
        new ExtractTextPlugin("[name]-[hash].min.css"),
        new webpack.NoEmitOnErrorsPlugin(),
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
        }),
        new CopyWebpackPlugin([
            {from: "app/images/", to: "images/"}, {from: "app/runtime"}
        ]),
        new webpack.optimize.CommonsChunkPlugin({
            name: 'vendor',
            minChunks: function (module) {
                // this assumes your vendor imports exist in the node_modules directory
                return module.context && module.context.indexOf('node_modules') !== -1;
            }
        }),
    ],
    resolve: {
        // Add '.ts' and '.tsx' as resolvable extensions.
        extensions: [".webpack.js", ".web.js", ".ts", ".tsx", ".js"]
    },
    module: {
        rules: [{
            test: /\.tsx?$/,
            use: {loader:"awesome-typescript-loader"}
        }, {
            test: /\.css$/,
            use: ExtractTextPlugin.extract({
                fallback: "style-loader",
                use: "css-loader",
                publicPath: "/"
            })
        }, {
            test: /\.(ttf|eot|woff2|svg|png|woff|php)$/,
            use: {loader: "file-loader?name=assets/[name].[ext]"}
        }, {
            test: /\.(jpg|jpeg)$/,
            use: {loader: "file-loader?name=images/[name].[ext]"}
        }]
    }
};

if (process.env.NODE_ENV === "development") {
    config.devtool = "source-map";
} else {
    config.plugins.push(
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false,
                screw_ie8: true
            }
        }));
}

module.exports = config;
