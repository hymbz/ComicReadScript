TODO: 为漫画模式的进出增加个渐隐特效
TODO: nhentai 匹配失败改为在页面上提示，不弹框
TODO: 长漫画滚动时滚动条会出现闪烁跳跃的情况
TODO: 默认配置内有些选项时需要在每次运行时通过 js 进行运算得出的，不能直接从缓存中提取

### dev

通过向开发服务器请求 bundle.user.js 代码，然后用 eval 执行，来实现每次刷新都是最新的代码，也不用复制粘贴到油猴，只需要将 dev.user.js 的代码添加到油猴离去就行了。
但如果有修改 @resource 或 @grant 之类的还是得手动更新。

### 动态导入外部库

`src\helper\import.ts`
创建一个自定义的 require 函数放在脚本开头，再让 rollup 导出 cjs 模块规范的代码，就能直接在脚本里使用 cjs、umd 模块了。
不过因为有些 cjs 会使用 node 环境特有的变量、在模块里再 require() 其他模块（这种情况下也需要将其依赖模块在 @resource 中声明），所以尽量还是选择 umd 的代码。

另外为了尽量减少在无关页面浪费时间，components、helper 下的代码会被打包视为外部库 `'../helper'` 来使用，如果只需要其中一段代码则通过 `helper/XXX` 来导入即可。

### 使用 React 组件

为了能实现动态导入，`src\component` 内的组件不能直接 `export`，需要导出一个返回函数组件的异步函数来 `() => Promise<React.FC<{}>>`。另外为了方便调用时命名（可以直接用 import 的组件名来声明变量），再在 `src\component\index.ts` 中重新声明一下。

### 支持新站点时的参考

能直接通过网页变量获取所有图片链接的站点参考 manhuagui
需要通过调用 api 获取所有图片链接的站点参考 mangabz
