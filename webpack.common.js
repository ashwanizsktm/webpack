var webpack = require('webpack');

module.exports = {
    entry: {
        main: "./src/main.js",
    },

    plugins: [
        new webpack.DefinePlugin({
            "process.env": {
                'NODE_ENV': JSON.stringify(process.env.NODE_ENV)
            },
        }),
    ],

    module: {
        rules: [
            {
                test: /\.html$/i,
                loader: "html-loader",
            },
            {
                test: /\.(svg|png|jpg|gif)$/,
                use: {
                    loader: "file-loader",
                    options: {
                        name: "[path][name].[hash].[ext]",
                        outputPath: "imgs"
                    }
                }
            },
        ]
    }
}