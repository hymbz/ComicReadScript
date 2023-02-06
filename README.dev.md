TODO: 补全所有站点的 EndExit 回调
TODO: 禁止缩放功能还需要测试不同类型的图片
TODO: 为 Fab 增加点击特效
TODO: 考虑增加个缓存功能？虽然目前感觉也就 ehentai 上的收藏漫画有缓存的必要
TODO: 将 jsdoc 中带有星号的参数删掉
TODO: 使用动态图标 https://icon-sets.iconify.design/line-md/downloading-loop/
TODO: 出现结束页后继续滚动或按方向键将自动跳转至下一话
TODO: 看看能不能只在支持触屏的设备上开启点击翻页
TODO: 当页面为白色时，会看不清侧边栏按钮，需要增加边框或背景
TODO: 从更旧的版本更新上来时，删除掉旧的配置
TODO: 单双页模式切换时提示没有跟着切换
TODO: 监听页面快捷键时，应该跳过那些来自输入框的事件
TODO:将 showManga 功能合并到 setManga 中，并将是否显示组件改为通过 props 的 show 控制，简化逻辑

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
