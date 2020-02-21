let path = require('path');
let HtmlWebpackPlugin = require('html-webpack-plugin')
let MiniCssExtractPlugin = require('mini-css-extract-plugin') //抽离css代码
module.exports = {
    mode: 'development',
    entry: './src/index.js',
    output: {
        filename: 'bundle.[hash:7].js',
        path: path.resolve(__dirname, 'dist')
    },
    devServer: {
        port: 3000,
        progress: true,
        contentBase: './dist',
        open: true
    },
    module: {
        rules: [{
                test: /\.css$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    { loader: 'css-loader' },
                ]
            },
            {
                test: /\.less$/,
                use: [
                    // { loader: 'style-loader' },
                    MiniCssExtractPlugin.loader,
                    { loader: 'css-loader' },
                    { loader: 'less-loader' }
                ]
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: 'xxx',
            template: './src/index.html',
            filename: 'index.html',
            minify: {
                // collapseWhitespace: true,
            },
        }),
        new MiniCssExtractPlugin({
            filename: 'main.css'
        })
    ]
}