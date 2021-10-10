import * as mdk from 'mdkjs'
import init from './init'

// 入口，导出pack实例
export default new mdk.Pack({
    packname: 'mypack',
    version: '1.17.1',
    description: 'thie is a demo pack',
    files: [
        new mdk.File({
            filename: 'main',
            render(ctx) {
                ctx.addComment('this is a foo-main')

                const { PI, timer, timer2 } = init.getData()
                timer.add(timer2)
                
                const commands = mdk.useCommand()
                commands.say('pi is ' + PI)
            }
        })
    ]
})