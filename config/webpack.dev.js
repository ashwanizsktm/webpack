const path = require("path");
const helpers = require("./helper");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { ContextReplacementPlugin } = require("webpack");
const { AngularWebpackPlugin } = require('@ngtools/webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyWebpackPlugin = require("copy-webpack-plugin");

const ASSET_PATH = process.env.ASSET_PATH || '/';

module.exports = () => {
    /*
    this expression is not required now. while using webpack merge needs to be uncommented.
    const isDev = process.env.NODE_ENV === 'dev' ? true: false;
    const isProd = !isDev;
   */
    return {
        mode: 'development',

        entry: {
            pollyfills: ['/src/polyfills'],
            main: ['/src/main']
        },

        output: {
            path: helpers.root('dist'),
            publicPath: ASSET_PATH,
            filename: "[name].bundle.js",
            chunkFilename: "[id].chunk.js",
        },

        resolve: {
            extensions: ['.ts', '.js', '.json', '.tsx'],

            modules: [helpers.root('src'), helpers.root('node_modules')],

            alias: {
                "@app": path.resolve(helpers.root('src'), 'app'),
                "@configs": path.resolve(helpers.root('src'), 'configs')
            },
        },

        module: {
            rules: [
                {
                    test: /\.html$/i,
                    use: 'raw-loader',
                    exclude: [helpers.root('src/index.html')]
                },

                /*
                need to debug to add hash and minification.
                {
                    test: /\.(jpe?g|png|gif|svg)$/i,
                    loader: 'file-loader',
                    options: {
                        name: '/assets/images/[name].[ext]'
                    }
                },
                */

                {
                    test: /\.[cm]?js$/,
                    use: {
                        loader: 'babel-loader',
                        options: {
                            cacheDirectory: true,
                            compact: false,
                            plugins: ['@angular/compiler-cli/linker/babel'],
                        },
                    },
                },

                {
                    test: /(?:\.ngfactory\.js|\.ngstyle\.js|\.ts)$/,
                    loader: '@ngtools/webpack'
                },

                {
                    test: /\.(css|scss)$/i,
                    use: [
                        {
                            loader: "style-loader"
                        },
                        {
                            loader: 'css-loader'
                        },
                        {
                            loader: "sass-loader"
                        }
                    ],
                    include: [helpers.root('src', 'styles')]
                }
            ]
        },
        plugins: [
            /*
             * Plugin: HtmlWebpackPlugin
             * Description: Simplifies creation of HTML files to serve your webpack bundles.
             * This is especially useful for webpack bundles that include a hash in the filename
             * which changes every compilation.
             *
             * See: https://github.com/ampedandwired/html-webpack-plugin
             */
            new HtmlWebpackPlugin({
                title: 'webpack angular',
                template: "src/index.html",
                inject: 'body',
            }),

            new MiniCssExtractPlugin({
                filename: '[name].css',
                chunkFilename: '[id].css'
            }),

            // new ContextReplacementPlugin(
            //     /angular(\\|\/)core/,
            //     helpers.root('src'),
            //     {}
            // ),

            new AngularWebpackPlugin(),

            	/*
			* this plugins are actually copying assets from src and putting into the dist 
			* without adding contenthash and minification so commenting for now.
			*/
			new CopyWebpackPlugin({
				patterns: [
					{ from: 'src/assets', to: 'assets' }
				]
			}),
        ]
    }
}