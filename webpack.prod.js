const path = require("path");
const common = require("./webpack.common");
const {merge} = require("webpack-merge");
const {CleanWebpackPlugin} = require("clean-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const TerserPlugin = require("terser-webpack-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin');
// const {PurgecssPlugin} = require('purgecss-webpack-plugin');
// const glob = require('glob');
const PATHS = {
    src: path.join(__dirname, 'src')
}

module.exports = merge(common, {
    mode: 'production',
    output: {
        filename: "[name].[contenthash].bundle.js",
        path: path.resolve(__dirname, "dist")
    },
    optimization: {
        minimizer: [
            new OptimizeCssAssetsPlugin(),
            new TerserPlugin()
        ],

        splitChunks: {
            cacheGroups: {
                styles: {
                    name: 'styles',
                    test: /\.css$/,
                    chunks: 'all',
                    enforce: true
                }
            }
        }
    },

    plugins: [
        new MiniCssExtractPlugin({
            filename: "[name].[contentHash].bundle.css"
        }),

        // new PurgecssPlugin({
        //     paths: glob.sync(`${PATHS.src}/**/*`, { nodir: true }),
        //     only: ['bundle', 'vendor']
        // }),

        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({
            template: "./src/index.html",
            title: 'My App',
            filename: 'admin.html',
            minify: {
                removeAttributeQuotes: true,
                collapseWhitespace: true,
                removeComments: true
            }
        }),
    ],

    module: {
        rules: [
            {
                test: /\.scss$/,
                use: [
                    MiniCssExtractPlugin.loader,  //3. Extract css into files
                    "css-loader",   //2. Turn css into commonjs
                    "sass-loader"   //1. Turn sass into css
                ],
            }
        ]
    }
})