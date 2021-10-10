import { Command } from 'commander'
import init from './init'
import build from './build'

const program = new Command().version('{{version}}', '-v, --version')

program
    .command('init')
    .argument('[name]', 'init program', 'mdk-test')
    .action((name) => {
        init(name).then().catch(error => {
            if (typeof error === 'string' && error.startsWith('[mdkjs-cli')) {
                console.log(error)
            } else {
                console.error(error)
            }
        })
    });

program
    .command('build')
    .option('-i, --input <path>', 'input file', './src/index.ts')
    .option('-o, --output <dir>', 'out file', './dist')
    .option('-W, --watch', 'watch file change', false)
    .action((opts) => {
        build(opts)
    })

program.parse(process.argv)

export default {}