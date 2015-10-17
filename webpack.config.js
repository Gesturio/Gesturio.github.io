var path = require("path");
var etx = require("extract-text-webpack-plugin");
module.exports = {
    context: __dirname,
    entry: "./src/app.coffee",
    output: {
        path: path.join(__dirname, "dist"),
        filename: "app.js"
    },
    module: {
        loaders: [
            { test: "\.js$", loader: "file-loader" },
            { test: /\.coffee$/, loader: "coffee-loader" },
            { test: /\.less$/,   loader: etx.extract("style-loader","css-loader?minimize!postcss-loader!less-loader")},
            { test: /\.css$/,    loader: etx.extract("style-loader", "css-loader?minimize!") }
        ]
    }
};