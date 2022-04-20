### dev

通过向开发服务器请求 bundle.user.js 代码，然后用 eval 执行，来实现每次刷新都是最新的代码，也不用复制粘贴到油猴，只需要将 dev.user.js 的代码添加到油猴离去就行了。
但如果有修改 @resource 或 @grant 之类的还是得手动更新。

### 动态导入外部库

`src\helper\import.ts` 在这个文件的 `getLib` 对象里提前声明好外部库，就能用 ``const React = await getLib.React();` 的形式来动态导入 @resource 声明的外部库了。

### 使用 React

不知道为什么，就是没法使用新的 `react/jsx-runtime`，暂时就先用 `React.createElement` 吧。所以现在还需要用 `const React = await getLib.React();` 来手动把 React 导入进作用域内，再使用 JSX 语法。

另外为了能实现动态导入，`src\component` 内的组件不能直接 `export`，需要导出一个返回函数组件的异步函数来 `() => Promise<React.FC<{}>>`。另外为了方便调用时命名（可以直接用 import 的组件名来声明变量），再在 `src\component\index.ts` 中重新声明一下。
