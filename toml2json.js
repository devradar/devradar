#!/usr/env/bin node
const fs = require('fs')
const toml = require('toml')

const content = fs.readFileSync('./blips.toml', 'utf8')
const json = toml.parse(content)

console.log(JSON.stringify(json, null, 2))
