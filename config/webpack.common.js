const path = require("path");
const helpers = require("./helper");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const DefinePlugin = require('webpack/lib/DefinePlugin');
const ContextReplacementPlugin = require("webpack/lib/ContextReplacementPlugin");
const { AngularWebpackPlugin } = require('@ngtools/webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const entry = {
    polyfills: 'src/polyfills.ts',
    main: 'src/main.ts'
};
module.exports = (options) => {
    const isDev = process.env.NODE_ENV === 'dev' ? true: false;
    const isProd = process.env.NODE_ENV === 'prod' ? true: false;
    console.log("dev=>",isDev, "isProd=>", isProd);

    return {
        entry: entry,
        publicPath: '/',

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
                    type: 'asset/resource',
                    exclude: [helpers.root('src/index.html')]
                },

                {
                    test: /\.(svg|png|jpg|gif|eot|woff2|ttf)$i/,
                    type: "asset/resourse",
                    options: {
                        name: isProd ? "[path][name].[hash].[ext]" : "[path][name].[ext]",
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
                'NODE_ENV': JSON.stringify(process.env.NODE_ENV),
                'process.env.ASSET_PATH': JSON.stringify(ASSET_PATH)
            })
        ],
    }
}