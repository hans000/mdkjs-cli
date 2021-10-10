import * as mdk from "mdkjs"

export default new mdk.File({
    filename: 'init',
    render(ctx) {
        ctx.addComment('this is a foo-init file')
        const commands = mdk.useCommand()

        const timer = commands.objective('timer', 'dummy', '计时器')
        const timer2 = commands.objective('timer2', 'dummy', '计时器2')
        const PI = 3.14

        // 导出自定义变量
        return {
            timer,
            timer2,
            PI,
        }
    }
})