/* global module require */
/* eslint-disable */
const fs = require('fs')
const path = require('path')
const toml = require('@iarna/toml')
const webpack = require('webpack')

const FILEPATH = './blips.toml'

let json = null
if (fs.existsSync(FILEPATH)) {
  const content = fs.readFileSync(path.normalize(FILEPATH), 'utf8')
  json = JSON.stringify(toml.parse(content))
}

module.exports = {
  configureWebpack: () => {
    return {
      devtool: 'source-map',
      plugins: [
        new webpack.DefinePlugin({
          'BLIPS_TOML': json
        })
      ]
    }
  }
}
