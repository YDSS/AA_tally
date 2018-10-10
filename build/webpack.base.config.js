const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const Stylish = require('webpack-stylish');

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
            },
            {
                test: /\.art$/,
                use: 'art-template-loader'
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: 'src/index.html',
            filename: 'index.html'
        }),
        new Stylish(),
    ]
}