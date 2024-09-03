const path = require('path')
// 打包时候不要将element打入到组件库中
module.exports = {
  css: {
    extract: false
  },
  configureWebpack: {
    output: {
      libraryExport: 'default'
    },
    // externals: {
    //   'element-ui': 'element-ui'
    // }
  },
  chainWebpack: config => {
    config.module
      .rule('vue')
      .use('vue-loader')
      .tap(options => {
        options.transformAssetUrls = {
          video: 'src',
          source: 'src',
          img: 'src',
          image: 'xlink:href'
        }
        return options
      })
  },
  parallel: false
}
