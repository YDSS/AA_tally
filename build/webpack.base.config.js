const path = require('path');
const WebpackHtmlPlugin = require('webpack-html-plugin');

module.exports = {
    entry: path.resolve('src/index.js'),
    output: {
        filename: 'bundle.js',
        path: path.resolve('dist'),
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env']
                    }
                }
            },
            {
                test: /\.less$/,
                use: ['style-loader', 'css-loader', 'less-loader'],
            }
        ]
    },
    plugins: [
        new WebpackHtmlPlugin({
            template: path.resolve('src/index.html'),
            filename: 'index.html'
        })
    ]
}