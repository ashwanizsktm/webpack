// const {merge} = require('webpack-merge'); // used to merge webpack configs
// const common = require('./webpack.common'); // the settings that are common to prod and dev

// module.exports = () => {
//     return merge(common, {
//         mode: 'development',

//         devServer: {
//             historyApiFallback: true,
//             port: 8080
//         },
//     });
// }


const path = require("path");
const helpers = require("./helper");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const DefinePlugin = require('webpack/lib/DefinePlugin');
const { ContextReplacementPlugin } = require("webpack");
const { AngularWebpackPlugin } = require('@ngtools/webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = (options) => {
    const isDev = options.WEBPACK_SERVE;
    const isProd = !isDev

    return {
        mode: 'development',

        entry: {
            pollyfills: ['/src/polyfills'],
            main: ['/src/main']
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

                {
                    test: /\.(svg|png|jpg|gif|eot|woff2|ttf)$i/,
                    use: {
                        loader: "file-loader",
                        options: {
                            name: isProd ? "[path][name].[hash].[ext]" : "[path][name].[ext]",
                            outputPath: "imgs"
                        }
                    }
                },

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
                        isDev ? 'style-loader' : MiniCssExtractPlugin.loader,
                        {
                            loader: 'css-loader'
                        },
                        {
                            loader: "sass-loader"
                        }
                    ],
                    include : [helpers.root('src', 'styles')]
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
                title: 'corporate treasury',
                template: "src/index.html",
                gtmKey: '', // Google Tag Manager key
                minify: isProd
                    ? {
                        caseSensitive: true,
                        collapseWhitespace: true,
                        keepClosingSlash: true,
                        removeAttributeQuotes: true,
                        removeComments: true
                    }
                    : false
            }),

            new MiniCssExtractPlugin({
                filename: isDev ? '[name].css' : '[name].[hash].css',
                chunkFilename: isDev ? '[id].css' : '[id].[hash].css'
            }),

            new ContextReplacementPlugin(
                /angular(\\|\/)core/,
                helpers.root('src'),
                {}
            ),
            
            new AngularWebpackPlugin(),

            new DefinePlugin({
                'NODE_ENV': JSON.stringify(process.env.NODE_ENV)
            })
        ],
    }
}

