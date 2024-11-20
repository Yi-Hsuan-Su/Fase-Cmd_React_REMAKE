const path = require('path');

module.exports = {
    entry: './src/index.js', // 確保這裡正確指向 src/index.js
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.js',
    },
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                },
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader'],
            },
        ],
    },
    resolve: {
        extensions: ['.js', '.jsx'],
    },
    mode: 'development',
    devtool: 'source-map', // 使用 source-map 以避免 eval
};