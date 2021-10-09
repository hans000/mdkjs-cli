#!/usr/bin/env node

import { Command } from 'commander'
import init from './init.mjs'
import build from './build.mjs'

const program = new Command().version('0.1.0', '-v, --version')

program
    .command('init')
    .argument('[name]', 'init program', 'mdk-test')
    .action((name) => {
        try {
            init(name)
        } catch (error) {
            if (typeof error === 'string' && error.startsWith('[mdk-cli')) {
                console.log(error)
            } else {
                console.error(error)
            }
        }
    });

program
    .command('build')
    .option('-i, --input <path>', 'input file', './src/index.ts')
    .option('-o, --output <dir>', 'out file', './dist')
    .option('-W, --watch', 'watch file change', false)
    .action((opts) => {
        build(opts)
    })

program.parse(program.argv)