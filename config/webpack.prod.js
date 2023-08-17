
/**
 * Webpack Plugins 
 * these plugins are only required in production.
 */
const ReplaceInFileWebpackPlugin = require('replace-in-file-webpack-plugin');
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
// const ImageMinimizerPlugin = require('image-minimizer-webpack-plugin');

// this all plugins are in the common as of now common is not getting merged with dev or prod env
// so we are using some of the samw config in dev and prod mode.

const path = require("path");
const helpers = require("./helper");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ContextReplacementPlugin = require("webpack/lib/ContextReplacementPlugin");
const { AngularWebpackPlugin } = require('@ngtools/webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyWebpackPlugin = require("copy-webpack-plugin");

const ASSET_PATH = process.env.ASSET_PATH || '/';
const images = helpers.images;

module.exports = () => {
	/*
   this expression is not required now. while using webpack merge needs to be uncommented.
   const isDev = process.env.NODE_ENV === 'dev' ? true: false;
   const isProd = !isDev;
  */

	return {
		mode: 'production',
		/**
		 * recommended in webpack 5 devtools: sourceMap is not required in prod for some reasons
		 * for more details explanation see the docs
		 * see:- https://webpack.js.org/configuration/devtool/#production
		*/

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

				/**
				 * need to debug entry point is not getting inserted
				 *  {
						  test: /\.(png|jpe?g|gif|svg)$/i,
						  loader: ImageMinimizerPlugin.loader,
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
					}
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

				/*
				* Need to debug the entry points for images are not getting inserted
				  new ImageMinimizerPlugin({
					minimizer: {
					  implementation: ImageMinimizerPlugin.imageminMinify,
					  options: {
						// Lossless optimization with custom option
						// Feel free to experiment with options for better result for you
						plugins: [
						  ["gifsicle", { interlaced: true }],
						  ["jpegtran", { progressive: true }],
						  ["optipng", { optimizationLevel: 5 }],
						  // Svgo configuration here https://github.com/svg/svgo#configuration
						  [
							"svgo",
							{
							  plugins: [
								{
								  name: "preset-default",
								  params: {
									overrides: {
									  removeViewBox: false,
									  addAttributesToSVGElement: {
										params: {
										  attributes: [
											{ xmlns: "http://www.w3.org/2000/svg" },
										  ],
										},
									  },
									},
								  },
								},
							  ],
							},
						  ],
						],
					  },
					},
				  }),
				*/
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

			/** ContextReplacementPlugin helps to run all the angular libraries  */

			/*
			new ContextReplacementPlugin(
				/angular(\\|\/)core/,
				helpers.root('src'),
				{}
			),
			*/

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