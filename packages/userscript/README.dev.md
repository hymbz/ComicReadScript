TODO: 为加载中、等待、错误的图片增加遮罩提示，加载中和等待使用同一样式。鼠标移上去时不显示遮罩
TODO: 使用 visibility 属性替换那些 pointer-events: none; opacity: 0; 的 css
TODO: 补全所有站点的 EndExit 回调
TODO: nhentai 的图片加载比较慢，需要给滚动条加个图片加载进度条，最好能精确到每个页面的图片
TODO: 在加载过程中再次点击 Fab 会再次启动加载过程，需要加个锁定
TODO: xmlHttpRequest 出错处理可以包装一下。出错文本应该能通过参数修改
TODO: xmlHttpRequest 出错时应该再重试三次都不行时才提示

### dev

通过向开发服务器请求 bundle.user.js 代码，然后用 eval 执行，来实现每次刷新都是最新的代码，也不用复制粘贴到油猴，只需要将 dev.user.js 的代码添加到油猴离去就行了。
但如果有修改 @resource 或 @grant 之类的还是得手动更新。

### 动态导入外部库

`src\helper\import.ts`
创建一个自定义的 require 函数放在脚本开头，再让 rollup 导出 cjs 模块规范的代码，就能直接在脚本里使用 cjs、umd 模块了。
不过因为有些 cjs 会使用 node 环境特有的变量、在模块里再 require() 其他模块（这种情况下也需要将其依赖模块在 @resource 中声明），所以尽量还是选择 umd 的代码。

### 使用 React 组件

为了能实现动态导入，`src\component` 内的组件不能直接 `export`，需要导出一个返回函数组件的异步函数来 `() => Promise<React.FC<{}>>`。另外为了方便调用时命名（可以直接用 import 的组件名来声明变量），再在 `src\component\index.ts` 中重新声明一下。

### 支持新站点时的参考

能直接通过网页变量获取所有图片链接的站点参考 manhuagui
需要通过调用 api 获取所有图片链接的站点参考 mangabz
