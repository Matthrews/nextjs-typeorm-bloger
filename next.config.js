const withImages = require('next-images')

module.exports = withImages({
    compress: false,  // disable compression
    poweredByHeader: false,  // Disabling x-powered-by
    webpack: (config, options) => {  // webpack配置
        // 要么配置withImages，要么配置 Webpack
        // config.module.rules = [
        //     {
        //         test: /\.(png|jpg|jpeg|gif|svg)$/,
        //         use: [
        //             {
        //                 loader: 'file-loader',
        //                 options: {
        //                     // img 路径名称.hash.ext
        //                     // 比如 1.png 路径名称为
        //                     // _next/static/1.29fef1d3301a37127e326ea4c1543df5.png
        //                     name: '[name].[contenthash].[ext]',
        //                     // 硬盘路径
        //                     outputPath: 'static',
        //                     // 网站路径是
        //                     publicPath: '_next/static'
        //                 }
        //             }
        //         ]
        //     }
        // ];
        return config
    },
})