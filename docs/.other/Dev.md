## TODO

- 支持多章节的加载和切换
  - 在阅读模式的侧边栏加入目录按钮，点击后用和设置面板一样的组件来显示目录，点击跳转
  - 一个章节看完后直接无缝阅读下一章节
  - 在目录页可以直接进入阅读模式（默认最新话）、也可以使用多选加载来选择要加载的章节
  - 不应该作为 Manga 组件的内置功能，而是在外面再包装一层，放在 src/userscript 里实现，只在支持多章节的网站上生效
- SPA 切换章节时不退出阅读模式
- 处理 oxlint-disable max-params 注释

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

> 首先到 `src/index.ts` 里参考其他网站增加站点对应的 url 判断，并在 `case` 上方加上两行注释，再到 `src/site` 里创建 `站点代码文件名.tsx` 的文件，之后再开始编写里面的代码
>
> 注释第一行是 `#` + 站点分类 + md 格式的网站链接和名字（如 `// #漫画站（中文）[再漫画](https://manhua.zaimanhua.com/)`），分类必须复用现有的分类；第二行是测试用的指定章节链接（`// test: https://...`）
>
> 这两行注释会被 [doc-generator](../scripts/lib/doc-generator.ts) 在打包时自动解析，用于更新 README.md 和 docs/index.md 中的支持站点列表

获取图片 url 列表的方式按以下优先级依次尝试：

1. **通过网页的自定义全局变量直接获取**（最快）。在站点漫画页的网页控制台执行下列代码找出网页内的自定义全局变量

```js
const iframe = document.createElement('iframe', { url: 'about:blank' });
iframe.style.display = 'none';
document.body.appendChild(iframe);

Object.fromEntries(
  Object.entries(window).filter(([x]) => !Reflect.has(iframe.contentWindow, x)),
);
```

手动检视一遍看能不能通过变量直接获取所有图片的链接，可以的话就直接用，参考 [jm.ts](../src/site/jm.tsx) 的代码

2. **通过分析网页源码或发起请求获取**。检查图片的 url、网页的源码，看网页本身是如何获取图片 url 的，可能要发起请求，参考 [pixiv.ts](../src/site/pixiv.tsx) 的代码

3. **搜索现成的适配方案**。以上都找不到时，优先搜索 [greasyfork](https://greasyfork.org)、[sleazyfork](https://sleazyfork.org) 上有没有该网站的脚本，其次是搜索 github 上的项目，最后才是在搜索引擎上搜索

> ！！！复制代码后一定要记得修改传给 `setupSiteAdapter` 的站点名

一般的代码逻辑流程是这样的

1. 在 `src/index.ts` 里增加站点对应的 url 判断，用 `selfImport('site/xxx')` 加载站点模块
2. 使用 `setupSiteAdapter` 函数进行初始化，参数名为网站名，将会作为保存读取配置时的 id
3. 通过 `getPageContext` 里的 url 或页面变量判断，跳过漫画页以外的页面
4. 在 `handlers.manga` 里向 `setState('comicMap', '', { getImgList })` 传一个返回所有图片链接的函数
5. 如果有上/下话切换功能，优先找到准确获取对应按钮的方式，通过 `setState('manga', { onNext, onPrev })` 传入。无法稳定获取按钮时，再改用直接跳转上/下话链接的方式切换；如果连上/下话的链接也获取不到，那就只能放弃上/下话切换功能了

## 循环 debugger 的应对方式

如果有判断条件的话，可以直接在触发断点时通过修改变量来避免触发，甚至直接关掉循环。

```js
// 使用 setInterval 来循环的话，直接取消所有 setInterval
let id = setInterval(() => {}, 0);
while (id--) clearInterval(id);
```

或者简单点，使用火狐浏览器，在「调试器」的「断点」里取消勾选「在调试器语句上暂停」，直接无视 debugger 语句。

---

## 浏览器测试

`test/xpi` 里的 xpi 文件会全部安装上，需要在里面放上 violentmonkey 和 uBlock 的 xpi 文件。

`test/cookie.ts` 用于存储通过 EditThisCookie 扩展导出的 cookie，测试时会自动检查当前站点名是否有对应的 cookie，有就加载上。

<!-- wdio 可以和 percy 集成，不过之前已经折腾好了 storybook + percy，感觉没必要这里再搞，所以就用 wdio 自己的视觉测试好了 -->

通过在测试文件中取消 `browser.saveScreen` 的注释，就可以将截图存至 `test/__snapshots__` 作为基准，之后用 `toMatchScreenSnapshot` 来对比检测。
