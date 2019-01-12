"use strict";

const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");

console.log("Node environment", process.env.NODE_ENV);
const devMode = process.env.NODE_ENV !== 'production';

if (process.env.NODE_ENV !== "development" && process.env.NODE_ENV !== "production") {
    throw new Error("NODE_ENV is required, values are 'development' or 'production'");
}

let config = {
    mode: devMode ? 'development' : 'production',
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
        new MiniCssExtractPlugin({
            filename: devMode ? '[name].css' : '[name].[hash].css',
        }),
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
        }),
        new CopyWebpackPlugin([
            {from: "app/images/", to: "images/"}, {from: "app/runtime"}
        ])
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
            // use: MiniCssExtractPlugin.loader{
            //     fallback: "style-loader",
            //     use: "css-loader",
            //     publicPath: "/dist"
            // })
            use: [
                devMode ? 'style-loader' :
                {
                    loader: MiniCssExtractPlugin.loader,
                    options: {
                        publicPath: 'dist'
                    }
                },
                'css-loader'
            ]
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
}

module.exports = config;
