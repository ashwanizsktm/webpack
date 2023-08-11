const path = require("path");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const DefinePlugin = require('webpack/lib/DefinePlugin');
const { ContextReplacementPlugin } = require("webpack");
const { AngularWebpackPlugin } = require('@ngtools/webpack');

// 

    

module.exports = (options) => {
    
    // export default async () => {
    const linkerPlugin = helpers.getLinkerPlugin();
   


    return {
        
        mode: 'development',

        entry: { 
            pollyfills: ['./src/polyfills.ts'],
            main: ['./src/main.ts']
        },
    
        resolve: {
            extensions: ['.ts', '.js', '.json', '.tsx'],
        },
    
        devServer: {
            historyApiFallback: true
        },
    
        output: {
            filename: "[name].bundle.js",
            path: path.resolve(__dirname, "dist")
        },
    
        module: {
            rules: [
                {
                    test: /\.html$/i,
                    loader: "html-loader",
                },

                {
                    test: /\.(svg|png|jpg|gif)$i/,
                    use: {
                        loader: "file-loader",
                        options: {
                            name: "[path][name].[hash].[ext]",
                            outputPath: "imgs"
                        }
                    }
                },
    
                // {
                //     test: /\.(ts|tsx)?$/,
                //     use: 'ts-loader',
                //     exclude: /node_modules/,
                // },
    
                // {
                //     test: /(?:\.ngfactory\.js|\.ngstyle\.js|\.ts)$/,
                //     use: '@ngtools/webpack'
                // },

                // { test: /\.ts$/, use: '@ngtools/webpack' },
                // { test: /\.m?js$/, use: { loader: 'babel-loader', options: { plugins: [linkerPlugin] } } },
    
                {
                    test: /\.m?js$/,
                    loader: 'babel-loader',
                    options: {
                        compact: false,
                        plugins: [linkerPlugin.default],
                    },
                },

                  {
                    test: /(?:\.ngfactory\.js|\.ngstyle\.js|\.ts)$/,
                    loader: '@ngtools/webpack'
                },
    
                //   {
                //     test: /\.[jt]sx?$/,
                //     loader: '@ngtools/webpack',
                //   },
        
                // {
                //     test: /\.scss$/,
                //     use: [
                //         "style-loader",  //3. inject style in to DOM
                //         "css-loader",   //2. Turn css into commonjs
                //         "sass-loader"   //1. Turn sass into css
                //     ],
                // },
    
                // {
                //     test: /\.(sass|less|css|scss)$/,
                //     use: ['style-loader', 'css-loader', 'less-loader', "sass-loader"]
                //   }
    
                    {
                      test: /\.scss$/i,
                      use: ["style-loader", "css-loader", "sass-loader"],
                    },
            ]
        },
    
    
        plugins: [
            new HtmlWebpackPlugin({
                template: "./src/index.html"
            }),
    
            new ContextReplacementPlugin(
                /angular(\\|\/)core/,
                path.join(__dirname, './src'),
                {}
            ),
    
            new AngularWebpackPlugin({
                tsConfigPath: './tsconfig.json',
                entryModule: './src/app/app.module#AppModule'
                // other configs
            }),

            // new AngularWebpackPlugin({
            //     tsConfigPath: './tsconfig.json'
            //     // other configs
            // }),
    
            new DefinePlugin({
                'NODE_ENV': JSON.stringify(process.env.NODE_ENV)
            })
        ],
    }
   
}