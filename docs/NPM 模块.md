## 导入

### NPM

```js
import { initComicReader } from '@hymbz/comic-read-script/dist/umd.js'

const ComicReader = initComicReader();
ComicReader.open(['/1.png', '/2.png', '/3.png']);
```

### CDN

```html
<script src="https://cdn.jsdelivr.net/npm/@hymbz/comic-read-script/ComicReader.umd.js"></script>
<script>
  const { initComicReader } = window.ComicReadScript;
  const ComicReader = initComicReader();
  ComicReader.open(['/1.png', '/2.png', '/3.png']);
</script>
```

## 配置

正常无需任何配置，就已经可以使用阅读模式的大部分功能了，但仍有一些功能需要提供油猴 API 才能使用。

### GM.getValue / GM.setValue

脚本会用这俩 API 来保存：显示语言设置、3.3M 的图片无损放大模型（模型只在用到时才会下载缓存）。另外也能顺便用这俩 API 来存储脚本的阅读配置和快捷键。

### GM_xmlhttpRequest

不提供这个 API 的话就只能使用 fetch 来发起请求了，如果没有 CORS 之类的限制的话，那除了无法使用 Cotrans 翻译外好像也没什么影响。

### 使用默认配置

```js
import { initComicReader, defaultConfig } from '@hymbz/comic-read-script'

const ComicReader = initComicReader(defaultConfig());
```

默认配置并不会默认启用，需要手动传入。

使用 localStorage 来实现 GM.getValue 和 GM.setValue，同时配置好了阅读配置和快捷键设置的存储，并会在版本更新时自动删掉旧的配置，详见[代码](https://github.com/hymbz/ComicReadScript/blob/master/src/umd.tsx#L177-L205)。

### 自定义配置

```js
import { initComicReader } from '@hymbz/comic-read-script/dist/umd.js'

const getValue = (name, defaultValue) => { /* xxx */ };
const setValue = (name, value) => { /* xxx */ };
const GM_xmlhttpRequest = (details) => { /* xxx */ };

const ComicReader = initComicReader({
  polyfill: {
    GM: { getValue, setValue },
    GM_xmlhttpRequest,
  },
  props: {
    option: getValue('@Option'),
    onOptionChange: (option) => setValue('@Option', option),
    hotkeys: getValue('@Hotkeys'),
    onHotkeysChange: (hotkeys) => setValue('@Hotkeys', hotkeys),
  },
});
```

props 的具体定义详见 [ComicReader.umd.d.ts](https://github.com/hymbz/ComicReadScript/blob/master/ComicReader.umd.d.ts#L306-L329) 里的 MangaProps 类型。

## 方法

```js
const ComicReader = initComicReader();

// 加载显示指定的图片列表。标题用于打包下载时命名压缩包，没有标题时会使用网页标题
ComicReader.open(['/1.png', '/2.png', '/3.png'], '标题');
// 关闭阅读模式
ComicReader.setProps('show', false);
// 跳到指定页数（注意在双页模式下，页数不等于图片在列表里的序列数）
ComicReader.goto(1);
```
