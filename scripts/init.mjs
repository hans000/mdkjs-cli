import * as path from 'path'
import fs from 'fs-extra'
import { exec } from 'child_process'

function view(name) {
    return new Promise((resolve, reject) => {
        exec(`npm view ${name} version`, (err, stdout, stderr) => {
            if (err) {
                reject(stderr)
            } else if (stdout) {
                resolve(stdout.trim())
            } else {
                reject(stderr)
            }
        })
    })
}

export default (name) => {
    const dirname = path.resolve(process.cwd(), name)
    if (fs.existsSync(dirname)) {
        throw ['[mdk-cli error]:`', name, '` directory has existed'].join('')
    }
    
    fs.mkdirSync(dirname)
    const src = path.resolve(path.dirname(import.meta.url.slice(8)), '../template')
    fs.copySync(src, dirname)
    const pkgs = ['mdkjs', 'object-hash', 'typescript', 'ts-node']

    Promise.all(pkgs.map(view)).then(v => {
        const map = {
            name,
            mdkjs: v[0],
            'object-hash': v[1],
            typescript: v[2],
            'ts-node': v[3],
        }
        const pkgPath = path.resolve(dirname, 'package.json')
        const text = fs.readFileSync(pkgPath).toString().replace(/\{\{\s*(\S+)\s*\}\}/g, (_, k) => map[k])
        fs.writeFileSync(pkgPath, text)
    })
}