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
> babel配置 es6 转成浏览器可读的es5

* 安装 cnpm install -D babel-loader @babel/core @babel/preset-env

```
...
module: {
        rules: [{
                test: /\.js$/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env']
                    }
                }
        }]
    }    
```

> 删除dist下压缩文件

* 安装 cnpm install -D clean-webpack-plugin

```
...
let { CleanWebpackPlugin } = require('clean-webpack-plugin')
plugins: [new CleanWebpackPlugin()]  
```

> file-loader url-loader 配置

* file-loader 可以指定要复制和放置资源文件的位置，以及如何使用版本哈希命名以获得更好的缓存。此外，这意味着 你可以就近管理图片文件，可以使用相对路径而不用担心部署时 URL 的问题。使用正确的配置，webpack 将会在打包输出中自动重写文件路径为正确的 URL
* url-loader 允许你有条件地将文件转换为内联的 base-64 URL (当文件小于给定的阈值)，这会减少小文件的 HTTP 请求数。如果文件大于该阈值，会自动的交给 file-loader 处理

* 安装 cnpm install -D url-loader file-loader

```
...
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
}
```

> copy-webpack-plugin 配置

* 作用是把指定目标文件复制到指定目录里面

* 安装cnpm i -D copy-webpack-plugin

```
...
let CopyPlugin = require('copy-webpack-plugin')
plugins: [
        new CopyPlugin([
            { from: 'doc', to: '' }
        ])
]  
```

> 定义环境变量 DefinePlugin()

```
let url = '';
if(DEV === 'dev'){
    url = 'http://localhost:3000'
}else{
    url = 'http://zhufengpeixun.cn'
}

```

* webpack.config.js中引入插件（这个插件是自带的，不需要安装）
```
plugins:[
    new webpack.DefinePlugin({
        DEV:JSON.stringify('dev');
    })
]
```


