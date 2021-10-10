const path = require('path')

/** @type { import('webpack').Configuration } */
module.exports = {
    target: 'node',
    mode: 'production',
    entry: './src/index.ts',
    output: {
        path: path.resolve(__dirname, 'lib'),
        filename: 'mdkjs-cli.js',
    },
    resolve: {
        extensions: ['.ts', '.js']
    },
    externals: {
        ora: 'commonjs2 ora',
        commander: 'commonjs2 commander',
        chalk: 'commonjs2 chalk',
        chokidar: 'commonjs2 chokidar',
        path: 'commonjs2 path',
        child_process: 'commonjs2 child_process',
        'fs-extra': 'commonjs2 fs-extra',
    },
    module: {
        rules: [{
            test: /\.ts$/,
            exclude: /node_modules/,
            use: [{
                loader: 'ts-loader',
            }]
        }]
    },
}