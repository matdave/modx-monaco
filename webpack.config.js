const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin');
const path = require('path');
const {CleanWebpackPlugin} = require("clean-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
    mode: process.env.NODE_ENV,
    entry: [
        './_build/assets/css/index.css',
        './_build/assets/index.js',
    ],
    output: {
        path: path.resolve(__dirname, 'assets/components/monaco/vs'),
        clean: true,
        filename: 'monaco.js',
        assetModuleFilename: "static/[name][ext][query]",
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /(node_modules)/,
                use: {
                    loader: "babel-loader",
                },
            },
            {
                test: /\.css$/,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                    },
                    {
                        loader: "css-loader",
                        options: {
                            importLoaders: 1,
                            sourceMap: true
                        },
                    },
                    {
                        loader: "postcss-loader",
                        options: {
                            sourceMap: true,
                        },
                    },
                ]
            },
            {
                test: /\.(woff(2)?|ttf|eot)(\?v=\d+\.\d+\.\d+)?$/,
                type: "asset/resource",
                generator: {
                    filename: (pathData) => {
                        return pathData.filename.replace("_build/assets/", "");
                    },
                },
            }
        ]
    },
    plugins: [
        new CleanWebpackPlugin({
            cleanOnceBeforeBuildPatterns: ["!.gitignore"],
            cleanAfterEveryBuildPatterns: ["!.gitignore"],
        }),
        new MiniCssExtractPlugin({
            filename: "monaco.css",
        }),
        new MonacoWebpackPlugin({
            languages: [
                'html',
                'twig',
                'css',
                'less',
                'scss',
                'javascript',
                'typescript',
                'json',
                'xml',
                'mysql',
                'plaintext',
                'markdown',
                'shell',
                'yaml',
                'php'
            ],
            customLanguages: [
                {
                    label: 'modx',
                    entry: [
                        path.resolve(__dirname, '_build/assets/js/modx/modx.contribution.js'),
                        path.resolve(__dirname, '_build/assets/js/modx/monaco.contribution.js'),
                    ],
                    worker: {
                        id: "modx",
                        entry: "vs/language/html/html.worker"
                    }
                }
            ]
    })]
};