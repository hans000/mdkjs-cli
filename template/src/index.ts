import * as mdk from 'mdkjs'
import foo from './foo'
import main from './main'

// 入口，导出pack实例
export default new mdk.Pack({
    packname: 'mypack',
    version: '1.17.1',
    description: 'thie is a demo pack',
    modules: [
        foo,
    ],
    files: [
        main,
    ]
})