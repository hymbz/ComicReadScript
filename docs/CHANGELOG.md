

## [6.5.1](https://github.com/hymbz/ComicReadScript/compare/v6.5.0...v6.5.1) (2023-07-21)


### Bug Fixes

* :bug: 修复关闭设置面板后焦点丢失的 bug ([c12cdcb](https://github.com/hymbz/ComicReadScript/commit/c12cdcb4d29e82ba698c99f916f7562f58ea1b04))


### Performance Improvements

* :zap: 为翻译功能增加选择目标语言的配置项 ([6eda615](https://github.com/hymbz/ComicReadScript/commit/6eda615efa678dc80fd4d44e8af55b9303666b7b))

## [6.5.0](https://github.com/hymbz/ComicReadScript/compare/v6.4.1...v6.5.0) (2023-07-20)


### Features

* :sparkles: 支持调用 manga-image-translator 实现一键汉化功能 ([d8443ec](https://github.com/hymbz/ComicReadScript/commit/d8443ec95f40d5033020d5debcdbf1d46dc98032))


### Bug Fixes

* :bug: 修复部分设置无法正常切换保存的 bug ([90d131a](https://github.com/hymbz/ComicReadScript/commit/90d131a6ae3514494b709a0b6440ff254494d7b5))

### [6.4.1](https://github.com/hymbz/ComicReadScript/compare/v6.4.0...v6.4.1) (2023-07-16)


### Bug Fixes

* :bug: 修复有时会无法进入阅读模式的 bug ([fee2471](https://github.com/hymbz/ComicReadScript/commit/fee247111a5144a3090a298825512b45eb324bdc))
* :bug: 修复部分设置未正确保存的 bug ([204af07](https://github.com/hymbz/ComicReadScript/commit/204af07e438e43cc5b3a02ee5527c0a76cbee063))
* :bug: 修复提示框图标过大的 bug ([f9f5be9](https://github.com/hymbz/ComicReadScript/commit/f9f5be93176b79e325b1e2350e42c8ec3778d278))
* :bug: 修复竖屏下滚动条触发区域过大的 bug ([67bf49d](https://github.com/hymbz/ComicReadScript/commit/67bf49dff172702a1e2eae7e53603164642728db))


### Performance Improvements

* :zap: 在退出阅读模式后将页面焦点设到悬浮按钮上 ([669df4a](https://github.com/hymbz/ComicReadScript/commit/669df4a6c79cb2975439eb4123dbc9a5c012ab61))

## [6.4.0](https://github.com/hymbz/ComicReadScript/compare/v6.3.0...v6.4.0) (2023-07-11)


### Features

* :sparkles: 在结束页增加显示章节评论 ([fafb36f](https://github.com/hymbz/ComicReadScript/commit/fafb36f30d5dbba437b6212bdffcfdd20c81cd2c))


### Bug Fixes

* :bug: 修复 welovemanga 改版导致的 bug ([a1298db](https://github.com/hymbz/ComicReadScript/commit/a1298db8e8b04b84a0e41bd27da3e20a0ab8d6b2))
* :bug: 修复禁漫天堂在某些旧版本浏览器上无法正常运行的 bug ([485734c](https://github.com/hymbz/ComicReadScript/commit/485734c710ddd3aa9c7cd4026ab52db9ff3d7423))


### Performance Improvements

* :zap: 增加用于显示图片加载状态的图标 ([63acbfe](https://github.com/hymbz/ComicReadScript/commit/63acbfec664699f384bfe41869e9300b38203f08))
* :zap: 缩小页面中间用于点击显示侧边栏的判定范围，减少误触 ([1bb4e10](https://github.com/hymbz/ComicReadScript/commit/1bb4e10fa17b09a8afdb64adc58d1a19e667031a))

## [6.3.0](https://github.com/hymbz/ComicReadScript/compare/v6.2.0...v6.3.0) (2023-07-09)


### Features

* :sparkles: 增加关闭首页填充的设置项 ([a0c092c](https://github.com/hymbz/ComicReadScript/commit/a0c092c8f4c2fda0b34fa9124cfa45eded93decd))


### Bug Fixes

* :bug: 修复某些情况下页面填充效果异常的 bug ([2935fd7](https://github.com/hymbz/ComicReadScript/commit/2935fd78dbbb1c844d0b5218368211a57ebe1b1a))
* :bug: 修复 dmzj 改版导致的 bug ([9b7f3d6](https://github.com/hymbz/ComicReadScript/commit/9b7f3d6297b5a4e8998d6a724cfc64b461e6f68f))

### Removed

* 因为改版后失效的缘故，删掉了 dmzj 的样式美化和解除吐槽字数限制的功能

## [6.2.0](https://github.com/hymbz/ComicReadScript/compare/v6.1.0...v6.2.0) (2023-06-27)


### Features

* :sparkles: 增加 左右翻页键交换 功能 ([4d67c31](https://github.com/hymbz/ComicReadScript/commit/4d67c3125717ee562960c1cdf4bd31e42e1648e3))


### Performance Improvements

* :zap: 为 ehentai 匹配 nhentai 失败后的提示增加跳转链接 ([1c56657](https://github.com/hymbz/ComicReadScript/commit/1c566577dcc57ce27f2f357d231668f806510483))

## [6.1.0](https://github.com/hymbz/ComicReadScript/compare/v6.0.1...v6.1.0) (2023-06-24)


### Features

* :sparkles: 实现可以加载本地漫画的 pwa 版 ([6e918cd](https://github.com/hymbz/ComicReadScript/commit/6e918cdc0d2eda642a61fcc302ccdaed4622adb7))
* :sparkles: 支持 welovemanga ([3792080](https://github.com/hymbz/ComicReadScript/commit/37920807e81ba5b98f99b6dd2e578b97265e2ea2))

### Performance Improvements

* :zap: 卷轴模式下默认不再缩放图片 ([ee88001](https://github.com/hymbz/ComicReadScript/commit/ee880014e3ae35f3f3f7d5bee7ee684fc7348d98))
* :zap: 记住卷轴模式下的图片缩放倍率 ([1ffbfde](https://github.com/hymbz/ComicReadScript/commit/1ffbfde5d3518040d48ab2c2f089fe16f3643533))
* :zap: ehentai 默认不再自动进入阅读模式 ([b0429b7](https://github.com/hymbz/ComicReadScript/commit/b0429b7d790c351ea4b709f33ced7900535d277a))

### [6.0.1](https://github.com/hymbz/ComicReadScript/compare/v6.0.0...v6.0.1) (2023-06-21)


### Bug Fixes

* :bug: 修复卷轴模式下缩放的异常表现 ([7f8ac0c](https://github.com/hymbz/ComicReadScript/commit/7f8ac0ce60398030a4d437c279c02c101d3ff15f))
* :bug: 修复与其他插件冲突导致的点击区域一直显示的 bug ([9c80d72](https://github.com/hymbz/ComicReadScript/commit/9c80d729b8ef615353d82c2b71fb61dadedb9bd9))

---

## 2023.6.18

- 更新至新版

## 2023.4.19

## 修复

- 百合会更新后顶部导航栏样式异常
- 使用暴力猴扩展时在拷贝漫画上失效的 bug

## 2022.9.12

## 新增

- 美漫模式

## 2022.8.28

## 新增

- 通过 M 键切换页面填充

## 修复

- 增加拷贝漫画的支持域名
- 修复漫画柜失效问题

## 2022.3.28

## 修复

- 百合会微博图源漫画的显示和下载

## 2022.3.23

## 修复

- 卷轴模式下会误触发跳转至下一话的问题
- 增加了拷贝漫画的支持域名

## 2022.2.27

## 修复

- 增加了拷贝漫画的支持域名

## 2021.12.26

## 修复

- 卷轴模式下部分网站点击上/下一话出错的问题

## 2021.11.21

## 修复

- nhentai 上脚本失效的问题
- 卷轴模式下图片加载导致的页面乱跳的问题

## 2021.11.9

## 新增

- 对 manhuacat 的支持

## 修复

- nhentai 上脚本失效的问题

## 2021.9.4

## 修改

- 在拷贝漫画上改为通过接口直接获取数据

## 2021.9.2

## 修复

- md5 有时不能正常运行的 bug

## 修改

- 更换了实现异步导入外部库的方式

## 2021.7.25

## 修改

- 修改了懒加载外部库的方式，以符合 Greasy Fork 的要求
- loveheaven.net 新站可以直接使用简易漫画阅读模式，不再需要脚本适配了

## 新增

- 对 copymanga 的支持

# 修复

- ehentai 表站某些本子无法正常运行的 Bug

## 2020.10.16

## 修复

- dmzj 改回旧域名后导致的失效问题

## 2020.10.10

## 修复

- dmzj 重定向到新域名后导致的失效问题

## 2020.9.24

## 修复

- 下载时未能正确处理图片 URL 参数的错误

## 2020.8.5

## 修复

- nhentai 搜索页的自动翻页功能失效的 Bug

## 2020.7.18

## 修复

- lhscan 无法正常显示图片的 Bug

## 2020.6.13

## 修复

- nhentai 网站更新后导致的脚本失效问题

## 2020.5.29

## 修复

- ehentai 上无法加载 nhentai 图源的 Bug

## 2020.5.11

## 修复

- 上/下一话切换功能方向错误的 Bug
- nhentai、ehentai 加载时出错后只能手动刷新重试的 Bug


## 2020.4.12

### 新增

- 对 lhscan 的支持

### 修复

- 无法正常进入简易漫画阅读模式的 Bug

## 2020.4.4

### 新增

- 对 mangabz 的支持

### 修复

- 动漫之家部分屏蔽漫画无法正常观看的 Bug
- 卷轴模式背景颜色错误
- 图片加载速度较慢导致的页面填充功能无法正常使用的 Bug

## 2020.1.29

### 新增

- 现在可在设置中自定义背景颜色

### 修复

- 简易模式下的设置无法保存的 Bug

## 2019.10.30

### 新增

- 现在在进入简易漫画阅读模式后，可将当前站点加入自启动名单，之后再次浏览时将自动进入简易阅读模式
- 动漫之家作者页的反和谐。在作者页内显示隐藏漫画

### 修复

- 动漫之家无法导出订阅列表的 Bug


### 修复

- 空格键翻页错误的 Bug

## 2019.10.2

### 修复

- 翻页键反转功能开启后，上下方向键也被反转的 Bug

### 新增

- 增加 PageUp、PageDown、逗号句号为翻页键

## 2019.9.27

### 新增

- 翻页键反转功能。现在可在设置中勾选翻页键反转使键盘翻页键的上/下一页功能反转。
- 自动开启卷轴模式。现在会自动识别漫画类型，如果是条漫就自动开启卷轴模式以方便阅读。

### 修复

- dm5 搜索栏消失 Bug
- dm5 部分域名失效 Bug
- 卷轴模式下的自动进入上/下一话功能误启动

## 2019.9.17

### 新增

- 现在通过方向键、空格键等键盘翻页键翻页浏览至头尾时，可通过继续按键自动进入上/下一话

### 修复

- 漫画柜失效的 Bug

## 2019.7.17

### 修改

- 现在更新后只会提示一次版本更新

### 新增

- 卷轴模式。可在侧边栏切换。
- dm5、manhuagui、manhuadb 的适配

### 修复

- 下载文件未在文件名前补零的 bug

## 2019.6.12

### 修复

- 在 ehentai 加载 nhentai 漫画后无法正常进入阅读模式的错误

## 2019.5.23

### 修复

- 无法在百合会正常运作的 Bug

## 2019.5.4

### 修复

- 适配百合会有目录的帖子，在用目录跳转后可以正常对当前显示的漫画使用阅读模式
- 动漫之家接口更换为新接口

## 2019.4.19

### 增加

- 动漫之家导出浏览历史记录功能
- 百合会新站的自动进入漫画阅读模式

### 修复

- ehentai 无法加载的 Bug
- 百合会新站无法阅读的 Bug

### 更改

- 百合会新站改为自动加载，加载完毕后默认直接自动进入阅读模式

## 2019.4.11

### 增加

- 百合会的自动进入漫画阅读模式

### 更改

- 动漫之家恢复的目录排序方式，并将最新更新章节的颜色改为红色

## 2019.4.10

### 修复

- 动漫之家看被封漫画的 Bug

## 2019.4.9

### 增加

- 动漫之家的自动进入漫画阅读模式

### 修复

- 页面填充功能在某些情况下的错误表现
- 脚本的版本变动后不能正确迁移设置的 Bug

## 2019.3.15

### 增加

恢复动漫之家被封漫画的目录页

## 2018.12.31

### 修复

- 因 Tampermonkey 更新导致的部分功能不启用的 Bug

### 增加

- ehentai、nhentai 加载过程中可以点击按钮，不等待全部图片加载完毕就直接进入阅读模式。

## 2018.12.10

### 增加

- 动漫之家的[优化网页右上角用户信息栏的加载](#优化网页右上角用户信息栏的加载)功能

### 修复

- 因为首次加载时没有保存设置而导致的脚本更新时没有提示的 Bug

## 2018.12.9

### 增加

- 动漫之家的「[导出导入漫画订阅信息](#导出导入漫画订阅信息)」功能
- 阅读动漫之家被封漫画时可以在退出阅读模式后可以再通过油猴菜单里的「进入阅读模式」进入阅读模式

### 更改

- 优化部分站点图片的加载机制

### 修复

- 在没有合适图片的网页下使用简易漫画阅读模式或其他情况下导致脚本进入死循环卡死的 Bug

## 2018.12.6

### 增加

- 在动漫之家下使用「上/下一话」功能后，在网页加载完毕后将自动进入阅读模式

### 修复

- 因动漫之家改版导致的某些被封漫画无法正确加载的 Bug

## 2018.12.5

### 修复

- 无法下载的 Bug
- nhentai 加载中点击会直接重新加载的 Bug

### 更改

- 阅读动漫之家被封漫画时可以退出阅读模式

## 2018.12.4

### 修复

- 动漫之家看不了被封漫画的 Bug

## 2018.12.1

### 修复

- 在部分浏览器上在动漫之家进入阅读模式时会弹出新标签页的 Bug

## 2018.11.28

### 增加

- 针对支持站点以外网站的[简易漫画阅读模式](#简易漫画阅读模式)

### 更改

- 将各个站点的脚本合并为了一个

### 删除

- 对布卡的支持，用「简易漫画阅读模式」就够了

## 2018.10.27

### 修复

- 过宽图片的显示 Bug
- 在 Firefox 上的正则表达式支持
- 在 Firefox 上点击某些按钮可能会弹出空白标签页的 Bug
- 无法在动漫之家登录的 Bug

## 2018.10.15

### 增加

- [ehentai](#ehentai)、[nhentai](#nhentai) 站点的脚本。
- 百合会漫画阅读模式的「上/下一话」功能，仅对有标签的帖子有用。上/下一话为帖子在第一个标签下的上/下一个帖子。
- 动漫之家的「[解除吐槽的字数限制](#解除吐槽的字数限制)」功能。

## 2018.9.26

### 更改

- 页面填充功能逻辑。解决原先在关闭功能后尾页填充也被关闭、有跨页大图出现在图片流中时，页面填充只能在开头到大图间的图片流中起效的问题。修改后的功能逻辑详见[页面填充](#页面填充)
- 脚本设置的入口由原先嵌入目标网页的按钮改为通过油猴扩展的菜单进入。

### 修复

- 下载 Bug
- 上/下一话按钮显示位置错误的 Bug