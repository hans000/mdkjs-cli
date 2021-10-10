import * as mdk from 'mdkjs'

export default new mdk.File({
    filename: 'main',
    render(ctx) {
        ctx.addComment('this is a main mcfunction file')
        ctx.add('say main file')
    }
})