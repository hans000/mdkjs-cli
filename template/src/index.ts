import * as mdk from 'mdkjs'

export default new mdk.Pack({
    packname: 'mypack',
    files: [
        new mdk.File({
            filename: 'main24',
            render(ctx) {
                ctx.add('say 1112')
            }
        })
    ]
})