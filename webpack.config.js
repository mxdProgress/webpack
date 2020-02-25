let path = require('path');
let HtmlWebpackPlugin = require('html-webpack-plugin')
let MiniCssExtractPlugin = require('mini-css-extract-plugin') //抽离css代码
let OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin') //压缩css
let TerserJSPlugin = require('terser-webpack-plugin') //压缩js
let { CleanWebpackPlugin } = require('clean-webpack-plugin')
let CopyPlugin = require('copy-webpack-plugin')
let webpack = require('webpack')

module.exports = {
    mode: 'development', //production development
    entry: './src/index.js',
    output: {
        filename: 'bundle.[hash:7].js',
        path: path.resolve(__dirname, 'dist')
    },
    watch: true,
    watchOptions: {
        poll: 1000,
        aggregateTimeout: 1000, //修改完1秒钟打包更新一次
        ignored: /node_modules/
    },
    devServer: {
        port: 3000,
        progress: true,
        contentBase: './dist',
        open: true
    },
    optimization: {
        minimizer: [new TerserJSPlugin({}), new OptimizeCSSAssetsPlugin({})]
    },
    module: {
        rules: [{
                test: /\.css$/,
                use: [
                    MiniCssExtractPlugin.loader, //相当于把head中的style样式转成link的形式引用到页面上
                    { loader: 'css-loader' },
                    { loader: 'postcss-loader' }
                ]
            },
            {
                test: /\.less$/,
                use: [
                    // { loader: 'style-loader' },
                    MiniCssExtractPlugin.loader,
                    { loader: 'css-loader' },
                    { loader: 'postcss-loader' },
                    { loader: 'less-loader' }
                ]
            },
            {
                test: /\.(png|jpe?g|gif)$/i,
                use: [{
                    loader: 'url-loader',
                    options: {
                        limit: 1024 * 10,
                        fallback: {
                            loader: 'file-loader',
                            options: {
                                name: 'images/[name].[hash:8].[ext]',
                                outputPath: 'images'
                            }
                        }
                    }
                }]
            },
            {
                test: /\.js$/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env']
                    }
                }
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
        }),
        new CleanWebpackPlugin(),
        new CopyPlugin([
            { from: 'doc', to: '' }
        ]),
        new webpack.BannerPlugin('make maxd') //打包添加注释
    ]
}