module.exports = {
  devServer: {
    https:        false,
    host:         `localhost`,
    watchOptions: {
      poll: true
    }
  },

  transpileDependencies: [
    `vue-echarts`,
    `resize-detector`,
    `quasar`
  ],

  pluginOptions: {
    quasar: {
      importStrategy: `kebab`,
      rtlSupport:     false
    }
  },

  chainWebpack: config => {
    config.module
      .rule(`vue`)
      .use(`vue-loader`)
      .loader(`vue-loader`)
      .tap(options => {
        // eslint-disable-next-line no-param-reassign
        options.transpileOptions = {
          transforms: {
            dangerousTaggedTemplateString: true,
          },
        }
        return options
      })
  }
}
