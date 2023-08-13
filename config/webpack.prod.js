
/**
 * Webpack Plugins 
 * these plugins are only required in production.
 */
const ReplaceInFileWebpackPlugin = require('replace-in-file-webpack-plugin');
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const {merge} = require("webpack-merge");
const commonWebpackConfig = require("./webpack.common")

// this all plugins are in the common as of now common is not getting merged with dev or prod env
// so we are using some of the samw config in dev and prod mode.

const path = require("path");
const helpers = require("./helper");
// const HtmlWebpackPlugin = require('html-webpack-plugin');
// const DefinePlugin = require('webpack/lib/DefinePlugin');
// const ContextReplacementPlugin = require("webpack/lib/ContextReplacementPlugin");
// const { AngularWebpackPlugin } = require('@ngtools/webpack');
// const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const ASSET_PATH = process.env.ASSET_PATH || '/';

module.exports = (options) => {
    const isProd = options.WEBPACK_BUILD;
    const isDev = !isProd;

    return merge(commonWebpackConfig, {
        mode: 'production',
        /**
         * recommended in webpack 5 devtools: sourceMap is not required in prod for some reasons
         * for more details explanation see the docs
         * see:- https://webpack.js.org/configuration/devtool/#production
        */

        // entry: {
        //     pollyfills: ['/src/polyfills'],
        //     main: ['/src/main']
        // },

        output: {
            path: helpers.root('dist'),
            publicPath: "",
            filename: "[name].[contenthash].bundle.js",
        },

        // resolve: {
        //     extensions: ['.ts', '.js', '.json', '.tsx'],
        //     modules: [helpers.root('src'), helpers.root('node_modules')],
        //     alias: {
        //         "@app": path.resolve(helpers.root('src'), 'app'),
        //         "@configs": path.resolve(helpers.root('src'), 'configs')
        //     },
        // },

        // module: {
        //     rules: [
        //         {
        //             test: /\.html$/i,
        //             type: 'asset/resource',
        //             exclude: [helpers.root('src/index.html')]
        //         },

        //         {
        //             test: /\.(svg|png|jpg|jpeg|gif|eot|woff2|ttf)$i/,
        //             type: "asset/resourse", 
        //             use: {
        //                 options: {
        //                     name: isProd ? "[path][name].[hash].[ext]" : "[path][name].[ext]",
        //                     outputPath: helpers.root('dist', 'assets')
        //                 }
        //             }
        //         },
        //       /**
        //        * File loader for supporting images, for example, in CSS files.*/
        //         {
        //             test: /\.(jpg|png|gif|svg)$/,
        //             use: {
        //                 options: {
        //                     loader: 'file-loader',
        //                     name: "[name].[contenthash].[ext]",
        //                 }
        //             }
        //         },

        //         {
        //             test: /\.(eot|woff2?|svg|ttf)([\?]?.*)$/,
        //             use: 'file-loader'
        //         },
        //         {
        //             test: /\.[cm]?js$/,
        //             use: {
        //                 loader: 'babel-loader',
        //                 options: {
        //                     cacheDirectory: true,
        //                     compact: false,
        //                     plugins: ['@angular/compiler-cli/linker/babel'],
        //                 },
        //             },
        //         },

        //         {
        //             test: /(?:\.ngfactory\.js|\.ngstyle\.js|\.ts)$/,
        //             loader: '@ngtools/webpack'
        //         },

        //         {
        //             test: /\.(css|scss)$/i,
        //             use: [
        //                 isDev ? 'style-loader' : MiniCssExtractPlugin.loader,
        //                 {
        //                     loader: 'css-loader'
        //                 },
        //                 {
        //                     loader: "sass-loader"
        //                 }
        //             ],
        //             include: [helpers.root('src', 'styles')]
        //         }
        //     ]
        // },

        optimization: {
            minimizer: [
                new TerserPlugin({
                    extractComments: false
                }
                 
                ),
                new CssMinimizerPlugin(),
            ],

            splitChunks: {
                chunks: 'all'
            },
            /** HashedModuleIdsPlugin → optimization.moduleIds: 'hashed'
             * replaced in webpack 5
             */
            moduleIds: 'deterministic'
        },

        plugins: [
            /*
             * Plugin: HtmlWebpackPlugin
             * Description: Simplifies creation of HTML files to serve your webpack bundles.
             * This is especially useful for webpack bundles that include a hash in the filename
             * which changes every compilation.
             * See: https://github.com/ampedandwired/html-webpack-plugin
             */

            // new HtmlWebpackPlugin({
            //     title: 'corporate treasury',
            //     template: "src/index.html",
            //     gtmKey: '', // Google Tag Manager key
            //     minify: isProd
            //         ? {
            //             caseSensitive: true,
            //             collapseWhitespace: true,
            //             keepClosingSlash: true,
            //             removeAttributeQuotes: true,
            //             removeComments: true
            //         }
            //         : false
            // }),

            // new MiniCssExtractPlugin({
            //     filename: isDev ? '[name].css' : '[name].[contenthash].css',
            // }),

            new ReplaceInFileWebpackPlugin([{
                dir: 'dist',
                test: /\.js$/,
                rules: [{
                    search: /\/assets\/images/ig,
                    replace: ASSET_PATH + 'assets/images'
                }]
            }]),

            /**
             * Visualize size of webpack output files with an interactive zoomable treemap.
             * see: - https://github.com/webpack-contrib/webpack-bundle-analyzer 
             */
            new BundleAnalyzerPlugin(),

            // new ContextReplacementPlugin(
            //     /angular(\\|\/)core/,
            //     helpers.root('src'),
            //     {}
            // ),
            /**
             * This plugin uses cssnano to optimize and minify your CSS.
             * more accurate with source maps and assets using query string, allows caching and works in parallel mode
             * see:- https://www.npmjs.com/package/css-minimizer-webpack-plugin
             */
            new CssMinimizerPlugin(),

            /**
             * Webpack 5.x plugin for the Angular Ahead-of-Time compiler. The plugin also supports Angular JIT mode.
             */
            // new AngularWebpackPlugin(),

            /**
             * A webpack plugin to remove/clean your build folder(s).
             * see: - https://www.npmjs.com/package/clean-webpack-plugin
            */
            new CleanWebpackPlugin(),

            // new DefinePlugin({
            //     'NODE_ENV': JSON.stringify(process.env.NODE_ENV),
            //     'process.env.ASSET_PATH': JSON.stringify(ASSET_PATH)
            // })
        ],
    });
}