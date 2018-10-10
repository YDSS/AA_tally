const merge = require('webpack-merge');

const baseConfig = require('./webpack.base.config');

module.exports = merge(baseConfig, {
    mode: 'development',
    devtool: 'source-map',
    devServer: {
        port: 3000,
        compress: true,
        contentBase: './public',
    },
})