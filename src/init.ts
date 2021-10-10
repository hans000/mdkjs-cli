import * as path from 'path'
import * as fs from 'fs-extra'
import { exec } from 'child_process'

export default async function(name: string) {
    const cwd = process.cwd()
    const root = path.resolve(cwd, name)

    console.log(`Scaffolding project in ${root}...`)

    await fs.ensureDir(root)
    const existing = await fs.readdir(root)
    if (existing.length) {
        console.error(`Error: target directory is not empty.`)
        process.exit(1)
    }

    const src = path.resolve(__dirname, '../template')
    fs.copySync(src, root)


    const pkgs = ['mdkjs', 'typescript', 'ts-node']
    const v = await Promise.all(pkgs.map(fetchVersion))
    const map: Record<string, string> = {
        name,
        mdkjs: v[0],
        typescript: v[1],
        'ts-node': v[2],
    }

    const pkgPath = path.resolve(root, 'package.json')
    const text = fs.readFileSync(pkgPath).toString().replace(/\{\{\s*(\S+)\s*\}\}/g, (_, k) => map[k])
    fs.writeFileSync(pkgPath, text)

    console.log(`\nDone. Now run:\n`)

    if (root !== cwd) {
      console.log(`  cd ${path.relative(cwd, root)}`)
    }

    console.log(`  npm install (or \`yarn install\`)`)
    console.log(`  npm run build (or \`yarn build\`)`)
    console.log(`  npm run build --watch (or \`yarn build --watch\`)`)
    console.log()
}



function fetchVersion(name: string): Promise<string> {
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