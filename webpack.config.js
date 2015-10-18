var path = require("path");
var ext = require("extract-text-webpack-plugin");
var HtmlWebpackPlugin = require('html-webpack-plugin');
module.exports = {
    context: __dirname,
    entry: "./src/app.coffee",
    output: {
        path: path.join(__dirname, "dist"),
        filename: "[hash]-app.js"
    },
    module: {
        loaders: [
            { test: /\.jpg$/, loader: 'file-loader'},
            { test: /\.js$/, loader: "file-loader" },
            { test: /\.html$/, loader: "file-loader" },
            { test: /\.coffee$/, loader: "coffee-loader" },
            { test: /\.less$/,   loader: ext.extract("style-loader","css-loader?minimize!postcss-loader!less-loader")},
            { test: /\.css$/,    loader: ext.extract("style-loader", "css-loader?minimize!") }
        ]
    },
    plugins: [new HtmlWebpackPlugin({
        template: "src/index.html",
        inject: true
    })]

};