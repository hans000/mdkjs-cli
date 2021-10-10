import { exec } from 'child_process'
import * as ora from 'ora'
import * as chokidar from 'chokidar'
import * as fs from 'fs-extra'
import * as path from 'path'
import * as chalk from 'chalk'

const map = Object.create(null)
let flag = false

const spinner = ora('compilering...')

const handle = debounce((input: string, output: string) => {
    spinner.start()
    run(input, output)
})

const normal = (path: string) => path.replace(/\\/g, '/')

function getFileList(dir: string) {
    const result: string[] = []
    try {
        fs.readdirSync(dir).forEach(item => {
            const name = path.resolve(process.cwd(), dir, item)
            const stat = fs.statSync(name)
            if (stat.isDirectory()) {
                const list = getFileList(name)
                list.length ? result.push(...list) :  result.push(name)
            } else {
                result.push(normal(name))
            }
        })
    } catch (error) {
        return []
    }
    return result.map(normal)
}
function debounce(fn: any, delay = 300) {
    let timestamp: number;
    return (...args: any) => {
        if (!timestamp || Date.now() - timestamp > delay) {
            fn.apply(null, args)
        }
        timestamp = Date.now()
    }
}
const tscode = (input: string) => `
import { Pack } from 'mdkjs';
import { MD5 } from 'object-hash';
import pack from '${input}';

function build(pack: Pack) {
    try {
        const result = Object.values(pack.create())[0];
        if (! result) return [];

        return result.reduce(
            (acc, info) => {
                const obj = {
                    name: info.name,
                    text: info.type === 'file' ? info.extra.map((item: any) => item.text).join('\\n') : info.text
                };
                const hash = MD5(obj);
                acc.push({ ...obj, hash });
                return acc;
            },
            []
        )
    } catch(err) {
        console.error(err);
        return [];
    }
}

console.log(JSON.stringify(build(pack)));
`.replace(/\n/g, '')

function run(input: string, output: string) {
    exec(`ts-node -T -e "${tscode(input)}"`, (err, stdout, stderr) => {
        if (err) console.log('err', err)
        if (stderr) {
            console.log('stderr', stderr)
            return
        }

        flag = !flag

        let oldList = getFileList(path.resolve(process.cwd(), output))
        Object.keys(map).forEach(key => {
            const index = oldList.findIndex(item => item === key)
            if (!~index) {
                delete map[key]
            } else {
                oldList.splice(index, 1)
            }
        })
        const list = JSON.parse(stdout)
        for (const info of list) {
            const name = path.resolve(process.cwd(), output, info.name).replace(/\\/g, '/')
            const index = oldList.findIndex(item => item === name)
            if (!!~index) {
                oldList.splice(index, 1)
            }
            // 存在且hash一致
            if (map[name] && map[name].hash === info.hash) {
                map[name].flag = flag
                continue
            }
            // 缓存当前值
            map[name] = { ...info, flag }
            const dir = path.dirname(name)
            if (! fs.existsSync(dir)) {
                fs.mkdirpSync(dir)
            }
            fs.writeFileSync(name, info.text)
        }

        // 删除过期的缓存信息
        oldList.forEach(item => {
            if (fs.statSync(item).isDirectory()) {
                let dir = item
                while (! fs.readdirSync(dir).length) {
                    fs.rmdirSync(dir)
                    dir = path.dirname(dir)
                }
            } else {
                fs.rmSync(item)
            }
        })
        Object.keys(map).forEach(k => {
            if (map[k].flag !== flag) {
                const name = path.resolve(process.cwd(), output, map[k].name).replace(/\\/g, '/')
                fs.rmSync(name)
                delete map[k]
            }
        })
        spinner.stop()
        console.log(chalk.green('✔ compilered'));
    })
}

export default function(options: Record<string, string>) {
    const { input, output, watch } = options
    watch ? chokidar.watch(`${path.dirname(input)}/**/*`).on('all', () => handle(input, output)) : handle(input, output)
}