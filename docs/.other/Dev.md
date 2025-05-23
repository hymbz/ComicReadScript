## TODO

## 暂不考虑实现的功能

- 切白边
  除非在切掉白边后禁止恢复回来，否则必须存储两套长宽、长宽类型、图片 url、图片数据，并在所有相关的地方根据当前显示哪个来判断用哪套来计算。
  双倍占内存的同时还会提高代码的复杂度，而且感觉也没什么人需要。

- 自动调整首页填充
  在漫画页数大于10时，检查漫画前5页，找出相似的图片（封面图）、空白图片，统计这类「非正片」的漫画页的页数。为奇数时开启首页填充，否则关闭。
  有重复封面的漫画不算多，而且在识别空白图片时也很难分辨出「前记」和「留白超大的漫画页」(https://exhentai.org/g/3057496/76f42fcfa9/)
  准确度低、可用场景少。

## 油猴扩展 API

- https://violentmonkey.github.io/api/gm/
- https://www.tampermonkey.net/documentation.php?locale=zh
- https://adguard.com/kb/zh-CN/general/userscripts/#supported-gm-functions

## 参考

- https://github.dev/keiyoushi/extensions-source

## 调试

```bash
pnpm dev
```

然后将 `dist/dev.user.js` 的代码添加到油猴扩展里去就行了，之后每次修改完代码后只要刷新页面就能运行最新的代码，只要没有修改到 @resource 或 @grant 都不用更新油猴扩展上的代码。

## 支持新站点

> 首先到 `src\index.tsx` 里参考其他网站增加站点对应的 url 和 `// #站点代码文件名` 的注释，再到 `src\site` 里创建 `站点代码文件名.tsx` 的文件，之后再开始编写里面的代码

先在站点漫画页的网页控制台执行下列代码找出网页内的自定义全局变量

```js
const iframe = document.createElement("iframe", { url: "about:blank" });
iframe.style.display = "none";
document.body.appendChild(iframe);

Object.fromEntries(
  Object.entries(window)
    .filter(([x]) => !Reflect.has(iframe.contentWindow, x))
)
```

手动检视一遍看能不能通过变量直接获取所有图片的链接，如果可以就参考 [manhuagui.ts](../src/site/manhuagui.tsx) 的代码，否则参考 [mangabz.ts](../src/site/mangabz.tsx) 的代码

> ！！！复制代码后一定要记得修改传给 useInit 的站点名

一般的代码逻辑流程是这样的

1. 通过页面变量或 url 的判断，跳过漫画页以外的页面
2. 使用 `useInit` 函数进行初始化，参数名为网站名，将会作为保存读取配置时的 id
3. 如果有上下一话的按钮，就通过 `setManga` 修改 onNext、onPrev 两个参数。注意如果按钮存在但无法点击的话，应该传递空值或直接不传
4. 向 `init` 函数传一个返回所有图片链接的函数

## 循环 debugger 的应对方式

如果有判断条件的话，可以直接在触发断点时通过修改变量来避免触发，甚至直接关掉循环。

```js
// 使用 setInterval 来循环的话，直接取消所有 setInterval
let id = setInterval(() => {}, 0);
while (id--) clearInterval(id);
```

---

## 动态导入外部库

`src\helper\import.ts`
创建一个自定义的 require 函数放在脚本开头，再让 rollup 导出 cjs 模块规范的代码，就能直接在脚本里使用 cjs、umd 模块了。
不过因为有些 cjs 会使用 node 环境特有的变量、在模块里再 require() 其他模块（这种情况下也需要将其依赖模块在 @resource 中声明），所以尽量还是选择 umd 的代码。

另外为了尽量减少在无关页面浪费时间，components、helper 下的代码会被打包视为外部库 `'main'` 来使用，如果只需要其中一段代码则通过 `helper/XXX` 来导入即可。

## pnpm dev

这个命令总共会做三件事

1. 打包代码到 dist
2. 创建 dist 的文件服务器，用于在浏览器获取最新的脚本代码
3. 使用 vite 加载 src\components\display.tsx 以便单独测试组件
