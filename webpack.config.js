const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const imageMinPlugin = require('image-minimizer-webpack-plugin');

console.log(path.resolve(__dirname));

let mode = 'development';
if (process.env.NODE_ENV === 'production') {
    mode = 'production';
}

module.exports = {
    mode: mode,
    devServer: {
        port: 3000,
        hot: true,
        static: {
            directory: path.join(__dirname, '/dist/'),
        },
    },
    entry: {
        main: path.resolve(__dirname, 'src/index.js'),
    },
    output: {
        filename: 'js/[name].[contenthash].js',
        clean: true,
        assetModuleFilename: 'img/[hash][ext]',
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, 'src/index.html'),
            inject: 'body',
        }),
        
        new MiniCssExtractPlugin({
            filename: 'style/[name].[contenthash].css',
        }),
        new CopyPlugin({
            patterns: [
                {
                    from: path.resolve(__dirname, 'src/favicon.ico'),
                    to: path.resolve(__dirname, 'dist'),
                },
            ],
        }),
    ],
    module: {
        rules: [
            {
                test: /\.html$/i,
                loader: 'html-loader',
            },
            {
                test: /\.(sa|sc|c)ss$/i,
                use: [
                    mode === 'development' ? 'style-loader' : MiniCssExtractPlugin.loader,
                    'css-loader',
                    'postcss-loader',
                    'sass-loader',
                ],
            },
            {
                test: /\.(png|jpg|svg|webp|jpeg|gif)$/i,
                type: 'asset/resource',
            },
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/i,
                type: 'asset/resource',
                generator: {
                    filename: 'fonts/[hash][ext]',
                },
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env', '@babel/preset-react'],
                    },
                },
            },
        ],
    },
    optimization: {
        minimizer: [
            new imageMinPlugin({
                minimizer: {
                    implementation: imageMinPlugin.imageminMinify,
                    options: {
                        plugins: [
                            ['mozjpeg', { quality: 65 }],
                            ['pngquant', [50, 100]],
                            ['svgo', [50, 100]],
                        ],
                    },
                },
                generator: [
                    /* webp конвертация */
                    {
                        preset: 'webp',
                        implementation: imageMinPlugin.imageminGenerate,
                        options: {
                            plugins: ['imagemin-webp'],
                        },
                    },
                ],
            }),
        ],
    },
};
