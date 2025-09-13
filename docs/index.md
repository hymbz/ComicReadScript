![页面填充示例](https://comic-read-docs.pages.dev/页面填充示例.webp)

<p align="center">
  <a href="https://sleazyfork.org/zh-CN/scripts/374903-comicread" target="_blank">
    <img src="https://img.shields.io/greasyfork/v/374903">
  </a>
  <a href="https://sleazyfork.org/zh-CN/scripts/374903-comicread" target="_blank">
    <img src="https://img.shields.io/greasyfork/dt/374903">
  </a>
  <a href="https://sleazyfork.org/zh-CN/scripts/374903-comicread/feedback" target="_blank">
    <img src="https://img.shields.io/greasyfork/rating-count/374903">
  </a>
  <a href="https://github.com/hymbz/ComicReadScript/issues" target="_blank">
    <img src="https://img.shields.io/github/issues/hymbz/ComicReadScript">
  </a>
  <a href="https://hosted.weblate.org/engage/comic_read_script/-/en/">
    <img src="https://hosted.weblate.org/widget/comic_read_script/main/en/svg-badge.svg">
  </a>
  <a href="https://hosted.weblate.org/engage/comic_read_script/-/ru/">
    <img src="https://hosted.weblate.org/widget/comic_read_script/main/ru/svg-badge.svg" />
  </a>
</p>

## 简介

这是一个因为目前大部分漫画站都不支持双页显示，所以每次遇到 **漫画中的跨页大图被分割成两页** 就很不爽的人为了有更好的漫画阅读体验而写的油猴脚本，为主流漫画站增加了**双页阅读模式**和各种优化体验的增强功能。

脚本在双页模式下会自动识别跨页图单独放一页，并自动填充空白页确保其他图片的左右页位置正确，也可通过侧边栏按钮手动调整填充页的开启与否。

脚本会在支持站点的网页右下角弹出用于 **进入阅读模式** 的悬浮按钮。支持站点以外的网站则可以使用「[简易阅读模式](#简易阅读模式)」进行阅读。

> 嫌文字介绍太长想直接上手体验的话欢迎查看阅读模式的「[功能演示](https://comic-read-demo.pages.dev)」

> 如果喜欢这种阅读模式，也想用来看**本地漫画**的话，欢迎使用「[ComicRead PWA](https://comic-read.pages.dev/)」，只要打开网页拖入本地漫画即可获得完全一致的体验

<blockquote>
  <p>
    对你有帮助的话就点个⭐Star吧
    <a href="https://github.com/hymbz/ComicReadScript" target="_blank"><img src="https://img.shields.io/github/stars/hymbz/ComicReadScript?style=social"></a>
  </p>
</blockquote>

## 安装

1. 首先需要在浏览器上装好 [Violentmonkey](https://violentmonkey.github.io/)、[Tampermonkey](https://tampermonkey.net/) 之类的油猴扩展
2. 然后通过 GreasyFork 安装脚本：[点我](https://sleazyfork.org/zh-CN/scripts/374903-comicread)

> 如果你是通过 AdGuard 安装的油猴脚本，请使用 [AdGuard 版](https://github.com/hymbz/ComicReadScript/raw/master/ComicRead-AdGuard.user.js)
> 因为 AdGuard 安装的脚本没有扩展菜单可以点击，所以 AdGuard 版删除了简易阅读模式，只在支持网站上运行。
>
> 但通过 AdGuard 安装的油猴脚本会和其他广告屏蔽软件发生冲突，需要在发生冲突时为其他广告屏蔽软件添加对应站点的白名单规则，具体可参考 [issue](https://github.com/hymbz/ComicReadScript/issues/170#issuecomment-2208946970)

## 配置

脚本共有两类配置：

1. 阅读模式配置。通过阅读模式内左侧边栏的设置按钮唤出面板进行修改。
1. 站点增强功能。通过网页右下角悬浮按钮上的快捷按钮来切换开启与否。

除快捷键外的所有配置修改都只会在当前站点生效保存，以便在不同网站上使用不同的配置。

在确定了一个网站的常用配置后，可以锁定当前配置。锁定后即使修改了配置也不会保存，避免临时修改配置后又要改回来。

## 快捷键

| 操作         | 快捷键                                               |
| ------------ | ---------------------------------------------------- |
| 翻页         | `滚轮` `空格` `wasd` `方向键` `,.` `PageUp/PageDown` |
| 进入缩放模式 | `鼠标双击` `Alt + 滚轮`                              |
| 跳到漫画首尾 | `Home` / `End`                                       |
| 切换页面填充 | `/` `m` `z` `鼠标中键`                               |
| 退出阅读模式 | `Esc`                                                |
| 进入阅读模式 | `v`                                                  |

> 可在进入阅读模式后左侧边栏的设置中修改

## 页面填充

> **省流：当跨页大图没有正确合并显示时，切换一下页面填充的开启状态即可**

这个功能会在图片流中增加或删除空白页，以便在双页模式下调节图片左右页位置。

如果你在用双页模式阅读漫画时完全没有违和感，也不追求漫画左右页位置正确，那不需要了解也完全没事。反倒是在了解后可能会因为意识到违和感的存在，在阅读少部分漫画时因为不管怎么调整都觉得不对而浑身难受。

但如果你追求接近翻阅实体书的体验，并且**不是强迫症敏感体质**，那还是非常推荐了解一下《[如何判断漫画左右页位置是否正确？](https://comic-read-docs.pages.dev/判断左右页位置.html)》

## 卷轴模式

针对条漫，脚本设置了卷轴模式来阅读，在卷轴模式下可以通过 `Alt + 滚轮` 来调节图片缩放。

脚本会自动通过图片的长宽比来识别当前漫画是否是条漫，并自动开启卷轴模式。但如果汉化组将条漫分割得太多太细的话就只能手动切换了。

在卷轴模式下可以使用`向上翻页`/`向下翻页`的快捷键进行类似`空格`、`PageUp/PageDown`的滚动，只是滚动距离会更短。

> 原生用于滚动的按键在卷轴模式下不会触发快捷键，例如↑↓←→方向键、空格键等

## 并排卷轴模式

![并排卷轴模式示例](https://comic-read-docs.pages.dev/并排卷轴模式示例.webp)

手机以外的设备在看条漫时左右两边总要浪费一大片空间，并排卷轴模式通过将多列漫画并排放在一起的方式尝试改善该问题。

不过直接并排摆放的话，有几率出现文字刚好在边缘被分割显示的情况，为此每列开头会重复显示上一列结尾的一部分，这样即使被文字被分割到了也可以直接去下一列看。具体比例可在设置的 `每列重复比例` 中调整。另外也可以通过`拖拽`或`上下方向键`调整整体进度。

## 简易阅读模式

> 通过油猴扩展菜单里脚本下的「使用简易阅读模式」菜单项开启。

用于在支持站点以外的网站阅读漫画。开启后，将把当前网页中显示的所有宽高均大于 500 像素的图片作为图源加载，并且**会自动触发图片的懒加载，不需要手动滚动页面来加载图片**。

如果站点本身不需要翻页，能够在一个页面内显示所有漫画图片一屏到底的话，可以直接使用「简易阅读模式」阅读。

如果需要翻页的话，可以安装：

1. 能够**自动识别**大部分网页的「[东方永页机](https://greasyfork.org/zh-CN/scripts/438684)」（注意不能启用 contentVisibility 功能）
2. 手动支持了**超多**图站、漫画网站的「[圖片全載](https://sleazyfork.org/zh-CN/scripts/463305)」
3. 等其他带有自动翻页、聚图功能的脚本

用其他脚本将多页图片聚合到一起作为图源。期间不需要手动操作，脚本会自动触发翻页脚本加载至最后一页。

默认会开启「记住当前站点」功能，在之后再次打开站点时自动使用「简易阅读模式」，**可通过右下角悬浮按钮上的快捷按钮关闭**。

为防止在漫画页外的其他页面——比如首页、介绍页——自动进入阅读模式，脚本会记录漫画页的部分网页特征，之后只有在匹配到特征时才会自动使用「简易阅读模式」。所以在网站改版、更换自动翻页脚本后，就可能因识别不到特征而没有自动使用「简易阅读模式」，这时候只要重新手动开启下就行了。

## 翻译

「[manga-image-translator](https://github.com/zyddnys/manga-image-translator/blob/main/README_CN.md)」是一个实现了自动翻译并嵌字的项目，本身开源并且有 docker 可以很方便的部署到本地，同时也有即开即用的在线演示站「[Cotrans](https://cotrans.touhou.ai/)」可供试用。

为方便啃生肉，脚本通过调用其接口实现了一键汉化，并且同时支持本地部署的版本和 Cotrans。在设置中选择好翻译服务器后，就能通过侧边栏中的翻译按钮开启/关闭当前显示页图片的汉化。

但是！Cotrans 是由维护者用爱发电自费维护的，多人同时使用时需要排队等待，等待队列达到上限后再上传新图片会报错，需要过段时间再试，所以还请大家 **注意用量**。

也正因如此，更推荐大家使用本地部署的项目，不抢服务器资源也不需要排队。**一键翻译全部图片**等批量翻译的功能开关只会在使用本地版时可用。具体部署方法可参考 [我的笔记](https://comic-read-docs.pages.dev/本地部署翻译.html)。

脚本默认本地服务器的 url 是 <http://127.0.0.1:5003>，如果你点开这个链接后没见到 manga-image-translator 的页面，就得在`自定义服务器 URL`设置项中输入正确的 url，否则`翻译服务`的菜单项将始终为空。

Cotrans 也有自己的油猴脚本 —— 「[Cotrans 漫画/图片翻译器](https://greasyfork.org/zh-CN/scripts/437569)」，支持 Pixiv、Twitter、Misskey、Calckey，欢迎有相关需求的人安装。

![翻译功能示例](https://comic-read-docs.pages.dev/翻译功能示例.webp)

> 如果需要翻译本地漫画，可以使用「[ComicRead PWA](https://comic-read.pages.dev/)」

## 图像识别

开启此功能后将改变图片的加载方式，以便获取图片的像素数据实现相关功能。默认关闭，需手动开启。

代价是无法在加载时逐步显示图片，要等到整张图加载完毕才能显示。

> 如果经常使用「[翻译](#翻译)」功能，则建议也打开该功能，避免在翻译时需要重新下载图片。

### 识别背景色

识别并设置图片页的背景色。因为是针对有页边的漫画而设计的，所以在没有页边的彩图、CG 上很容易误判。

### 自动调整页面填充

识别判断图片是左页还是右页，并据此调整页面填充。

### 放大图片

使用 [web-realesrgan](https://github.com/xororz/web-realesrgan)，直接在浏览器上放大图片。

> 首次开启需要下载一个 2MB 的模型文件，之后会缓存在油猴扩展的存储数据中，在不同网站上一起使用，不会重复下载。

## 支持网站

部分网站除阅读模式外，还添加了一些增强功能，具体可点击跳转查看详情

- [百合会](https://bbs.yamibo.com)
  - [记录阅读进度](#记录阅读进度)
  - [关闭快捷导航的跳转](#关闭快捷导航的跳转)
  - [固定导航条](#固定导航条)
  - [修正点击页数时的跳转判定](#修正点击页数时的跳转判定)
  - 自动签到
- [百合会新站](https://www.yamibo.com)
- [动漫之家](https://manhua.idmzj.com)
  - 解锁隐藏漫画
- [E-Hentai](https://e-hentai.org)
  - [关联外站](#关联外站)
  - [快捷收藏](#快捷收藏)
  - [标签染色](#标签染色)
  - [悬浮标签列表](#悬浮标签列表)
  - [标签检查](#标签检查)
  - [识别广告页](#识别广告页)
- [nhentai](https://nhentai.net)
  - [彻底屏蔽漫画](#彻底屏蔽漫画)
  - [无限滚动](#无限滚动)
  - [识别广告页](#识别广告页)
- [Yurifans](https://www.yurifans.com)
  - 自动签到
- [拷贝漫画](https://www.mangacopy.com/)
  - 在目录页显示上次阅读记录
  - 解锁隐藏漫画

<!-- 根据 src/index.ts 自动生成 -->
<!-- supportSiteList -->

- [Pixiv](https://www.pixiv.net)
- [再漫画](https://manhua.zaimanhua.com/)
- [明日方舟泰拉记事社](https://terra-historicus.hypergryph.com)
- [禁漫天堂](https://18comic.vip)
- [漫画柜(manhuagui)](https://www.manhuagui.com)
- [动漫屋(dm5)](https://www.dm5.com)
- [绅士漫画(wnacg)](https://www.wnacg.com)
- [mangabz](https://mangabz.com)
- [komiic](https://komiic.com)
- [MangaDex](https://mangadex.org)
- [NoyAcg](https://noy1.top)
- [無限動漫](https://www.8comic.com)
- [熱辣漫畫](https://www.relamanhua.org/)
- [hitomi](https://hitomi.la)
- [SchaleNetwork](https://schale.network/)
- [nude-moon](https://nude-moon.org)
- [kemono](https://kemono.su)
- [nekohouse](https://nekohouse.su)
- [welovemanga](https://welovemanga.one)
- [HentaiZap](https://hentaizap.com)
- [最前線](https://sai-zen-sen.jp)
- [Tachidesk](https://github.com/Suwayomi/Tachidesk-Sorayomi)

<!-- supportSiteList -->

## 百合会

> 虽然可能没多少人会用上，但脚本也支持移动版

除了右下角的悬浮按钮外，将鼠标移动到帖子一楼的顶端也能看到一个新增的「漫画阅读」按钮

![百合会入口](https://comic-read-docs.pages.dev/百合会入口.jpg)

### 记录阅读进度

这个功能是用来快速回到帖子上次阅读进度的。开启后，每个帖子后面都会跟着一个跳转至上次阅读位置的TAG，点击即可跳转至上次阅读进度（阅读进度不仅包括了页数也包括了楼层数），后面跟着的数字是上次阅读后新增的回复数。

![百合会记录阅读进度功能](https://comic-read-docs.pages.dev/百合会记录阅读进度功能.jpg)

### 关闭快捷导航的跳转

顶部导航条的快捷导航可以方便地在各个板块之间跳转，但默认情况下只能通过鼠标悬浮的方式显示其板块菜单，直接点击的话会跳转至论坛主页，这在平板上很不方便，所以有了这个功能。功能很简单，就是关掉快捷导航的点击跳转，只保留悬浮显示菜单的功能。

### 固定导航条

快捷导航的跳转是很方便，但每次跳转都要把网页滚到顶部去就有点麻烦了。开启这个功能可以将顶部的导航条固定住，不管怎么滚动都始终保持在页面顶部。

### 修正点击页数时的跳转判定

明明在板块顶部有个“新窗”的选项来选择帖子的默认打开位置，但即使勾上了新窗，通过点击帖子后面的页数打开的页面还是会在当前页打开。开启这个功能可以补上这个缺漏。

## E-Hentai

![ehentai例图](https://comic-read-docs.pages.dev/ehentai例图.png)

除悬浮按钮外，也会在右侧边栏会增加一个「Load comic」按钮，功能和悬浮按钮一样。

> E-Hentai 的图片链接会在一段时间后过期失效，因此建议开启「始终加载所有图片」设置，在过期前就加载好所有图片。
>
> 如果需要经常下载和翻译的话，建议再开启「[图像识别](#图像识别)」功能，在加载阶段直接下载好图片文件，避免之后因图片链接过期而出错。

> 因为站点增强功能过多，为了避免屏幕放不下，部分功能的开关不显示在悬浮按钮上，而是放到了进入阅读模式后的设置面板里。

### 加载指定页码

在按住 `Shift` 的情况下点击侧边栏的「Load comic」按钮将会弹出一个输入框，可以通过输入 `1, 3-5, 9-` 格式的页码范围来只加载对应页码的图片。

多个页码范围之间用 `,` 隔开，单个数字代表单个页码，`3-5` 表示 3 到 5 页，`9-` 表示 9 到最后一页。

### 关联外站

关联其他站点的漫画源，使用外站源来加载图片，避免消耗配额，同时或许（？）也能用更快的速度加载图片。

结果会以标签的形式显示在标签列表中，鼠标悬停在标签上可以看到外站漫画的具体标题，点击标签后会出现跳至外站或直接加载的选项，也可以直接右键标签点击「在新标签页中打开」来跳至外站。

目前支持 nhentai 和 hitomi。

> nhentai 的反爬风控会不定期调整，有时会严格到即使已经在 nhentai 登录了也不行，这时候只能嗯等阶段性调整过去

### 快捷收藏

将原本的收藏弹窗改成在当前页面显示，并在选中收藏夹后自动确认。

![eh快捷收藏-详情页](https://comic-read-docs.pages.dev/eh快捷收藏-详情页.webp)

![eh快捷收藏-列表页](https://comic-read-docs.pages.dev/eh快捷收藏-列表页.webp)

> 因为没有空间放输入框，加上感觉收藏备注功能很少会使用，所以不支持收藏备注。
>
> 如有需要，可以使用 `鼠标中键` 点击或按住 `ctrl`、`shift`、`alt` 等任意修饰键再点击可以调出原本的收藏弹窗

### 标签染色

根据 My Tags 里的设置，为详情页里的标签加上对应样式。默认关闭，需手动开启。

虽然已经有好几个相同功能的脚本了，但无一例外都会直接覆盖掉标签的边框和字体颜色，导致无法看出标签的状态（详见 [EHWiki](https://ehwiki.org/wiki/Tagging_Mechanics/Chinese)），因此还是重复造了这个轮子，相较其他脚本做了改进：不覆盖弱标签的边框、原本的字体颜色改用下划线显示。

![eh标签染色](https://comic-read-docs.pages.dev/eh标签染色.webp)

> 标签颜色数据将在 `功能开启时`、`进入 My Tags 时` 和 `在 My Tags 中修改后` 更新

> 同时顺便对 My Tags 和列表页上显示的标签，按照颜色、命名空间、权重等信息进行排序。

### 悬浮标签列表

因为「[E绅士标签翻译辅助工具-标签编辑](https://github.com/EhTagTranslation/UserScripts/tree/master/TagEditor)」无法和本脚本适配所以就自己实现了这个功能。让标签列表可以随意拖动和被快捷键唤出。默认关闭，需手动开启。

![eh悬浮标签列表](https://comic-read-docs.pages.dev/eh悬浮标签列表.webp)

相较原脚本增加了快捷键 `q` 以便在阅读模式下唤出（可在设置中修改），并能同时显示「[EhSyringe](https://github.com/EhTagTranslation/EhSyringe)」的标签描述，使用 `Shift + 鼠标滚轮` 调节透明度。

在悬浮状态下，打完标签后输入框会自动失焦以便能立刻用快捷键关闭窗口，并且输入框只要用鼠标划过就会自动聚焦省去鼠标点击。

标签可以直接拖拽进输入框。判定范围很广，不一定要拖到输入框上，只要在面板里就行。

### 展开标签列表

默认缩略图列表下只会显示关注的标签。开启此功能后，点击标签区域即可展开详细的标签列表，也可以通过将鼠标移至目标上后按快捷键 `q` 来展开（和「[悬浮标签列表](#悬浮标签列表)」功能共用一个快捷键）。

![eh展开标签列表](https://comic-read-docs.pages.dev/eh展开标签列表.webp)

### 标签检查

检查并提示下列情况：

1. 缺少前置标签
   - 例：`比基尼`需要`泳装`标签
   - ※ 注意不要无脑添加前置标签，也有可能这个标签的存在本身就是错误
1. 标签冲突
   - 例：`纯女性`标签和任何非女性标签
1. 疑似标签冲突
   - 例：`萝莉`和`贫乳`标签（因为可能存在多个角色所以只是疑似
1. 常见关联标签
   - 例：`猫娘`一般都有`兽耳`标签

![eh标签检查](https://comic-read-docs.pages.dev/eh标签检查.webp)

> 已经存在的弱标签也会提示，方便投票点赞

⚠️⚠️⚠️ 请务必自行过脑判断后再投票，每个人都是自己标签投票正确率的第一责任人，脚本的作用仅仅是简单提醒和免手打标签。

具体规则详见：[ehTagRules.ts](https://github.com/hymbz/ComicReadScript/blob/master/src/userscript/ehTagRules/index.ts)，欢迎反馈补充或直接 PR。

为了方便对照关联，填入输入框里的标签会自动高亮。

### 识别广告页

简单识别下广告页并自动排除，只会在有`extraneous ads(外部广告)`标签时生效。

如有误杀还请先反馈，然后可以先在右下角的悬浮按钮菜单里关闭该功能，等脚本更新修复后再开启。

### 快捷评分

让列表页显示的评分不再只是摆设，而是和详情页一样可以直接点击修改。

### 快捷查看标签定义

在详情页内嵌查看标签定义。

### 增加快捷键操作

- 使用设置中的`向左/右滚动`快捷键在列表页和详情页翻页
- 使用`上下方向键`进行标签投票
- 使用`ESC`取消选中当前标签

### 自动调整阅读配置

因为目前图像识别功能对没有页边的彩图、CG 不仅毫无作用还会误判，所以有了这个功能。在「Doujinshi」「Manga」「Non-H」以外的分类下，自动关闭图像识别，顺便改为单页模式。默认关闭，需手动开启。

## nhentai

除悬浮按钮外，也会在右侧边栏会增加一个「Load comic」按钮，功能和悬浮按钮一样。

### 彻底屏蔽漫画

nhentai 只给被屏蔽漫画加上了一层半透明遮罩而没有隐藏，被屏蔽漫画还是会占用着页面空间。开启此功能后，被屏蔽漫画将被彻底屏蔽。

### 无限滚动

当网页滚动至底部时将自动在底部加载下一页的内容，加载时底部会有加载条表示正在加载，当加载条停止时表示已到最后页。

> 如果同时开启了「彻底屏蔽漫画」功能，将自动跳过没有结果的页面。

## i18n

为了方便中文圈外的用户使用，脚本借助 [Weblate](https://hosted.weblate.org/engage/comic_read_script/) 实现了多语言的翻译（感谢 Weblate 为开源项目提供的免费套餐）。欢迎更多好心人通过 [Weblate](https://hosted.weblate.org/engage/comic_read_script/) 提供新语言翻译或帮忙改进现有翻译质量。

同时非常感谢以下已经为脚本提供了翻译的贡献者

- русский - [@EnergoStalin](https://github.com/EnergoStalin)
- தமிழ் - [@TamilNeram](https://github.com/TamilNeram)

<a href="https://hosted.weblate.org/engage/comic_read_script/" align="left"><img src="https://hosted.weblate.org/widget/comic_read_script/main/287x66-grey.png" alt="翻译状态" /></a>
<a href="https://hosted.weblate.org/engage/comic_read_script/" align="right"><img src="https://hosted.weblate.org/widget/comic_read_script/main/multi-auto.svg" alt="翻译状态" /></a>

## 致谢

感谢 [BrowserStack](https://www.browserstack.com/open-source?ref=pricing) 为开源项目提供的免费套餐。

This project is tested with BrowserStack.
