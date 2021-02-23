const withImages = require('next-images')

module.exports = withImages({
    compress: false,  // disable compression
    poweredByHeader: false,  // Disabling x-powered-by
    webpack: (config, options) => {  // webpack配置
        return config
    },
})