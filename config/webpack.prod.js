/***
 * Ref: https://github.com/mishoo/UglifyJS2/tree/harmony#minify-options
 * @param supportES2015
 * @param enableCompress disabling compress could improve the performance, see https://github.com/webpack/webpack/issues/4558#issuecomment-352255789
 * @returns {{ecma: number, warnings: boolean, ie8: boolean, mangle: boolean, compress: {pure_getters: boolean, passes: number}, output: {ascii_only: boolean, comments: boolean}}}
 */
function getTerserOptions(supportES2015, enableCompress) {
	const uglifyCompressOptions = {
		pure_getters: true /* buildOptimizer */,
		passes: 2 /* buildOptimizer */
	};

	return {
		ecma: supportES2015 ? 6 : 5,
		ie8: false,
		mangle: true,
		compress: enableCompress ? uglifyCompressOptions : false,
		output: {
			ascii_only: true,
		}
	};
}
/**
 * Webpack Plugins 
 * these plugins are only required in production.
 */
const ReplaceInFileWebpackPlugin = require('replace-in-file-webpack-plugin');
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

// this all plugins are in the common as of now common is not getting merged with dev or prod env
// so we are using some of the same config in dev and prod mode.

const path = require("path");
const helpers = require("./helper");
const HtmlWebpackPlugin = require('html-webpack-plugin');
// const ContextReplacementPlugin = require("webpack/lib/ContextReplacementPlugin");
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
		mode: 'production',

		entry: {
			pollyfills: ['/src/polyfills'],
			main: ['/src/main'],
		},

		output: {
			path: helpers.root('dist'),
			publicPath: ASSET_PATH,
			filename: "[name].[contenthash].bundle.js",
			chunkFilename: "[id].[contenthash].chunk.js",
		},

		resolve: {
			extensions: ['.ts', '.js', '.json', '.tsx', '.jpg'],
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

				/* 
				 Need to debug to add contenthash and minification & adding svg loader.
				{
					test: /\.(jpe?g|png|gif|svg)$/i,
					loader: 'file-loader',
					options: {
						name: '/assets/images/[name].[ext]'
					}
				},
				*/

			   // File loader for supporting images, for example, in CSS files.
				{
					test: /\.(jpg|png|gif|svg)$/,
					use: 'file-loader'
				},

				// File loader for supporting fonts, for example, in CSS files.
				{
					test: /\.(eot|woff2?|ttf)([\?]?.*)$/,
					use: 'file-loader'
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
					test: /\.(c|sc)ss$/i,
					use: [MiniCssExtractPlugin.loader, { loader: 'css-loader' }, { loader: "sass-loader" }],
					include: [helpers.root('src', 'styles')]
				}
			]
		},

		optimization: {
			minimizer: [
				new TerserPlugin({
					extractComments: false,
				}),

				new CssMinimizerPlugin(),
			],
			minimize: true,
			splitChunks: {
				chunks: 'all'
			},

			/** HashedModuleIdsPlugin → optimization.moduleIds: 'deterministic'
			 * replaced in webpack 5
			 * deterministic option is useful for long term caching, but still results in smaller bundles compared to hashed
			 */
			moduleIds: 'deterministic',
		},

		plugins: [
			/*
			 * Plugin: HtmlWebpackPlugin
			 * Description: Simplifies creation of HTML files to serve your webpack bundles.
			 * This is especially useful for webpack bundles that include a hash in the filename
			 * which changes every compilation.
			 * See: https://github.com/ampedandwired/html-webpack-plugin
			 */

			new HtmlWebpackPlugin({
				title: 'webpack angular',
				template: "src/index.html",
				gtmKey: '', // Google Tag Manager key
				inject: 'body',
				minify: {
					caseSensitive: true,
					collapseWhitespace: true,
					keepClosingSlash: true,
					removeAttributeQuotes: true,
					removeComments: true
				}
			}),

			new MiniCssExtractPlugin({
				filename: '[name].[contenthash].css'
			}),

			/**
			 * The [contenthash] placeholder is the best option because it depends on the sprite content.
			 *  Cache placeholders are expensive in build performance, use it only in production mode.
			 */

			new ReplaceInFileWebpackPlugin([{
				dir: 'dist',
				test: /\.js$/,
				rules: [{
					search: /\/assets\/images/,
					replace: ASSET_PATH + 'assets/images'
				}]
			}]),

			/**
			 * Visualize size of webpack output files with an interactive zoomable treemap.
			 * see: - https://github.com/webpack-contrib/webpack-bundle-analyzer 
			 */
			new BundleAnalyzerPlugin(),

			/** ContextReplacementPlugin helps to run all the angular dependencies  */

			
			// new ContextReplacementPlugin(
			// 	/angular(\\|\/)core/,
			// 	helpers.root('src'),
			// 	{}
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
			new AngularWebpackPlugin(),

			/**
			 * A webpack plugin to remove/clean your build folder(s).
			 * see: - https://www.npmjs.com/package/clean-webpack-plugin
			*/
			new CleanWebpackPlugin(),

			/*
			* this plugins are actually copying assets from src and putting into the dist 
			* without adding contenthash and minification so commenting for now.
			*/
			new CopyWebpackPlugin({
				patterns: [
					{ from: 'src/assets', to: 'assets' }
				]
			}),
		],
	};
}