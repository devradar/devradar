const fs = require('fs')
const path = require('path')
const toml = require('@iarna/toml')
const webpack = require('webpack')
const { default: colors } = require('vuetify/es5/util/colors')

const FILEPATH = './blips.toml'

let json = null
if (fs.existsSync(FILEPATH)) {
  const content = fs.readFileSync(path.normalize(FILEPATH), 'utf8')
  json = JSON.stringify(toml.parse(content))
}

module.exports = {
  configureWebpack: config => {
    return {
      plugins: [
        new webpack.DefinePlugin({
          'BLIPS_TOML': json
        })
      ]
    }
  }
}
