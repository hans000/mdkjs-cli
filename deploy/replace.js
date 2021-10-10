const fs = require('fs-extra')
const path = require('path')

const name = './lib/mdkjs-cli.js'

fs.writeFileSync(name, [
    '#!/usr/bin/env node',
    fs.readFileSync(name),
].join('\n'))

const pkgPath = './package.json'
const version = JSON.parse(fs.readFileSync(path.resolve(process.cwd(), pkgPath)).toString()).version
fs.writeFileSync(name, fs.readFileSync(name).toString().replace(/\{\{\s*(\S+)\s*\}\}/g, (_, k) => ({ version }[k])))