## webpack4.x 打包配置

> 基本配置

* 首先，根目录下npm init 初始化创建一个package.json文件
* 安装 cnpm i -D webpack webpack-cli 
* 创建一个webpack.config.js文件
* src下创建一个入口文件index.js 
* 配置webpack.config.js文件，配置如下：

    ```
    module.exports = {
        mode: 'development',
        entry: './src/index.js',
        output: {
            filename: 'bundle.[hash:7].js',
            path: path.resolve(__dirname, 'dist')
        }    
    }

    ```
* 配置package.json  "scripts" 对象

    ```

    "scripts": {
        "build": "webpack --config webpack.config.js",
    }

    ```


> HtmlWebpackPlugin 配置

* 安装 cnpm i -D html-webpack-plugin
* src 文件夹下新建一个index.html文件作为模板，通过html-webpack-plugin插件生成一个虚拟的index.html并且默认引入了js文件，打包到dist目录下

    ```
    .....
    let HtmlWebpackPlugin = require('html-webpack-plugin')
    plugins: [
        new HtmlWebpackPlugin({
            title: 'xxx',
            template: './src/index.html',
            filename: 'index.html',
            minify: {
                // collapseWhitespace: true,
            },
        })
    ]

    ```

> webpack-dev-server 服务配置

* 安装 cnpm i -D webpack-dev-server 

    ```
    .....
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
        }
    }


    ```
* 配置package.json  "scripts" 对象

    ```
    
    "scripts": {
        "dev": "webpack-dev-server"
    }


> 样式处理

* css-loader //类似处理@import 'a.css'
* syle-loader //插入html文件得head里面
* less-loader //处理less文件
* //处理样式从右向左，从下往上原则

    ```
    .....
    module: {
            rules: [{
                    test: /\.css$/,
                    use: [
                        { 
                            loader: 'style-loader',
                            //如果希望插入优先级高的化就设置
                            options:{
                                insertAt:'top'
                            }
                        },
                        { loader: 'css-loader' },
                    ]
                },
                {
                    test: /\.less$/,
                    use: [
                        { loader: 'style-loader' },
                        { loader: 'css-loader' },
                        { loader: 'less-loader' }
                    ]
                }
            ]
        }
        
    ```

> 抽离css代码

* 安装 cnpm i -D mini-css-extract-plugin

    ```
    .....
    let MiniCssExtractPlugin = require('mini-css-extract-plugin')
    module: {
        rules: [{
                test: /\.css$/,
                use: [
                    MiniCssExtractPlugin.loader,  //相当于把head中的style样式转成link的形式引用到页面上
                    { loader: 'css-loader' },
                ]
            },
            {
                test: /\.less$/,
                use: [
                    // { loader: 'style-loader' },
                    MiniCssExtractPlugin.loader,  //相当于把head中的style样式转成link的形式引用到页面上
                    { loader: 'css-loader' },
                    { loader: 'less-loader' }
                ]
            }
        ]
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: 'main.css'   //输出的css名称
        })
    ]

    ```

> css兼容加前缀

* 安装 cnpm i -D postcss-loader autoprefixer postcss
* 创建postcss.config.js文件，配置如下：
```
module.exports = {
    plugins: [
        require('autoprefixer')("last 100 versions")
    ]
}
```
* webpack.config.js 配置如下：
```
...
 module: {
    rules: [{
            test: /\.css$/,
            use: [
                MiniCssExtractPlugin.loader, //相当于把head中的style样式转成link的形式引用到页面上
                { loader: 'css-loader' },
                { loader: 'postcss-loader' } //在css-loader style-loader之后，在预编译loder之前（sass-loader、less-loder）
            ]
        },
        {
            test: /\.less$/,
            use: [
                // { loader: 'style-loader' },
                MiniCssExtractPlugin.loader,
                { loader: 'css-loader' },
                { loader: 'postcss-loader' },  //在css-loader style-loader之后，在预编译loder之前（sass-loader、less-loder）
                { loader: 'less-loader' }
            ]
        }
    ]
}
```
> css压缩

* 安装 cnpm i -D optimize-css-assets-webpack-plugin
```
let OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin') //压缩css
module.exports = {
    optimization: {
        minimizer: [new OptimizeCSSAssetsPlugin({})],
    }
}
```
* 这样配置在生产模式下css会压缩，但是js会被修改默认设置（没有压缩了），所以要在装插件完善，如下：
```
let TerserJSPlugin = require('terser-webpack-plugin');
let OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin') //压缩css
module.exports = {
    optimization: {
        minimizer: [new TerserJSPlugin({}), new OptimizeCSSAssetsPlugin({})],
    }
}
```




