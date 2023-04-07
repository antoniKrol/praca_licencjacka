const { defineConfig } = require('@vue/cli-service')

module.exports = defineConfig({
  transpileDependencies: true,
  pluginOptions: {
    webpack: {
      configure: {
        resolve: {
          alias: {
            fs: false,
          },
        },
      },
    },
  },
})
