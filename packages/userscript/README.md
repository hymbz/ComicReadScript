### dev

通过向开发服务器请求 bundle.user.js 代码，然后用 eval 执行，来实现每次刷新都是最新的代码，也不用复制粘贴到油猴，只需要将 dev.user.js 的代码添加到油猴离去就行了。
但如果有修改 @resource 或 @grant 之类的还是得手动更新。

### 动态导入外部库

`src\helper\import.ts`
因为 commonjs 模块导出的变量全在 module.exports 里，所以直接创建一个自定义的支持动态导入 require 函数就能直接在脚本里使用 commonjs 模块了。
不过有些 cjs 的模块可能在代码里还 require 了其他模块的代码，为了能顺利运行就也得将其在 @resource 里声明。


### 使用 React

为了能实现动态导入，`src\component` 内的组件不能直接 `export`，需要导出一个返回函数组件的异步函数来 `() => Promise<React.FC<{}>>`。另外为了方便调用时命名（可以直接用 import 的组件名来声明变量），再在 `src\component\index.ts` 中重新声明一下。
