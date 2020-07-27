// eslint-disable-next-line no-undef
module.exports = {
  configureWebpack: {
    devtool: 'source-map'
  },
  chainWebpack: config => config.resolve.symlinks(false) // prevent eslint errors when using linked packages: https://github.com/vuejs/vue-cli/issues/2948
}
