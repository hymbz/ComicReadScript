# Changelog

## [12.1.0](https://github.com/hymbz/ComicReadScript/compare/v12.0.0...v12.1.0) (2025-08-17)

### Features

* :sparkles: 尽量在下载时保持原文件名 ([7bc48d1](https://github.com/hymbz/ComicReadScript/commit/7bc48d168888b1022156078b246f20f71aeced84))
* :sparkles: 增加站点 最前線 的支持 ([52493e8](https://github.com/hymbz/ComicReadScript/commit/52493e850a2b859d7b11c37d9bc121a9a4563023)), closes [#263](https://github.com/hymbz/ComicReadScript/issues/263)

### Bug Fixes

* :bug: 修复 AdGuard 版和 jsDelivr 版资源链接错误导致无法运行的 bug ([42a068a](https://github.com/hymbz/ComicReadScript/commit/42a068a2c0bb4d88556c4d15d4280302a83f6bae)), closes [#273](https://github.com/hymbz/ComicReadScript/issues/273)
* :bug: 修复 ehentai 匹配 hitomi 功能在 CG 类画廊上未启用的 bug ([13d45ae](https://github.com/hymbz/ComicReadScript/commit/13d45ae22d97197b51eb2ae67f89d277b2e06ace)), closes [#243](https://github.com/hymbz/ComicReadScript/issues/243)
* :bug: 修复开启 AdGuard 后脚本在 hitomi 上无法运行的 bug ([81b75e8](https://github.com/hymbz/ComicReadScript/commit/81b75e8816a8a5264d39e761c094343e53233d46)), closes [#261](https://github.com/hymbz/ComicReadScript/issues/261)

## [11.13.0](https://github.com/hymbz/ComicReadScript/compare/v11.12.1...v11.13.0) (2025-08-11)

### Features

* :sparkles: 实现图片放大功能（需要打开「图像识别」功能） ([9455cf9](https://github.com/hymbz/ComicReadScript/commit/9455cf99792f22eb880cd68359dfd8f4de20ac15)), closes [#187](https://github.com/hymbz/ComicReadScript/issues/187)
* :sparkles: 增加 ehentai 在缩略图列表页里展开标签列表功能 ([5c048dc](https://github.com/hymbz/ComicReadScript/commit/5c048dcab2da7afac0ad3927089c6465723e2855))
* :sparkles: 将 ehentai 部分增强功能的开关，从网页悬浮按钮菜单移至阅读模式的设置面板里 ([5b3dc58](https://github.com/hymbz/ComicReadScript/commit/5b3dc58a342676e0b163c8161bcdc148ef4ab4fb))
* :sparkles: ehentai 上使用左右方向键在列表页和详情页翻页功能，改为使用设置中的「向左/右滚动」快捷键 ([5d0bc14](https://github.com/hymbz/ComicReadScript/commit/5d0bc14232bf7ca87b534a239f01fb976007aecf))
* :sparkles: 进入阅读模式后将不再自动熄屏 ([bd29ebf](https://github.com/hymbz/ComicReadScript/commit/bd29ebfdaf8de36d4902b2289cf5d2dfc109fa8b))

### Bug Fixes

* :bug: 修复 nhentai 图片加载错误的 bug ([44fa911](https://github.com/hymbz/ComicReadScript/commit/44fa911a5f26b3d5134e5398ba370a53493bb240))
* :bug: 修复 yurifans 有时无法正常加载的 bug ([2334b2c](https://github.com/hymbz/ComicReadScript/commit/2334b2c472b9e4fb485a038e32e68b18457dcd70))
* :bug: 支持拷贝漫画新域名 ([e866540](https://github.com/hymbz/ComicReadScript/commit/e8665406c6f75abdc3cbd680e41ffe7418579239)), closes [#264](https://github.com/hymbz/ComicReadScript/issues/264)
* :bug: 修复拷贝漫画提示最后阅读功能失效的 bug ([4af98f8](https://github.com/hymbz/ComicReadScript/commit/4af98f8ae5df4d8ce62bd482f8c50f2793285c9d)), closes [#258](https://github.com/hymbz/ComicReadScript/issues/258)
* :bug: 修复无限动漫无法下载的 bug ([ce18b47](https://github.com/hymbz/ComicReadScript/commit/ce18b472d473dc69cbcfcc18e8cddbd2631b6e94)), closes [#259](https://github.com/hymbz/ComicReadScript/issues/259)


## [11.12.1](https://github.com/hymbz/ComicReadScript/compare/v11.12.0...v11.12.1) (2025-06-20)

### Bug Fixes

* :bug: 修复拷贝漫画加载出错的 bug ([ba460c9](https://github.com/hymbz/ComicReadScript/commit/ba460c994251342e8b7bb3e58a1a0c90844efa05)), closes [#257](https://github.com/hymbz/ComicReadScript/issues/257)

## [11.12.0](https://github.com/hymbz/ComicReadScript/compare/v11.11.0...v11.12.0) (2025-06-13)

### Features

* :sparkles: 实现自动滚动功能 ([3ab2272](https://github.com/hymbz/ComicReadScript/commit/3ab2272ba4db54c21062afafb25222f07c4e3022)), closes [#249](https://github.com/hymbz/ComicReadScript/issues/249)
* :sparkles: 支持 HentaiZap ([d1aeaf8](https://github.com/hymbz/ComicReadScript/commit/d1aeaf8d5521e0ae1485962b5a43d924ccdf84de)), closes [#254](https://github.com/hymbz/ComicReadScript/issues/254)
* :sparkles: ehentai 的「关联 nhentai」功能改为「关联外站」，增加关联 hitomi 的漫画 ([858cb28](https://github.com/hymbz/ComicReadScript/commit/858cb281952f2544bf0bfe73881e542a9290601a)), closes [#243](https://github.com/hymbz/ComicReadScript/issues/243)

### Bug Fixes

* :bug: 调整滚动和翻页快捷键在卷轴模式下的行为，使之分别更接近方向键和 PageDown/PageUp 的表现 ([a414a90](https://github.com/hymbz/ComicReadScript/commit/a414a90ecf21a8304c9ff8765a9efb2e344f2825)), closes [#241](https://github.com/hymbz/ComicReadScript/issues/241)
* :bug: 修复在 pixiv 上失效的 bug ([441f478](https://github.com/hymbz/ComicReadScript/commit/441f4783f841c80a014cd3c1d8ae45e6fdc7e252)), closes [#241](https://github.com/hymbz/ComicReadScript/issues/241)

## [11.11.0](https://github.com/hymbz/ComicReadScript/compare/v11.10.0...v11.11.0) (2025-06-10)

### Features

* :sparkles: 为卷轴模式下的快捷键滚动增加平滑过渡 ([5ea5474](https://github.com/hymbz/ComicReadScript/commit/5ea5474406925020bed6b9fbdc01833e3fb5ccfb)), closes [#241](https://github.com/hymbz/ComicReadScript/issues/241)
* :sparkles: 增加全屏快捷键 ([2ec5c6a](https://github.com/hymbz/ComicReadScript/commit/2ec5c6a38e9132e1f85edaf995cd88c20fa2162f))
* :sparkles: 支持百合会非“中文百合漫画区”和“百合漫画图源区”的帖子 ([2ea3fb0](https://github.com/hymbz/ComicReadScript/commit/2ea3fb0032d6dcdbe1f6f12a5780b29bbf300a50)), closes [#248](https://github.com/hymbz/ComicReadScript/issues/248)

### Bug Fixes

* :bug: 修复部分情况下简易模式无法正常加载图片的 bug ([242a2ad](https://github.com/hymbz/ComicReadScript/commit/242a2ade9bf9705d731588de9d84274a03f57c30))
* :bug: 修复再漫画上/下话切换颠倒的 bug ([3f164f9](https://github.com/hymbz/ComicReadScript/commit/3f164f9ebd4f44efa6f61648942c1b06bf54a5d9)), closes [#245](https://github.com/hymbz/ComicReadScript/issues/245)
* :bug: 支持拷贝漫画的新域名 ([7164975](https://github.com/hymbz/ComicReadScript/commit/71649752282351ef8a779f566b03a3eccd846e22)), closes [#240](https://github.com/hymbz/ComicReadScript/issues/240)

## [11.10.0](https://github.com/hymbz/ComicReadScript/compare/v11.9.4...v11.10.0) (2025-04-17)

### Features

* :sparkles: 增加自动全屏选项 ([8a91594](https://github.com/hymbz/ComicReadScript/commit/8a915945124754119819c33131f640433b6f2bb4)), closes [#237](https://github.com/hymbz/ComicReadScript/issues/237)

### Bug Fixes

* :bug: 修复退出时未关闭全屏模式的 bug ([eafa2aa](https://github.com/hymbz/ComicReadScript/commit/eafa2aa26cd8f3344280d0251071802ed438f1cb)), closes [#236](https://github.com/hymbz/ComicReadScript/issues/236)

## [11.9.4](https://github.com/hymbz/ComicReadScript/compare/v11.9.3...v11.9.4) (2025-04-13)

### Bug Fixes

* :bug: 修复 ehentai 使用快捷收藏修改收藏夹时会丢失备注的 bug ([0e0f43d](https://github.com/hymbz/ComicReadScript/commit/0e0f43dd943c7dda945d5b5920fb10761e1548bf)), closes [/sleazyfork.org/scripts/374903/discussions/294606#comment-585906](https://github.com/hymbz//sleazyfork.org/scripts/374903/discussions/294606/issues/comment-585906)

## [11.9.3](https://github.com/hymbz/ComicReadScript/compare/v11.9.2...v11.9.3) (2025-04-08)

### Bug Fixes

* :bug: 修复 ehentai 因识别广告图出错导致无法正常运行的 bug ([379a254](https://github.com/hymbz/ComicReadScript/commit/379a254cb21923524576bf557676ee7eb95656f2))
* :bug: 修复打开设置面板会取消所有翻译的 bug ([d902415](https://github.com/hymbz/ComicReadScript/commit/d902415f4d76243cd11abb501855c75930625bd2)), closes [/sleazyfork.org/scripts/374903/discussions/294206#comment-585741](https://github.com/hymbz//sleazyfork.org/scripts/374903/discussions/294206/issues/comment-585741)

## [11.9.2](https://github.com/hymbz/ComicReadScript/compare/v11.9.1...v11.9.2) (2025-04-03)

### Bug Fixes

* :bug: 修复 pwa 上设置面板的显示 bug ([ec2e716](https://github.com/hymbz/ComicReadScript/commit/ec2e71699e88c2afee76c4c5c3fba856c3e74f7c)), closes [/sleazyfork.org/scripts/374903/discussions/294206#comment-585216](https://github.com/hymbz//sleazyfork.org/scripts/374903/discussions/294206/issues/comment-585216)
* :bug: 修复设置面板的显示 bug ([95379e1](https://github.com/hymbz/ComicReadScript/commit/95379e191a829be70ff7c9130aef97d28962b41b)), closes [/sleazyfork.org/scripts/374903/discussions/294206#comment-585216](https://github.com/hymbz//sleazyfork.org/scripts/374903/discussions/294206/issues/comment-585216)
* 放弃支持 コミックグロウル（comic-growl.com） ([8c01279](https://github.com/hymbz/ComicReadScript/commit/8c01279dee2925ec9d5b5fcd2b9231820e43f51c))

## [11.9.1](https://github.com/hymbz/ComicReadScript/compare/v11.9.0...v11.9.1) (2025-03-31)

### Bug Fixes

* :bug: 修复在部分网站上无法正常运行的 bug ([36982ad](https://github.com/hymbz/ComicReadScript/commit/36982ad75c58c2bfe68d738afac26e314881c304))

## [11.9.0](https://github.com/hymbz/ComicReadScript/compare/v11.8.4...v11.9.0) (2025-03-28)

### Features

* :sparkles: 为 ehentai 的「标签检查」功能增加「高亮输入框内标签」的小功能 ([803a121](https://github.com/hymbz/ComicReadScript/commit/803a12181248eaf6a14eb7c759f0c6b3bae468ad))
* :sparkles: 支持新版本 manga-image-translator 增加的翻译参数 ([f063d93](https://github.com/hymbz/ComicReadScript/commit/f063d931f5f8eb81d9ba9a74c9d3f7b780b26686))

### Bug Fixes

* :bug: 修复部分情况下「翻译当前页至结尾」按钮状态异常的 bug ([63b0c85](https://github.com/hymbz/ComicReadScript/commit/63b0c85fa2afbfc9385e4294c8d6630e67ba4313)), closes [/sleazyfork.org/scripts/374903/discussions/293712#comment-584194](https://github.com/hymbz//sleazyfork.org/scripts/374903/discussions/293712/issues/comment-584194)
* :bug: 修复与新版本 manga-image-translator 的兼容问题 ([d8cdc23](https://github.com/hymbz/ComicReadScript/commit/d8cdc2331c7fb1d0e5f407f2d0aaf38999614e85)), closes [#231](https://github.com/hymbz/ComicReadScript/issues/231)

## [11.8.4](https://github.com/hymbz/ComicReadScript/compare/v11.8.3...v11.8.4) (2025-03-23)

### Bug Fixes

* :bug: 修复 hitomi 失效的 bug ([b24ddbc](https://github.com/hymbz/ComicReadScript/commit/b24ddbcea66751be33a608cc695ad4b72748ad56))
* :bug: 修复拷贝漫画移动端未正常显示上/下一话按钮的 bug ([29359e0](https://github.com/hymbz/ComicReadScript/commit/29359e05d7cbc2577b2f8d42691711f8fc08f069))

## [11.8.3](https://github.com/hymbz/ComicReadScript/compare/v11.8.2...v11.8.3) (2025-03-10)

### Bug Fixes

* :bug: 修复在 pixiv 非作品页出现悬浮按钮的 bug ([3c45b78](https://github.com/hymbz/ComicReadScript/commit/3c45b78e4542291e1eba9b8beae10664dfb04f84)), closes [#229](https://github.com/hymbz/ComicReadScript/issues/229)
* :bug: 修复在火狐浏览器上悬浮按钮未正确保存移动位置的 bug ([f2ab90c](https://github.com/hymbz/ComicReadScript/commit/f2ab90c60a6bc603b3513164ae6a0600007be1f1)), closes [#221](https://github.com/hymbz/ComicReadScript/issues/221)

## [11.8.2](https://github.com/hymbz/ComicReadScript/compare/v11.8.1...v11.8.2) (2025-03-05)

### Bug Fixes

* :bug: 翻译多张图片时，始终优先翻译靠前的页面 ([f6e35e7](https://github.com/hymbz/ComicReadScript/commit/f6e35e701cb7166496ea47b87fd81c4af573f123))
* :bug: 修复 kemono.su 失效的 bug ([a2fc770](https://github.com/hymbz/ComicReadScript/commit/a2fc7707b0ec0870604e399fdbac178f2efbe4b2))
* :bug: 修复和「EhAria2下载助手」的显示冲突 ([0048985](https://github.com/hymbz/ComicReadScript/commit/0048985966881336db20a1fd2b092c5802e2fa26))
* :bug: 修复在 pixiv 上未正常运行的 bug ([648732d](https://github.com/hymbz/ComicReadScript/commit/648732d03ca56293fab7db9859e550983bd49d09)), closes [#229](https://github.com/hymbz/ComicReadScript/issues/229)

## [11.8.1](https://github.com/hymbz/ComicReadScript/compare/v11.8.0...v11.8.1) (2025-02-25)

### Bug Fixes

* :bug: 修复 ehentai 未提醒 IP 被禁的 bug ([66e63d1](https://github.com/hymbz/ComicReadScript/commit/66e63d167b6645dd92862f6926ee982040832f31))
* :bug: 修复悬浮按钮点击失效的 bug ([b94fd50](https://github.com/hymbz/ComicReadScript/commit/b94fd50e82b7f224500454f772235dae8f615557))
* :bug: 修复在再漫画上失效的 bug ([8270370](https://github.com/hymbz/ComicReadScript/commit/8270370c0805755d7f4ed12297ca77ecb91fee69)), closes [#225](https://github.com/hymbz/ComicReadScript/issues/225)

## [11.8.0](https://github.com/hymbz/ComicReadScript/compare/v11.7.0...v11.8.0) (2025-02-24)

### Features

* :sparkles: 右下角悬浮按钮可以被拖动调整位置 ([c6c955f](https://github.com/hymbz/ComicReadScript/commit/c6c955f69791a54a7fbad6039d3e4a657a13d2b5)), closes [#221](https://github.com/hymbz/ComicReadScript/issues/221)
* :sparkles: 支持 pixiv ([95fe110](https://github.com/hymbz/ComicReadScript/commit/95fe1100db5451ebc23d807bcdfc22e74d57fcc6)), closes [#224](https://github.com/hymbz/ComicReadScript/issues/224)

### Bug Fixes

* :bug: 修复 ehentai 翻页快捷键功能失效的 bug ([66b4d85](https://github.com/hymbz/ComicReadScript/commit/66b4d85f922dddaf6157ec28f92f3c018658443b))
* :bug: 修复因太久未更新或运行脚本导致的配置结构错误 ([65a6470](https://github.com/hymbz/ComicReadScript/commit/65a6470ce973e780496347cdf94d15a3d036e01e)), closes [#223](https://github.com/hymbz/ComicReadScript/issues/223)

## [11.7.0](https://github.com/hymbz/ComicReadScript/compare/v11.6.0...v11.7.0) (2025-02-20)

### Features

* :sparkles: 出错图片间隔一段时间自动重试 ([f97af5f](https://github.com/hymbz/ComicReadScript/commit/f97af5f3b5c8f992f2f31de340c6043221c145ca))
* :sparkles: 简易模式可以自动识别更多网站的上/下话切换 ([879365a](https://github.com/hymbz/ComicReadScript/commit/879365a5c1c554ae47b879f94555a5e000abc940))

### Bug Fixes

* :bug: 修复 ehentai 和 EhSyringe 同时使用时标签介绍框出现双重滚动条的 bug ([bb53f0c](https://github.com/hymbz/ComicReadScript/commit/bb53f0c9e3e2874fe4318612b7ab5fef7167c822)), closes [/sleazyfork.org/zh-CN/scripts/374903/discussions/280978#comment-571248](https://sleazyfork.org/zh-CN/scripts/374903/discussions/280978/#comment-571248)
* :bug: 修复 nicomanga 失效的 bug ([1d760a1](https://github.com/hymbz/ComicReadScript/commit/1d760a11dc86f1a4a42ee271b1a6e761f8059daf)), closes [#220](https://github.com/hymbz/ComicReadScript/issues/220)
* :bug: 修复恢复阅读进度功能在双页卷轴模式下失效的 bug ([35c4b2c](https://github.com/hymbz/ComicReadScript/commit/35c4b2c3eef1d3ce2639d51be18fbc2860b502e2)), closes [/sleazyfork.org/zh-CN/scripts/374903/discussions/280978#comment-571248](https://sleazyfork.org/zh-CN/scripts/374903/discussions/280978/#comment-571248)

## [11.6.0](https://github.com/hymbz/ComicReadScript/compare/v11.5.0...v11.6.0) (2025-02-18)

### Features

* :sparkles: 限定 ehentai 漫画页右侧按钮框的高度 ([c6dcaf4](https://github.com/hymbz/ComicReadScript/commit/c6dcaf4d3acfd79e5cb708cc61ca80a2f2878aa9)), closes [/sleazyfork.org/zh-CN/scripts/374903/discussions/280978#comment-568074](https://sleazyfork.org/zh-CN/scripts/374903/discussions/280978/#comment-568074)
* :sparkles: ehentai 悬浮标签列表可以挪到显示区域外 ([fbd82af](https://github.com/hymbz/ComicReadScript/commit/fbd82af0d0e31b19b8cabfb25eb62167b03162f8)), closes [/sleazyfork.org/zh-CN/scripts/374903/discussions/280978#comment-568074](https://sleazyfork.org/zh-CN/scripts/374903/discussions/280978/#comment-568074)

### Bug Fixes

* :bug: 修复 ehentai 标签检查功能出现双重标签的 bug ([1f54947](https://github.com/hymbz/ComicReadScript/commit/1f54947ea14c8eda2c9f2f2c79cf69e06dabcbe3)), closes [/sleazyfork.org/zh-CN/scripts/374903/discussions/280978#comment-568074](https://sleazyfork.org/zh-CN/scripts/374903/discussions/280978/#comment-568074)
* :bug: 修复 ehentai 打开标签定义再点击「添加新标签」后无法关闭标签定义页的 bug ([2940a78](https://github.com/hymbz/ComicReadScript/commit/2940a78fbe02e07b02417acc51b34185033c5ff3)), closes [/sleazyfork.org/zh-CN/scripts/374903/discussions/280978#comment-568074](https://sleazyfork.org/zh-CN/scripts/374903/discussions/280978/#comment-568074)

## [11.5.0](https://github.com/hymbz/ComicReadScript/compare/v11.4.2...v11.5.0) (2025-02-13)

### Features

* :sparkles: 使用网页图标和标题显示下载进度 ([400b4ee](https://github.com/hymbz/ComicReadScript/commit/400b4ee9dd29b6d7f82abd48347ddb99c496b5c9))
* :sparkles: 增加 ehentai 标签检查功能对作者社团标签的检查 ([2847a01](https://github.com/hymbz/ComicReadScript/commit/2847a011c37571e96dc4f563b68e227bbf69f8cf))

### Bug Fixes

* :bug: 修复快捷键会区分大小写的 bug ([92283a4](https://github.com/hymbz/ComicReadScript/commit/92283a42ba8ee220e1c33ce2f7965751df23885b)), closes [/sleazyfork.org/zh-CN/scripts/374903/discussions/272526#comment-566245](https://sleazyfork.org/zh-CN/scripts/374903/discussions/272526/#comment-566245)

## [11.4.1](https://github.com/hymbz/ComicReadScript/compare/v11.4.0...v11.4.1) (2025-02-08)

### Bug Fixes

* :bug: 修复 ehentai 开启悬浮标签列表后无法点开标签菜单的 bug ([4b82b6d](https://github.com/hymbz/ComicReadScript/commit/4b82b6dbf1a1bd2343c5dfac2f0631315899c7df))
* :bug: 修复 hitomi 失效的 bug ([5314424](https://github.com/hymbz/ComicReadScript/commit/5314424043591fa008622675dbb03992f4d615d6))
* :bug: 修复网站开启翻译功能后无法通过 cloudflare 验证的 bug ([2de26b2](https://github.com/hymbz/ComicReadScript/commit/2de26b2781028511d0fec077e5507d2b21029fa2)), closes [#217](https://github.com/hymbz/ComicReadScript/issues/217)

## [11.4.0](https://github.com/hymbz/ComicReadScript/compare/v11.3.0...v11.4.0) (2025-02-06)

### Features

* :sparkles: 侧边栏增加「翻译当前页至结尾」功能按钮 ([788adcd](https://github.com/hymbz/ComicReadScript/commit/788adcd170aea21dc04e7650da9a0745e0c9d32e)), closes [#216](https://github.com/hymbz/ComicReadScript/issues/216)
* :sparkles: 结束页可以通过拖拽触发上/下一话 ([d04ce95](https://github.com/hymbz/ComicReadScript/commit/d04ce95a72e7335a8d631402b091831cb668caec))
* :sparkles: 增加「黑暗模式跟随系统自动切换」设置项 ([5e62ceb](https://github.com/hymbz/ComicReadScript/commit/5e62cebaf4e80d2fe92920876b16fe78a353dd5a)), closes [#214](https://github.com/hymbz/ComicReadScript/issues/214)

### Bug Fixes

* :bug: 修复 nhentai 收藏夹无限滚动失效的 bug ([6736599](https://github.com/hymbz/ComicReadScript/commit/6736599a2a4f017ed0180e8616b1a9044a8bf0d2))
* :bug: 修复在 Tachidesk 上未同步阅读进度的 bug ([1ba6d78](https://github.com/hymbz/ComicReadScript/commit/1ba6d781053770a28e56dd741ff0b7b48a660c55)), closes [#214](https://github.com/hymbz/ComicReadScript/issues/214)

## [11.3.0](https://github.com/hymbz/ComicReadScript/compare/v11.2.0...v11.3.0) (2025-02-04)


### Features

* :sparkles: 支持 Tachidesk ([822f617](https://github.com/hymbz/ComicReadScript/commit/822f6177e87451485e4b6654d8e537a119ac207e)), closes [#214](https://github.com/hymbz/ComicReadScript/issues/214)
* :sparkles: ehentai 范围加载功能将自动记住上次输入的范围文本 ([753221d](https://github.com/hymbz/ComicReadScript/commit/753221d51d6678e378b038aa116b13b0d9b4399a))


### Bug Fixes

* :bug: 修复会在 hitomi 视频页进入阅读模式的 bug ([15366b7](https://github.com/hymbz/ComicReadScript/commit/15366b74275f45b489ce2b5f5dadf15038168401))
* :bug: 修复简易模式在部分网站上加载不全图片的 bug ([75da1e9](https://github.com/hymbz/ComicReadScript/commit/75da1e9b5307af1401ee862d274bbc649625d5ea))
* :bug: 修复在 Safari 上简易模式会闪屏的 bug ([0ccf952](https://github.com/hymbz/ComicReadScript/commit/0ccf95225d57dcd052e0f496ac02fc23d96e086f))
* :bug: 修复在 Safari 上有时会触摸失效的 bug ([619a640](https://github.com/hymbz/ComicReadScript/commit/619a6404c19262e64b5680fd481880117433ea6c))

## [11.2.0](https://github.com/hymbz/ComicReadScript/compare/v11.1.1...v11.2.0) (2025-01-17)


### Features

* :sparkles: 记录50页以上漫画的阅读进度，在下次打开时自动跳转至上次阅读进度 ([dfc4ea3](https://github.com/hymbz/ComicReadScript/commit/dfc4ea31e1a2884f6b3236cd7cbde9d09881ccd6))
* :sparkles: 兼容旧版 manga-image-translator ([c50a1d0](https://github.com/hymbz/ComicReadScript/commit/c50a1d0123ab6c9ea441fe5613a7002fcea69921))


### Bug Fixes

* :bug: 修复 cotrans 翻译出错的 bug ([a07bd52](https://github.com/hymbz/ComicReadScript/commit/a07bd528c8887b0a786de7724d9a62a95f4b0784)), closes [#213](https://github.com/hymbz/ComicReadScript/issues/213)
* :bug: 修复 safari 浏览器上简易模式无法正常运行的 bug ([29cda77](https://github.com/hymbz/ComicReadScript/commit/29cda776bbfaaedf59f427e8f08ab991a2970637)), closes [/sleazyfork.org/zh-CN/scripts/374903/discussions/272526#comment-556399](https://sleazyfork.org/zh-CN/scripts/374903/discussions/272526/#comment-556399)

## [11.1.1](https://github.com/hymbz/ComicReadScript/compare/v11.1.0...v11.1.1) (2025-01-06)


### Bug Fixes

* :bug: 适配新版 manga-image-translator ([76995a0](https://github.com/hymbz/ComicReadScript/commit/76995a03fdaec544729ea64bf0027b65b5d928c5)), closes [#211](https://github.com/hymbz/ComicReadScript/issues/211)

## [11.1.0](https://github.com/hymbz/ComicReadScript/compare/v11.0.0...v11.1.0) (2024-12-27)


### Features

* :sparkles: 支持 コミックグロウル（comic-growl.com） ([ef3e7fb](https://github.com/hymbz/ComicReadScript/commit/ef3e7fbcf769e32963da3158e2c8b531c88f596a))

## [11.0.0](https://github.com/hymbz/ComicReadScript/compare/v10.11.0...v11.0.0) (2024-12-24)


### Features

* :sparkles: 增加全屏按钮 ([8cf5069](https://github.com/hymbz/ComicReadScript/commit/8cf5069b0a4ef0b7801087e39c03c908d03826a0)), closes [#209](https://github.com/hymbz/ComicReadScript/issues/209)
* :sparkles: 增加双页卷轴模式 ([4d8f03b](https://github.com/hymbz/ComicReadScript/commit/4d8f03b75d456546fcd8500a306bc320fe422b28))

## [10.11.0](https://github.com/hymbz/ComicReadScript/compare/v10.10.2...v10.11.0) (2024-12-19)


### Features

* :sparkles: 支持 NoyAcg ([9367d49](https://github.com/hymbz/ComicReadScript/commit/9367d49072e28852e15d2d63a92683a29155c2e6))


### Bug Fixes

* :bug: 修复放大后拖拽不跟手的 bug ([500afb6](https://github.com/hymbz/ComicReadScript/commit/500afb6188932194c5a13c7dd4e0b1720ccfe72b))
* :bug: 修复拷贝漫画解锁隐藏漫画不支持移动端的 bug ([9b0770a](https://github.com/hymbz/ComicReadScript/commit/9b0770ad56f35735bbd629c3a8f18c5710f9d98e))

## [10.10.2](https://github.com/hymbz/ComicReadScript/compare/v10.10.1...v10.10.2) (2024-12-16)


### Bug Fixes

* :bug: 修复部分手机浏览器在禁漫天堂等网站上无法正常显示图片的 bug ([357fbaf](https://github.com/hymbz/ComicReadScript/commit/357fbaf3468d11b3f7d64af666a6995ed96eaa8f)), closes [#205](https://github.com/hymbz/ComicReadScript/issues/205)

## [10.10.1](https://github.com/hymbz/ComicReadScript/compare/v10.10.0...v10.10.1) (2024-12-11)


### Features

* :sparkles: 增加自动隐藏鼠标的设置开关 ([e6748bc](https://github.com/hymbz/ComicReadScript/commit/e6748bc863e48adc787c1406c61e2c013c612821))


### Bug Fixes

* :bug: 修复 nhentai 图片无法加载的 bug ([761ae6f](https://github.com/hymbz/ComicReadScript/commit/761ae6feb8719a3baa60e4b31dfaa4aff9dee506))

## [10.10.0](https://github.com/hymbz/ComicReadScript/compare/v10.9.1...v10.10.0) (2024-12-03)


### Features

* :sparkles: 增加 ehentai 标签检查功能 ([7eaa07f](https://github.com/hymbz/ComicReadScript/commit/7eaa07fe936d262a9424b6d8d53f058788a44ff9))


### Bug Fixes

* :bug: 修复 ehentai 上与其他脚本冲突导致的显示异常 ([72e4c99](https://github.com/hymbz/ComicReadScript/commit/72e4c9906c4c7d0926d70540c282470ef9c97439))
* :bug: 修复拷贝漫画高清画质替换失效的 bug ([32f58a0](https://github.com/hymbz/ComicReadScript/commit/32f58a0ada25aa6ddf274f1c6a6ecf611b1a57ea))

## [10.9.1](https://github.com/hymbz/ComicReadScript/compare/v10.9.0...v10.9.1) (2024-11-23)


### Bug Fixes

* :bug: 修复 ehentai 识别广告页功能导致的加载异常 ([a892ca9](https://github.com/hymbz/ComicReadScript/commit/a892ca9ff209104d5f27537c6fb718cb89668fc5)), closes [#203](https://github.com/hymbz/ComicReadScript/issues/203)
* :bug: 修复 SchaleNetwork 部分漫画无法正常加载的 bug ([c67fca3](https://github.com/hymbz/ComicReadScript/commit/c67fca32c422ab0a9b0c9e0e4732d42f91e4660a))

## [10.9.0](https://github.com/hymbz/ComicReadScript/compare/v10.8.0...v10.9.0) (2024-11-20)


### Features

* :sparkles: 解锁拷贝漫画的隐藏漫画 ([5ef3fe9](https://github.com/hymbz/ComicReadScript/commit/5ef3fe9653ef646c1151062c195bc3687949a1e9)), closes [#202](https://github.com/hymbz/ComicReadScript/issues/202)


### Bug Fixes

* :bug: 支持 koharu 的新域名 SchaleNetwork ([86eb97c](https://github.com/hymbz/ComicReadScript/commit/86eb97c336189081280db79ff9d407d78b8e8e03)), closes [/sleazyfork.org/zh-CN/scripts/374903/discussions/212527#comment-546453](https://sleazyfork.org/zh-CN/scripts/374903/discussions/212527/#comment-546453)

## [10.8.0](https://github.com/hymbz/ComicReadScript/compare/v10.7.0...v10.8.0) (2024-11-20)


### Features

* :sparkles: 支持 MangaDex ([1aad74f](https://github.com/hymbz/ComicReadScript/commit/1aad74fc5c2660de578e22604ae598313dae3d3b))


### Bug Fixes

* :bug: 修复动漫之家隐藏漫画解锁功能失效的 bug ([6a0f787](https://github.com/hymbz/ComicReadScript/commit/6a0f787620e6c60f3f1dde4457dd9f328a02a985)), closes [#201](https://github.com/hymbz/ComicReadScript/issues/201)
* :bug: 修复修改翻译范围会导致所有图片重新翻译的 bug ([e1ea9ea](https://github.com/hymbz/ComicReadScript/commit/e1ea9ea7e481c162eacd0118e5c21ed044384938))

## [10.7.0](https://github.com/hymbz/ComicReadScript/compare/v10.6.0...v10.7.0) (2024-11-07)


### Features

* :sparkles: 使用更精细的文本格式设置翻译范围 ([b8f2dfa](https://github.com/hymbz/ComicReadScript/commit/b8f2dfae3927eb20fd17b8084d8ca11eebcbc343))


### Bug Fixes

* :bug: 修复拷贝漫画高清画质替换失效的 bug ([2a07e22](https://github.com/hymbz/ComicReadScript/commit/2a07e2286f1f2c81e473556ea540b7dae010a8e2))

## [10.6.0](https://github.com/hymbz/ComicReadScript/compare/v10.5.0...v10.6.0) (2024-10-28)


### Features

* :sparkles: 本地翻译支持指定页数范围 ([5acb04a](https://github.com/hymbz/ComicReadScript/commit/5acb04a2d99336afab1d783a85f891e9295dc378))
* :sparkles: ehentai 支持只加载指定页码范围的图片 ([4bb576f](https://github.com/hymbz/ComicReadScript/commit/4bb576f0e0b89e7b49367bd0c2320fbea7743a77))


### Bug Fixes

* :bug: 修复图片加载中打开 页面识别 相关功能会出错的 bug ([4f92e78](https://github.com/hymbz/ComicReadScript/commit/4f92e78add1c9675ae07509c3c28d1068a7d8847))
* :bug: 修复网格模式点击失效的 bug ([933c19d](https://github.com/hymbz/ComicReadScript/commit/933c19d92bd229b1649b06087a30eb2b97035acf))
* :bug: 修复下载文件名变为 zip.txt 的 bug ([df44d17](https://github.com/hymbz/ComicReadScript/commit/df44d1732201ac561cfab4698f5f7998b10b57aa))
* :bug: 修复简易阅读模式下上/下话切换功能失效的 bug ([1b6460c](https://github.com/hymbz/ComicReadScript/commit/1b6460c32d4445d27aca6bd53397ea419879e225))

## [10.5.0](https://github.com/hymbz/ComicReadScript/compare/v10.4.0...v10.5.0) (2024-10-25)


### Features

* :sparkles: 支持再漫画 ([a6d8320](https://github.com/hymbz/ComicReadScript/commit/a6d83200a623a75b1f309b2a4943d3c5e57a77be)), closes [#197](https://github.com/hymbz/ComicReadScript/issues/197)


### Bug Fixes

* :bug: 修复 ehentai 改版后失效的 bug ([e2ea67a](https://github.com/hymbz/ComicReadScript/commit/e2ea67a4ba66e0bde915fcbd0153848f80e73090)), closes [#198](https://github.com/hymbz/ComicReadScript/issues/198)

## [10.4.0](https://github.com/hymbz/ComicReadScript/compare/v10.3.0...v10.4.0) (2024-10-19)


### Features

* :sparkles: 简易阅读模式支持上/下一话切换 ([f6689b4](https://github.com/hymbz/ComicReadScript/commit/f6689b478ee9dbbe26c7ebc421d7faabfa68a69d))
* :sparkles: ehentai 标签染色功能同时会对列表页显示的标签进行排序 ([1b69ffb](https://github.com/hymbz/ComicReadScript/commit/1b69ffba0026af4ee07c2126225f84ec2900ebdd))


### Bug Fixes

* :bug: 修复 cotrans 翻译出错 ([78af6e9](https://github.com/hymbz/ComicReadScript/commit/78af6e918a5a556a3d1ed6c14f2e8096f562c061)), closes [#196](https://github.com/hymbz/ComicReadScript/issues/196)

## [10.3.0](https://github.com/hymbz/ComicReadScript/compare/v10.2.0...v10.3.0) (2024-10-05)


### Features

* :sparkles: 增加 ehentai My Tags 页标签排序功能 ([06c354a](https://github.com/hymbz/ComicReadScript/commit/06c354a3bacd5586c173b744d4a27ef3f0ae6aa6))


### Bug Fixes

* :bug: 修复在部分网站上简易模式无法翻译图片的 bug ([01211f3](https://github.com/hymbz/ComicReadScript/commit/01211f39ab77b34f51ca1c31d459da170b1ff613)), closes [#195](https://github.com/hymbz/ComicReadScript/issues/195)

## [10.2.0](https://github.com/hymbz/ComicReadScript/compare/v10.1.1...v10.2.0) (2024-10-04)


### Features

* :sparkles: 支持熱辣漫畫 ([5ce6b39](https://github.com/hymbz/ComicReadScript/commit/5ce6b3955d7b5f30c1f964ca49799a82ac028643))


### Bug Fixes

* :bug: 修复在部分网站上简易模式无法翻译图片的 bug ([546df2e](https://github.com/hymbz/ComicReadScript/commit/546df2e0e4b77da68e5f8bbdaca343da37846121)), closes [#195](https://github.com/hymbz/ComicReadScript/issues/195)
* :bug: 修复在部分网站上简易模式无法正常显示图片的 bug ([ae1db7e](https://github.com/hymbz/ComicReadScript/commit/ae1db7eee8a9532210f18583a7eea0143fa167ac))

## [10.1.1](https://github.com/hymbz/ComicReadScript/compare/v10.1.0...v10.1.1) (2024-10-01)


### Bug Fixes

* :bug: 修复触摸板需要双击才能翻页的 bug ([bdce356](https://github.com/hymbz/ComicReadScript/commit/bdce356098a1dc6db2d8d94bd8bca51833a2de28)), closes [#194](https://github.com/hymbz/ComicReadScript/issues/194)
* :bug: 修复关闭识别背景色功能后背景色未恢复原样的 bug ([1762c07](https://github.com/hymbz/ComicReadScript/commit/1762c0715527e51038bf08a43ac0491045fd0d78))
* :bug: 修复無限動漫失效的 bug ([ef188cb](https://github.com/hymbz/ComicReadScript/commit/ef188cba18270ce028fc282312c430ca74168ea6))


## [10.1.0](https://github.com/hymbz/ComicReadScript/compare/v10.0.0...v10.1.0) (2024-09-25)


### Features

* :sparkles: 增加「翻译全部图片」「翻译当前页至结尾」的快捷键 ([4b5391d](https://github.com/hymbz/ComicReadScript/commit/4b5391db6d5947f5755182c6cf1290d32035a361)), closes [#188](https://github.com/hymbz/ComicReadScript/issues/188)


### Bug Fixes

* :bug: 修复 yurifans 在线区失效的 bug ([8a7f6ea](https://github.com/hymbz/ComicReadScript/commit/8a7f6ea16f461c85cda5502757cd4238fb41fb64))
* :bug: 修复背景色识别结果异常的 bug ([8e9c240](https://github.com/hymbz/ComicReadScript/commit/8e9c2404fbd2a512d4d5542cc01d2e53a60f818c))
* :bug: 修复部分网站无法正常翻译的 bug ([fab1109](https://github.com/hymbz/ComicReadScript/commit/fab1109d173a5bdb817bfeb22c234daba2058907)), closes [#190](https://github.com/hymbz/ComicReadScript/issues/190)
* :bug: 修复無限動漫失效的 bug ([9dabfae](https://github.com/hymbz/ComicReadScript/commit/9dabfae5abf0768de7cd3ff4c72e991b7123f6d3))

## [9.8.0](https://github.com/hymbz/ComicReadScript/compare/v9.7.6...v9.8.0) (2024-09-23)


### Features

* :sparkles: 增加识别背景色功能 ([4ad8db0](https://github.com/hymbz/ComicReadScript/commit/4ad8db08a98098dc9e914b1eea50a076634de739))
* :sparkles: 实现自动调整页面填充功能 ([039b347](https://github.com/hymbz/ComicReadScript/commit/039b347498faf665fd86656a4a4589bab5e9021a))
* :sparkles: 增加锁定站点配置功能 ([cb4454e](https://github.com/hymbz/ComicReadScript/commit/cb4454e3f45b59efb1a34741d87de23e44161424))
* :sparkles: ehentai 增加自动调整阅读配置功能 ([629e8bc](https://github.com/hymbz/ComicReadScript/commit/629e8bc9fbb13b025cd607ffa562e30d1c8fc8f1))


### Bug Fixes

* :bug: 支持改版后的無限動漫 ([61965be](https://github.com/hymbz/ComicReadScript/commit/61965becffaa58031b33ada989accda6784efb89))

## [9.7.6](https://github.com/hymbz/ComicReadScript/compare/v9.7.5...v9.7.6) (2024-09-09)


### Bug Fixes

* :bug: 修复使用自部署翻译服务时目标语言配置失效的 bug ([1ad6dd1](https://github.com/hymbz/ComicReadScript/commit/1ad6dd1e9f47a56c962bfeb16babfbff4b784f86)), closes [#186](https://github.com/hymbz/ComicReadScript/issues/186)

## [9.7.5](https://github.com/hymbz/ComicReadScript/compare/v9.7.4...v9.7.5) (2024-09-08)


### Bug Fixes

* :bug: 修复自部署翻译的目标语言始终为中文的 bug ([95b0b86](https://github.com/hymbz/ComicReadScript/commit/95b0b86478746d6c32b6126d1da837340aabe9db)), closes [#186](https://github.com/hymbz/ComicReadScript/issues/186)

## [9.7.4](https://github.com/hymbz/ComicReadScript/compare/v9.7.3...v9.7.4) (2024-09-02)


### Bug Fixes

* :bug: 修复网格模式和并排卷轴模式下的显示错误 ([fb4ca14](https://github.com/hymbz/ComicReadScript/commit/fb4ca14b389d6e1899fc96139f7619c11d6f05b7))

## [9.7.3](https://github.com/hymbz/ComicReadScript/compare/v9.7.2...v9.7.3) (2024-08-31)


### Bug Fixes

* :bug: 修复部分网站下载漫画图片的扩展名错误 ([19a86fb](https://github.com/hymbz/ComicReadScript/commit/19a86fb744bd22ec77e9edf69c85d9936ae6fb49))
* :bug: 修复简易阅读模式在部分网站上未正常运行 ([ebfbe2c](https://github.com/hymbz/ComicReadScript/commit/ebfbe2c60d960098d999b9254db5f5c47315b454)), closes [#184](https://github.com/hymbz/ComicReadScript/issues/184)

## [9.7.2](https://github.com/hymbz/ComicReadScript/compare/v9.7.1...v9.7.2) (2024-08-23)


### Bug Fixes

* :bug: 修复部分网站无法下载漫画的 bug ([46b06a9](https://github.com/hymbz/ComicReadScript/commit/46b06a9617c1257a22ca7a3c256e5f74dba32702))

## [9.7.1](https://github.com/hymbz/ComicReadScript/compare/v9.7.0...v9.7.1) (2024-08-19)


### Bug Fixes

* :bug: 修复 kemono 自动进入阅读模式设置失效的 bug ([5c552a6](https://github.com/hymbz/ComicReadScript/commit/5c552a62e5c8dcca9f344bb28275b3b0053d9bb2)), closes [#181](https://github.com/hymbz/ComicReadScript/issues/181)

## [9.7.0](https://github.com/hymbz/ComicReadScript/compare/v9.6.3...v9.7.0) (2024-08-17)


### Features

* :sparkles: nhentai 增加识别广告页功能 ([977c9d0](https://github.com/hymbz/ComicReadScript/commit/977c9d06c761e6c9fc5d46d55bff4f8475af5fb7))


### Bug Fixes

* :bug: 修复 ehentai 与其他脚本的冲突 ([0940ff1](https://github.com/hymbz/ComicReadScript/commit/0940ff16df3e766884b7bbc146335d71cdf3fc68)), closes [#180](https://github.com/hymbz/ComicReadScript/issues/180)
* :bug: 修复部分网站上无法翻译的 bug ([53a7eb1](https://github.com/hymbz/ComicReadScript/commit/53a7eb15c0b40d66653dfff10c7da28a618f30dc))
* :bug: 修复部分网站下载图片的扩展名错误的 bug ([4c31fb5](https://github.com/hymbz/ComicReadScript/commit/4c31fb5039a1e9aab45876ad9abe340a6ae9840f))

## [9.6.3](https://github.com/hymbz/ComicReadScript/compare/v9.6.2...v9.6.3) (2024-08-13)


### Bug Fixes

* :bug: 修复简易阅读模式下的异常滚动 ([4aeb54d](https://github.com/hymbz/ComicReadScript/commit/4aeb54dee04f9bd07fc952246d669e95396b5ea2))

## [9.6.2](https://github.com/hymbz/ComicReadScript/compare/v9.6.1...v9.6.2) (2024-08-11)


### Bug Fixes

* :bug: 修复使用含中文的图片 url 时的加载异常 ([739e008](https://github.com/hymbz/ComicReadScript/commit/739e008e18f3ea2301e3af6f9192bd7285c57839))

## [9.6.1](https://github.com/hymbz/ComicReadScript/compare/v9.6.0...v9.6.1) (2024-08-09)


### Bug Fixes

* :bug: 修复简易阅读模式下的异常滚动 ([8dc4f04](https://github.com/hymbz/ComicReadScript/commit/8dc4f04792b149ce2db53df515709f60defe4091))

## [9.6.0](https://github.com/hymbz/ComicReadScript/compare/v9.5.0...v9.6.0) (2024-08-09)


### Features

* :sparkles: 实现 ehentai 悬浮标签列表功能 ([ad4dba7](https://github.com/hymbz/ComicReadScript/commit/ad4dba76a2fcd412844e17f27be30d84906cf501))


### Bug Fixes

* :bug: 修复简易阅读模式下未找到图片提示时机错误 ([4adeec3](https://github.com/hymbz/ComicReadScript/commit/4adeec346cb66582bfe45a352d77fd29ac4c7ee5))
* :bug: 修复缩放后无法拖拽移动的 bug ([bb6b9f0](https://github.com/hymbz/ComicReadScript/commit/bb6b9f0fe9825bed869bc5ea0f15f776dd080836)), closes [#177](https://github.com/hymbz/ComicReadScript/issues/177)

## [9.5.0](https://github.com/hymbz/ComicReadScript/compare/v9.4.3...v9.5.0) (2024-08-04)


### Features

* :sparkles: 将图片缩放比例作为设置项保存 ([a76863e](https://github.com/hymbz/ComicReadScript/commit/a76863ef56b0fe9f722efb706977a28caba36aa3)), closes [#177](https://github.com/hymbz/ComicReadScript/issues/177)


### Bug Fixes

* :bug: 修复并排卷轴模式下图片会过早消失的 bug ([cb6f513](https://github.com/hymbz/ComicReadScript/commit/cb6f5138a2a07edfe07a9a3d01d032b714a2e2a5))
* :bug: 修复在 Safari 上的图片显示变形 bug ([655a1d8](https://github.com/hymbz/ComicReadScript/commit/655a1d8a4c254d878941042dd33a7edb367a1189))

## [9.4.3](https://github.com/hymbz/ComicReadScript/compare/v9.4.2...v9.4.3) (2024-07-29)


### Bug Fixes

* :bug: 修复 ehentai 标签染色功能只对默认标签集生效的 bug ([1225fa0](https://github.com/hymbz/ComicReadScript/commit/1225fa008e72f1f1b6c9fc332d86a77dde67bf7d)), closes [#175](https://github.com/hymbz/ComicReadScript/issues/175)
* :bug: 修复 koharu 改版导致的报错 ([7e04bc1](https://github.com/hymbz/ComicReadScript/commit/7e04bc126976653c42082dcf85299df0cdb60db4))
* :bug: 修复根据屏幕比例自动切换单双页模式功能失效的 bug ([a064162](https://github.com/hymbz/ComicReadScript/commit/a064162a82d76c05374272715303426556d4600f))

## [9.4.2](https://github.com/hymbz/ComicReadScript/compare/v9.4.1...v9.4.2) (2024-07-27)


### Bug Fixes

* :bug: 修复缩放和拖动页面的动画消失的 bug ([8174934](https://github.com/hymbz/ComicReadScript/commit/817493413739729ffc22dd84f8e642b085f14a71))
* :bug: 修复在显示窗口不够宽时无法使用双页模式的 bug ([54729ad](https://github.com/hymbz/ComicReadScript/commit/54729ad7e9db94408e517e610ed361b8ad785d34)), closes [#174](https://github.com/hymbz/ComicReadScript/issues/174)

## [9.4.1](https://github.com/hymbz/ComicReadScript/compare/v9.4.0...v9.4.1) (2024-07-25)


### Bug Fixes

* :bug: 修复并排卷轴模式下图片会过早消失的 bug ([17fea28](https://github.com/hymbz/ComicReadScript/commit/17fea2833bc70c8883dcbddb5151132ef184a128)), closes [/sleazyfork.org/zh-CN/scripts/374903/discussions/252039#comment-516623](https://sleazyfork.org/zh-CN/scripts/374903/discussions/252039/#comment-516623)
* :bug: 修复放大功能异常 ([b0a98e7](https://github.com/hymbz/ComicReadScript/commit/b0a98e78ed4f2e9a4d30593a0a0162833f712791)), closes [#173](https://github.com/hymbz/ComicReadScript/issues/173)


## [9.4.0](https://github.com/hymbz/ComicReadScript/compare/v9.3.3...v9.4.0) (2024-07-21)


### Features

* :sparkles: 增加 ehentai 快捷查看标签定义功能 ([e25bd8c](https://github.com/hymbz/ComicReadScript/commit/e25bd8c742a97e82adf574a79b4864c6c7256475))
* :sparkles: 支持 Anchira 改版后的新网站 Koharu ([0df53d8](https://github.com/hymbz/ComicReadScript/commit/0df53d80fc017727a2c3d97880494926e02257cf))


### Bug Fixes

* :bug: 修复并排卷轴模式下点击侧边栏导致的显示错误 ([0c0e51b](https://github.com/hymbz/ComicReadScript/commit/0c0e51b5b86c2a5f9884bacf819b79819384cbfc))

## [9.3.3](https://github.com/hymbz/ComicReadScript/compare/v9.3.2...v9.3.3) (2024-07-15)


### Bug Fixes

* :bug: 修复 eh 画廊内翻页快捷键失效的 bug ([dbcdb53](https://github.com/hymbz/ComicReadScript/commit/dbcdb53380a85728a4eedbd5f3777ba8daec0fab))
* :bug: 修复 mangabz 缺少第一页图片的 bug ([1ae2322](https://github.com/hymbz/ComicReadScript/commit/1ae23226436989dd6b4c0512488096f588cc8494))

## [9.3.2](https://github.com/hymbz/ComicReadScript/compare/v9.3.1...v9.3.2) (2024-07-13)


### Bug Fixes

* :bug: 修复双页模式下预加载页数未正确生效的 bug ([3babbff](https://github.com/hymbz/ComicReadScript/commit/3babbff74332977a132341562f685a65a08e9638))
* :bug: 修复网格模式和卷轴模式互相切换时的显示错误 ([eeaa74d](https://github.com/hymbz/ComicReadScript/commit/eeaa74d8825d753786102af969558812c12b5ef8))

## [9.3.1](https://github.com/hymbz/ComicReadScript/compare/v9.3.0...v9.3.1) (2024-07-12)


### Bug Fixes

* :bug: 修复出现多余功能按钮的 bug ([27a1ba4](https://github.com/hymbz/ComicReadScript/commit/27a1ba486d10d4cc01f41255d4d40b484b86a79d)), closes [#172](https://github.com/hymbz/ComicReadScript/issues/172)
* :bug: 修复预加载页数未正确生效的 bug ([c9f4d8e](https://github.com/hymbz/ComicReadScript/commit/c9f4d8e9372f7b80514d94c574f9bda993df6068))

## [9.3.0](https://github.com/hymbz/ComicReadScript/compare/v9.2.0...v9.3.0) (2024-07-07)


### Features

* :sparkles: 增加 ehentai 标签染色功能 ([95ed709](https://github.com/hymbz/ComicReadScript/commit/95ed709bbf5d3f2198e102f9f9aaf29e8cca2e8f))
* :sparkles: 增加 ehentai 快捷评分功能 ([55889d2](https://github.com/hymbz/ComicReadScript/commit/55889d286d5886be5e0ba33cde5c9662fa12b6fc))


### Bug Fixes

* :bug: 修复 ehentai 无法正常加载图片的 bug ([f843e84](https://github.com/hymbz/ComicReadScript/commit/f843e842d6905f9eb80bbff18d3010ec7adca735))
* :bug: 修复在 safari 上图片加载完毕依然不显示的 bug ([510c524](https://github.com/hymbz/ComicReadScript/commit/510c5241706d438f111c65afd4861b4cc5b420fe)), closes [/sleazyfork.org/zh-CN/scripts/374903/discussions/249178#comment-512383](https://sleazyfork.org/zh-CN/scripts/374903/discussions/249178/#comment-512383)

## [9.2.0](https://github.com/hymbz/ComicReadScript/compare/v9.1.2...v9.2.0) (2024-07-04)


### Features

* :sparkles: 为 eh 的列表页加上快捷收藏 ([def90a7](https://github.com/hymbz/ComicReadScript/commit/def90a7344bf540921aa4c6b5801cadf66d08b70))


### Bug Fixes

* :bug: 修复网格模式在移动端上间隔过长的 bug ([933f65d](https://github.com/hymbz/ComicReadScript/commit/933f65dc741decd1b20a730b33e857387a049222))
* :bug: 修复显示填充页时无法翻译的 bug ([4bab5fa](https://github.com/hymbz/ComicReadScript/commit/4bab5fac7e78a7c2472d650ba0a1504c97b8612c))
* :bug: 修复移动端卷轴模式下的显示错误 ([c3dce0e](https://github.com/hymbz/ComicReadScript/commit/c3dce0e96808b0d3de9d0a9ff745868db2c83361))

## [9.1.2](https://github.com/hymbz/ComicReadScript/compare/v9.1.1...v9.1.2) (2024-07-02)


### Bug Fixes

* :bug: 修复 eh 切换标签页后已加载图片丢失的 bug ([f185c3c](https://github.com/hymbz/ComicReadScript/commit/f185c3cb01a3956d73b2861a586df4d4814cbe55))
* :bug: 修复卷轴模式下有时无法触发结束页的 bug ([d3dbc70](https://github.com/hymbz/ComicReadScript/commit/d3dbc70f9f2b4dc7ce3424121e2b0ba69dd417d4))

## [9.1.1](https://github.com/hymbz/ComicReadScript/compare/v9.1.0...v9.1.1) (2024-06-30)


### Bug Fixes

* :bug: 修复部分浏览器无法正常运行的 bug ([5d43378](https://github.com/hymbz/ComicReadScript/commit/5d43378dcc3354ffb477138b886649514d889f94))
* :bug: 修复部分浏览器在禁漫上无法加载图片的 bug ([cb24bf8](https://github.com/hymbz/ComicReadScript/commit/cb24bf85fc0030f06345601109c5e89a0f22a245))

## [9.1.0](https://github.com/hymbz/ComicReadScript/compare/v9.0.0...v9.1.0) (2024-06-28)


### Features

* :sparkles: 为 ehentai 增加快捷收藏功能 ([d011011](https://github.com/hymbz/ComicReadScript/commit/d0110113e3058b0b9c0fd1ab98b4eab84f3692e4))


### Bug Fixes

* :bug: 修复部分浏览器上看不到 nhentai 自动翻页的加载提示的 bug ([835c24f](https://github.com/hymbz/ComicReadScript/commit/835c24fdd78a58ba4723f23ab70e269846190d6c))
* :bug: 修复出错图片重试次数过多的 bug ([53a5ba5](https://github.com/hymbz/ComicReadScript/commit/53a5ba52115d8b04863b08eb92fff6f7378e8325))
* :bug: 修复使用 safari + stay 时在漫画柜、禁漫上无法正常运行的 bug ([a9a80ed](https://github.com/hymbz/ComicReadScript/commit/a9a80ed6fae83fdbe4560b0587a6909812a14b3b))
* :bug: 修复拖动滚动条时提示不够跟手的 bug ([e616554](https://github.com/hymbz/ComicReadScript/commit/e616554acc0f50af6571b16ca2595b3b6c29805c))

## [9.1.0](https://github.com/hymbz/ComicReadScript/compare/v8.10.6...v9.1.0) (2024-06-26)


### Features

* :sparkles: 实现并排卷轴模式 ([8cde2c3](https://github.com/hymbz/ComicReadScript/commit/8cde2c32b2850a58a395988d6d45c692dc1e5de6))

## [8.10.6](https://github.com/hymbz/ComicReadScript/compare/v8.10.5...v8.10.6) (2024-06-21)


### Bug Fixes

* :bug: 兼容 AdGuard ([157a296](https://github.com/hymbz/ComicReadScript/commit/157a29643096720c1e1a755d8bd35230ff925fca)), closes [#170](https://github.com/hymbz/ComicReadScript/issues/170)
* :bug: 修复在动漫之家隐藏漫画上无法显示结束页的 bug ([5869bd9](https://github.com/hymbz/ComicReadScript/commit/5869bd90b1886807e8cf14c827ce2353ba71bbf0))

## [8.10.5](https://github.com/hymbz/ComicReadScript/compare/v8.10.4...v8.10.5) (2024-06-14)


### Bug Fixes

* :bug: 修复 300 记录阅读进度功能在特定情况下失效的 bug ([9395c79](https://github.com/hymbz/ComicReadScript/commit/9395c79f718512d62b99ac60054c2ff2decc2037))

## [8.10.4](https://github.com/hymbz/ComicReadScript/compare/v8.10.3...v8.10.4) (2024-06-10)


### Bug Fixes

* :bug: 修复在 nicomanga 上失效的 bug ([20343c5](https://github.com/hymbz/ComicReadScript/commit/20343c541fd69c29e5053aff18204432ee675925))

## [8.10.3](https://github.com/hymbz/ComicReadScript/compare/v8.10.2...v8.10.3) (2024-06-07)


### Bug Fixes

* :bug: 修复部分浏览器翻页后的图片渲染错误 ([995315d](https://github.com/hymbz/ComicReadScript/commit/995315d97ad0fd6ede98b326b0a95e3889b19838)), closes [#169](https://github.com/hymbz/ComicReadScript/issues/169)
* :bug: 修复简易阅读模式在部分网站的图片排序错误 ([069c04e](https://github.com/hymbz/ComicReadScript/commit/069c04e5024d26e9da14d9333b5bb322003439ad))

## [8.10.2](https://github.com/hymbz/ComicReadScript/compare/v8.10.1...v8.10.2) (2024-05-24)


### Bug Fixes

* :bug: 修复在 ios 上 300 记录阅读进度功能失效的 bug ([3212bcc](https://github.com/hymbz/ComicReadScript/commit/3212bccac7259b84d69c5c79e79fd07b9fa5542d))
* :bug: 修复在 ios 上拷贝漫画无法正常工作的 bug ([3167d7d](https://github.com/hymbz/ComicReadScript/commit/3167d7d572a8ddb733f8aa5863ed8b60fdb0141a))

## [8.10.1](https://github.com/hymbz/ComicReadScript/compare/v8.10.0...v8.10.1) (2024-05-09)


### Bug Fixes

* :bug: 修复 dm5 有缺页和重复页的 bug ([eeb6398](https://github.com/hymbz/ComicReadScript/commit/eeb63987379e1173649919d308507046bc4952a6)), closes [#165](https://github.com/hymbz/ComicReadScript/issues/165)
* :bug: 修复 eh 默认缩略图下不会自动模糊显示广告页的 bug ([18e0b05](https://github.com/hymbz/ComicReadScript/commit/18e0b05496e941e6ba13cc7f9dcfe0136cb48c8a))
* :bug: 修复拷贝漫画加载缓慢的问题 ([cb73435](https://github.com/hymbz/ComicReadScript/commit/cb734353a9ae39f2f9c069a9bf0596ce9b45c300))
* :bug: 修复在 ios 上无法正常运行的 bug ([a3c7963](https://github.com/hymbz/ComicReadScript/commit/a3c796369106ef69a8fb5bdc7264c9945bb2ce13))

## [8.10.0](https://github.com/hymbz/ComicReadScript/compare/v8.9.0...v8.10.0) (2024-04-30)


### Features

* :sparkles: 支持 无限动漫 ([6dfd9ae](https://github.com/hymbz/ComicReadScript/commit/6dfd9aeea585a459ec52e90c25f0e7ce40398c19))
* :sparkles: 支持 新新漫画 ([2dbd0d8](https://github.com/hymbz/ComicReadScript/commit/2dbd0d8b5d93aed09214b7ad0910cc80a71e15a0))

## [8.9.0](https://github.com/hymbz/ComicReadScript/compare/v8.8.1...v8.9.0) (2024-04-15)


### Features

* :sparkles: kemono.su 新增是否加载原图的开关 ([0fc6ea9](https://github.com/hymbz/ComicReadScript/commit/0fc6ea98ff349b4931b22d8803c03d8a7e141d4d)), closes [#158](https://github.com/hymbz/ComicReadScript/issues/158)


### Bug Fixes

* :bug: 修复双页模式下两页图片中间有缝隙的 bug ([0e00e7b](https://github.com/hymbz/ComicReadScript/commit/0e00e7be57f90efe205ae6a265e4229424e7fbd2)), closes [8#pid64549617](https://github.com/hymbz/8/issues/pid64549617)

## [8.8.1](https://github.com/hymbz/ComicReadScript/compare/v8.8.0...v8.8.1) (2024-03-28)


### Bug Fixes

* :bug: 修复卷轴模式下偶尔滚动到底后无法触发结束页的 bug ([eff76e1](https://github.com/hymbz/ComicReadScript/commit/eff76e183d852e720e13135324dcf1e103e4a842))
* :bug: 修复阅读配置有时会变回初始配置的 bug ([f2ebb6e](https://github.com/hymbz/ComicReadScript/commit/f2ebb6e3df0bd8ae91b9e497adb8e9439f691811))

## [8.8.0](https://github.com/hymbz/ComicReadScript/compare/v8.7.4...v8.8.0) (2024-03-27)


### Features

* :sparkles: 支持 nekohouse ([5353953](https://github.com/hymbz/ComicReadScript/commit/5353953805af608f673bb2370d73c8fd10834f70))


### Bug Fixes

* :bug: 修复部分网站下载的漫画文件后辍异常的 bug ([2453f04](https://github.com/hymbz/ComicReadScript/commit/2453f043181cbacae0b41e88e084953ed36579e9)), closes [#155](https://github.com/hymbz/ComicReadScript/issues/155)
* :bug: 修复在禁漫上使用时会提示「漫画加载出错」的 bug ([5c16cb9](https://github.com/hymbz/ComicReadScript/commit/5c16cb9b57507243f922353ff104a18b459b9346))

## [8.7.4](https://github.com/hymbz/ComicReadScript/compare/v8.7.3...v8.7.4) (2024-03-17)


### Bug Fixes

* :bug: 修复在 kemono 上没有记住阅读配置的 bug ([5d14216](https://github.com/hymbz/ComicReadScript/commit/5d142162f681a4eb3e8e42fc0ea01509f91dca57)), closes [#153](https://github.com/hymbz/ComicReadScript/issues/153)

## [8.7.3](https://github.com/hymbz/ComicReadScript/compare/v8.7.2...v8.7.3) (2024-03-09)


### Bug Fixes

* :bug: 修复简易模式下图片未正确加载的 bug ([2efed4f](https://github.com/hymbz/ComicReadScript/commit/2efed4f847eb9f34f861bf507cf9117be6b2d3ed)), closes [/sleazyfork.org/zh-CN/scripts/374903-comicread/discussions/212387#comment-481215](https://sleazyfork.org/zh-CN/scripts/374903-comicread/discussions/212387/#comment-481215)
* :bug: 增加拷贝漫画的支持域名 ([9f0a7fc](https://github.com/hymbz/ComicReadScript/commit/9f0a7fcb923af69ceffe703ddba8e180b81c3989))


### Performance Improvements

* 优化 eh 识别广告的成功率 ([1fab3b8](https://github.com/hymbz/ComicReadScript/commit/1fab3b84a22bd1e846eefa59f88dc3270db2a733))
* 增加「只下载完成翻译的图片」选项 ([8c6df39](https://github.com/hymbz/ComicReadScript/commit/8c6df39e287362c6f6e5b1b95abb2a3acceebede))

## [8.7.2](https://github.com/hymbz/ComicReadScript/compare/v8.7.1...v8.7.2) (2024-02-11)


### Bug Fixes

* :bug: 修复在 copymanga 上的部分漫画无法正常运行的 bug ([9019ef2](https://github.com/hymbz/ComicReadScript/commit/9019ef2623fa078bfc4aa947db318d392dcdd380)), closes [#149](https://github.com/hymbz/ComicReadScript/issues/149)

## [8.7.1](https://github.com/hymbz/ComicReadScript/compare/v8.7.0...v8.7.1) (2024-02-06)


### Bug Fixes

* :bug: 修复在卷轴模式下开启图片适合宽度后的异常滚动 ([9c1c7ed](https://github.com/hymbz/ComicReadScript/commit/9c1c7ed70b2424e99f20ee7eae766857142a24f8)), closes [#147](https://github.com/hymbz/ComicReadScript/issues/147)
* :bug: 支持漫画柜的移动端 ([ba1142c](https://github.com/hymbz/ComicReadScript/commit/ba1142cd9842bdd981bb10b30507c103928f73c6)), closes [#148](https://github.com/hymbz/ComicReadScript/issues/148)
* :bug: 支持漫画人和极速漫画的移动端 ([84c2141](https://github.com/hymbz/ComicReadScript/commit/84c214113e06376b8abc651bc5e32059f851e6b9)), closes [#148](https://github.com/hymbz/ComicReadScript/issues/148)

## [8.7.0](https://github.com/hymbz/ComicReadScript/compare/v8.6.0...v8.7.0) (2024-02-04)


### Features

* :sparkles: 实现卷轴模式下的适合宽度缩放 ([86bdb1c](https://github.com/hymbz/ComicReadScript/commit/86bdb1c8b52c78a4c63cd06dfa079d5fe409f89f)), closes [#142](https://github.com/hymbz/ComicReadScript/issues/142)


### Bug Fixes

* :bug: 修复 mangabz 在移动端上无法正常加载的 bug ([5051990](https://github.com/hymbz/ComicReadScript/commit/5051990834a4a22ca73aa7cd5b30f67605bbbea8)), closes [#145](https://github.com/hymbz/ComicReadScript/issues/145)


### Performance Improvements

* 将结束页上/下一话按钮的位置调整为和点击翻页的左右区域一致 ([0209c36](https://github.com/hymbz/ComicReadScript/commit/0209c36f420368bfd8522353f0ebc742995677e7))

## [8.6.0](https://github.com/hymbz/ComicReadScript/compare/v8.5.4...v8.6.0) (2024-02-01)


### Features

* :sparkles: 在卷轴模式下使用鼠标拖拽滚动页面 ([8770ea7](https://github.com/hymbz/ComicReadScript/commit/8770ea79e4c5f2ef44de872d289e1258c3e3155a))
* :sparkles: 支持 Anchira ([3c5aa5c](https://github.com/hymbz/ComicReadScript/commit/3c5aa5cb5941ce2abb92aa8d88343fb4aa602aa5))

## [8.5.4](https://github.com/hymbz/ComicReadScript/compare/v8.5.3...v8.5.4) (2024-01-31)


### Bug Fixes

* :bug: 修复切换页面填充会导致图片重新加载的 bug ([a3795fe](https://github.com/hymbz/ComicReadScript/commit/a3795fe44683c4969fc85d00f0344aa7ee97fa61))
* :bug: 修复使用触摸板在卷轴模式下滚动后会再异常滚动一截的 bug ([d5ff635](https://github.com/hymbz/ComicReadScript/commit/d5ff635ad90d2d0b0c5b5b62ab9adbc98c848afc)), closes [#142](https://github.com/hymbz/ComicReadScript/issues/142)

## [8.5.3](https://github.com/hymbz/ComicReadScript/compare/v8.5.2...v8.5.3) (2024-01-22)


### Bug Fixes

* :bug: 修复会在网页加载过慢时关闭简易模式的 bug ([e0b2db7](https://github.com/hymbz/ComicReadScript/commit/e0b2db7dee72a3191f5477ed0aca16ac6dcc40bf))

## [8.5.2](https://github.com/hymbz/ComicReadScript/compare/v8.5.1...v8.5.2) (2024-01-22)


### Bug Fixes

* :bug: 修复部分网站简易模式失效的 bug ([f67f26a](https://github.com/hymbz/ComicReadScript/commit/f67f26a93235d40e1bde500bc1a9327a9ba1ccf1))


### Performance Improvements

* 减少 ehentai 广告误杀率 ([11ac7b2](https://github.com/hymbz/ComicReadScript/commit/11ac7b2e1fd882c4a332432a7833596d67e64059))

## [8.5.1](https://github.com/hymbz/ComicReadScript/compare/v8.5.0...v8.5.1) (2024-01-21)


### Bug Fixes

* :bug: 修复卷轴模式下翻页快捷键失效的 bug ([bde4eab](https://github.com/hymbz/ComicReadScript/commit/bde4eab077940df630fb3b59723c75b7c953b14e))


### Performance Improvements

* 增强 ehentai 识别广告页的能力 ([2a8033c](https://github.com/hymbz/ComicReadScript/commit/2a8033c3bc43712dabac9b29e2d11189dd3e9df6))

## [8.5.0](https://github.com/hymbz/ComicReadScript/compare/v8.4.3...v8.5.0) (2024-01-19)


### Features

* :sparkles: 在 ehentai 上自动识别并排除广告页 ([4deb2c8](https://github.com/hymbz/ComicReadScript/commit/4deb2c85031f2896ef902a61137d93cdb7985e79))


### Bug Fixes

* :bug: 修复简易模式下部分条漫因为图切太碎而未正确加载的 bug ([25b3cf5](https://github.com/hymbz/ComicReadScript/commit/25b3cf5a238d0260a205d1af799abf60fca69c8e))
* :bug: 修复简易模式在部分网站上未正确识别漫画页的 bug ([9faa2ac](https://github.com/hymbz/ComicReadScript/commit/9faa2accc42033d3ee5e19e59b4bde1f1a2dc724))
* :bug: 支持拷贝漫画新网址 ([1b9a963](https://github.com/hymbz/ComicReadScript/commit/1b9a9635a08c8082d87630425e2d32c8339b91b2))

## [8.4.3](https://github.com/hymbz/ComicReadScript/compare/v8.4.2...v8.4.3) (2024-01-13)


### Bug Fixes

* :bug: 修复与 ios 油猴扩展的兼容性问题 ([1f76f64](https://github.com/hymbz/ComicReadScript/commit/1f76f64c23657f46859c79736eb3b572ef5b7f4e)), closes [#136](https://github.com/hymbz/ComicReadScript/issues/136)

## [8.4.2](https://github.com/hymbz/ComicReadScript/compare/v8.4.1...v8.4.2) (2024-01-12)


### Bug Fixes

* :bug: 修复与 ios 油猴扩展的兼容性问题 ([ef115ae](https://github.com/hymbz/ComicReadScript/commit/ef115ae56f2434568690bd64c81d6e743a14d689)), closes [#136](https://github.com/hymbz/ComicReadScript/issues/136)

## [8.4.1](https://github.com/hymbz/ComicReadScript/compare/v8.4.0...v8.4.1) (2024-01-02)


### Bug Fixes

* :bug: 修复滚动条在特定情况下的显示异常 ([1995d35](https://github.com/hymbz/ComicReadScript/commit/1995d35b7a9974e2117aca8b19ecec2b1bd499d4))
* :bug: 修复缩放后无法拖拽的 bug ([0395bb1](https://github.com/hymbz/ComicReadScript/commit/0395bb144c718c9e17661ff9b69481560614e570))


### Performance Improvements

* 移动端默认翻页区域改为左右布局 ([665826f](https://github.com/hymbz/ComicReadScript/commit/665826f434f4b4f18900a1ad17ba964868b0c0a0))

## [8.4.0](https://github.com/hymbz/ComicReadScript/compare/v8.3.0...v8.4.0) (2023-12-31)


### Features

* :sparkles: 支持 Yurifans ([5d6ea1b](https://github.com/hymbz/ComicReadScript/commit/5d6ea1ba9bdc8a17958ef57975c68b8628016805))
* :sparkles: 在拷贝漫画的目录页上显示上次阅读记录 ([dbe0d44](https://github.com/hymbz/ComicReadScript/commit/dbe0d44269c0167c3fc2b723db583c5c45e86e76))


### Performance Improvements

* 在连续出现多张跨页宽图时，自动将滚动条移至底部，避免被漫画图片干扰看不清 ([fa4ecbf](https://github.com/hymbz/ComicReadScript/commit/fa4ecbf3b2f9b6ca8c658968389ca4a56074b5c5))

## [8.3.0](https://github.com/hymbz/ComicReadScript/compare/v8.2.11...v8.3.0) (2023-12-22)


### Features

* :sparkles: 在 kemono 上为漫画压缩包提供跳转到 ComicReadPWA 的快捷按钮 ([ef4d693](https://github.com/hymbz/ComicReadScript/commit/ef4d69321bedf2cdccd389e069e80992fd9f24af)), closes [#131](https://github.com/hymbz/ComicReadScript/issues/131)


### Bug Fixes

* :bug: 改用 npmmirror CDN，避免因网络问题无法安装脚本 ([2bbd2ff](https://github.com/hymbz/ComicReadScript/commit/2bbd2ff68ae53c3487e82e36dcf58199ad43506f)), closes [#131](https://github.com/hymbz/ComicReadScript/issues/131)
* :bug: 修复触摸板首次滚动异常的 bug ([2473935](https://github.com/hymbz/ComicReadScript/commit/247393596cad344c306ef4ec8e4dad2029c704e4))

## [8.2.11](https://github.com/hymbz/ComicReadScript/compare/v8.2.10...v8.2.11) (2023-12-20)


### Bug Fixes

* :bug: 修复 kemono 改版后脚本失效的 bug ([1be4437](https://github.com/hymbz/ComicReadScript/commit/1be44374567af25077366ab419de32bbbb32210d))

## [8.2.10](https://github.com/hymbz/ComicReadScript/compare/v8.2.9...v8.2.10) (2023-12-19)


### Bug Fixes

* :bug: 修复使用触摸板滚动时偶尔会出现页面闪烁的 bug ([b4fa984](https://github.com/hymbz/ComicReadScript/commit/b4fa984e8714f47455867f0aa2229989db5c07bf))
* :bug: 修复使用鼠标滚轮快速滚动后滚轮失效的 bug ([af0763e](https://github.com/hymbz/ComicReadScript/commit/af0763ee0f84aed1189d0b1e83b0b81a973a77ea))

## [8.2.9](https://github.com/hymbz/ComicReadScript/compare/v8.2.8...v8.2.9) (2023-12-18)


### Performance Improvements

* 优化使用触摸板进行滚动的体验 ([18f2584](https://github.com/hymbz/ComicReadScript/commit/18f2584ca43ba314c333631d922f3762006ea250))

## [8.2.8](https://github.com/hymbz/ComicReadScript/compare/v8.2.7...v8.2.8) (2023-12-16)


### Bug Fixes

* :bug: 修复部分情况下会自动切换至单页模式的 bug ([eeda07f](https://github.com/hymbz/ComicReadScript/commit/eeda07f4e8f5313bcea1bab97349a575966ed12b))
* :bug: 修复在禁漫上无法正常工作的 bug ([75800e7](https://github.com/hymbz/ComicReadScript/commit/75800e7792252e6313d85117935a61856b7c42d3))

## [8.2.7](https://github.com/hymbz/ComicReadScript/compare/v8.2.6...v8.2.7) (2023-12-15)


### Bug Fixes

* :bug: 修复 komiic 因改版导致无法正常运行的 bug ([74c6903](https://github.com/hymbz/ComicReadScript/commit/74c6903c4642d8ecadf7e1e2992edb2732f34287))
* :bug: 修复 PonpomuYuri 上/下一话跳转异常的 bug ([aeb2554](https://github.com/hymbz/ComicReadScript/commit/aeb2554f5b7e55a1d07e365d5a401af08669db9b))
* :bug: 修复在 ehentai 上超过一定时间后就无法加载图片的 bug ([c5f8dae](https://github.com/hymbz/ComicReadScript/commit/c5f8daeb2cf08a76c3bfb4951af1b295f45990c1))


### Performance Improvements

* 优化使用触摸板进行滚动的体验 ([141612a](https://github.com/hymbz/ComicReadScript/commit/141612a5198420b1c244c7116f953a25a98fe4a1))

## [8.2.6](https://github.com/hymbz/ComicReadScript/compare/v8.2.5...v8.2.6) (2023-12-06)


### Bug Fixes

* :bug: 修复漫画柜上无法正常运行的 bug ([3f92bbd](https://github.com/hymbz/ComicReadScript/commit/3f92bbd78a5649f917c9209d2492b83f30d2eac7))

## [8.2.5](https://github.com/hymbz/ComicReadScript/compare/v8.2.4...v8.2.5) (2023-12-02)


### Bug Fixes

* :bug: 修复百合会移动端部分漫画获取图片失败的 bug ([0ea3e4b](https://github.com/hymbz/ComicReadScript/commit/0ea3e4b5842e975b50647a4e6766cc64fe43eab2))
* :bug: 修复部分情况下界面未覆盖全屏的 bug ([82d20ee](https://github.com/hymbz/ComicReadScript/commit/82d20eeadab80a1de52225d4d2583433bc272fe5))
* :bug: 修复移动端拖拽翻页效果异常的 bug ([a81203f](https://github.com/hymbz/ComicReadScript/commit/a81203f86eb52c39cb63753ba7e24fc09d662984))

## [8.2.4](https://github.com/hymbz/ComicReadScript/compare/v8.2.3...v8.2.4) (2023-11-26)


### Bug Fixes

* :bug: 修复部分浏览器上会出现大部分图片都加载出错的情况 ([6b193b8](https://github.com/hymbz/ComicReadScript/commit/6b193b8a06b2e72a535590e8619aa3487370ddff))

## [8.2.3](https://github.com/hymbz/ComicReadScript/compare/v8.2.2...v8.2.3) (2023-11-26)


### Bug Fixes

* :bug: 修复在图片加载前就显示加载出错的 bug ([24be5a9](https://github.com/hymbz/ComicReadScript/commit/24be5a90b55d7f86eb3516e23b030d54ad718f4d))

## [8.2.2](https://github.com/hymbz/ComicReadScript/compare/v8.2.1...v8.2.2) (2023-11-24)


### Bug Fixes

* :bug: 修复在某些情况下简易模式无法正常加载所有图片的 bug ([d519313](https://github.com/hymbz/ComicReadScript/commit/d51931333b1688bf38ed036372fdf817f0b56112))

## [8.2.1](https://github.com/hymbz/ComicReadScript/compare/v8.2.0...v8.2.1) (2023-11-22)


### Bug Fixes

* :bug: 修复百合会 记录阅读进度 功能会在某些楼层失效的 bug ([fffd64f](https://github.com/hymbz/ComicReadScript/commit/fffd64ff00fa71fb318c1be7df04454928e46663))
* :bug: 修复卷轴模式下上下翻页快捷键无法触发结束动作的 bug ([3c3afaa](https://github.com/hymbz/ComicReadScript/commit/3c3afaafac9f69b2d9d04a3e43caffb1f00509d5))
* :bug: 修复图片单双页判断错误的 bug ([5bcd0bd](https://github.com/hymbz/ComicReadScript/commit/5bcd0bd8ed4e8faa1be0f771e3dec74d9293ecbb))

## [8.2.0](https://github.com/hymbz/ComicReadScript/compare/v8.1.1...v8.2.0) (2023-11-22)


### Features

* :sparkles: 实现使用上下翻页快捷键在卷轴模式下滚动 ([a73623d](https://github.com/hymbz/ComicReadScript/commit/a73623dc70187489b79d14bc88dca1ab1836c238))


### Bug Fixes

* :bug: 修复泰拉记事社上/下话翻页失效的 bug ([c669769](https://github.com/hymbz/ComicReadScript/commit/c669769877d3b6fb5a627452a79e8792e58027b8))
* :bug: 修复滚动条提示会超出屏幕范围的 bug ([42f9693](https://github.com/hymbz/ComicReadScript/commit/42f96937f6ae14ede9ede464f9241ae697dd120d))
* :bug: 修复卷轴模式下滚动条图片色块长度异常的 bug ([b1870fd](https://github.com/hymbz/ComicReadScript/commit/b1870fd47c99c6df3844dfc11e2fe8ddedd781d9))
* :bug: 修复卷轴模式下缩放后无法滚动页面的 bug ([88d64bc](https://github.com/hymbz/ComicReadScript/commit/88d64bc8f65c41e9a360ca2402a1ce663302b354))
* :bug: 修复在某些情况下简易模式无法正常加载所有图片的 bug ([df6f9cb](https://github.com/hymbz/ComicReadScript/commit/df6f9cb90e0fa504ecb054134c9178fa8da5ec2e))

## [8.1.1](https://github.com/hymbz/ComicReadScript/compare/v8.1.0...v8.1.1) (2023-11-20)


### Bug Fixes

* :bug: 修复放大后无法调出菜单的 bug ([fde7493](https://github.com/hymbz/ComicReadScript/commit/fde7493cc55277925fb21e93977d28371d2148f0))
* :bug: 修复卷轴模式下缩放后无法正常拖动的 bug ([d6cf084](https://github.com/hymbz/ComicReadScript/commit/d6cf084de580b6d5a1542486169e65cee804a32d))


### Performance Improvements

* :zap: 优化简易模式加载速度 ([bbb1b31](https://github.com/hymbz/ComicReadScript/commit/bbb1b316b8c0d571641af28b96025fdf0962a8d4))
* 在简易模式下提前预测页数 ([a9e7d6d](https://github.com/hymbz/ComicReadScript/commit/a9e7d6ded3dc0cfca4405023b8fb896288272f84))

## [8.1.0](https://github.com/hymbz/ComicReadScript/compare/v8.0.0...v8.1.0) (2023-11-17)


### Features

* :sparkles: 实现自定义滚动条位置 ([f64d70f](https://github.com/hymbz/ComicReadScript/commit/f64d70f42fa0f16d2deee38e3df70d6119333aa4))


### Bug Fixes

* :bug: 修复 300 帖子阅读进度不显示的 bug ([430591d](https://github.com/hymbz/ComicReadScript/commit/430591d0c903f518622795ddad5c0703d60a93a2))
* :bug: 修复卷轴模式下的一系列 bug ([4ae5ce8](https://github.com/hymbz/ComicReadScript/commit/4ae5ce8397236a006df64cd630c7c68ee55e8ddf))
* :bug: 修复已翻译图片未正确下载的 bug ([948f8bd](https://github.com/hymbz/ComicReadScript/commit/948f8bd1c90aa77ca983501a3abba02a73562149)), closes [#119](https://github.com/hymbz/ComicReadScript/issues/119)

## [8.0.0](https://github.com/hymbz/ComicReadScript/compare/v7.6.0...v8.0.0) (2023-11-14)


### Features

* :sparkles: 实现滑动翻页 ([9976b2f](https://github.com/hymbz/ComicReadScript/commit/9976b2fd2e94648084b54ac11f6e1da2db6ed093))
* :sparkles: 实现网格模式 ([86a4c60](https://github.com/hymbz/ComicReadScript/commit/86a4c60a767f831005bc7d003bd7c2d86e6f23a7))
* :sparkles: 增加 翻译当前页至结尾 选项 ([f714a5f](https://github.com/hymbz/ComicReadScript/commit/f714a5fcf0519fff7924a0312b0b99bd9d254ebc))
* :sparkles: 增加多种点击区域排列 ([30c9fcb](https://github.com/hymbz/ComicReadScript/commit/30c9fcb6cd6c38cd13d3d8705c9a5352d74ce06d))


### Bug Fixes

* :bug: 修复拷贝漫画因为 api 域名被墙而无法正常工作的 bug ([1213458](https://github.com/hymbz/ComicReadScript/commit/1213458ae794f9c8aa28b8346b78fd5e5aa1dfda))
* :bug: 修复移动端点击滚动条后一直显示着页数的 bug ([de330c4](https://github.com/hymbz/ComicReadScript/commit/de330c4d6cc1e4f1ceae0930ad8ea8c954212965))

## [7.6.0](https://github.com/hymbz/ComicReadScript/compare/v7.5.4...v7.6.0) (2023-11-02)


### Features

* :sparkles: 移动端下改用顶部滚动条 ([4561f62](https://github.com/hymbz/ComicReadScript/commit/4561f62ec0a7ee5a2190392f612d148956d92bb4))
* :sparkles: 增加 卷轴模式下的图片间距 配置 ([651c238](https://github.com/hymbz/ComicReadScript/commit/651c2383d537208de72a8895842485fde709f80d))


### Bug Fixes

* :bug: 修复移动端放大后无法翻页的 bug ([c353fd6](https://github.com/hymbz/ComicReadScript/commit/c353fd618c2a6c5878bb758b6512a3990678dfb9))
* :bug: 修复在 ehentai 多页查看器上未正常工作的 bug ([0f3cdc2](https://github.com/hymbz/ComicReadScript/commit/0f3cdc2a73b58086fece089e6de11aca461c91f4))

## [7.5.4](https://github.com/hymbz/ComicReadScript/compare/v7.5.3...v7.5.4) (2023-10-29)


### Bug Fixes

* :bug: 修复百合会移动端偶尔会报错的 bug ([042275c](https://github.com/hymbz/ComicReadScript/commit/042275cf450c61f445ace6afa411f575f7a7bd40))

## [7.5.3](https://github.com/hymbz/ComicReadScript/compare/v7.5.2...v7.5.3) (2023-10-28)


### Bug Fixes

* :bug: 修复 ehentai 改版导致的标签点击 bug ([eaa2d94](https://github.com/hymbz/ComicReadScript/commit/eaa2d9452016332edd92b493fed6f6373a165f1b))

## [7.5.2](https://github.com/hymbz/ComicReadScript/compare/v7.5.1...v7.5.2) (2023-10-27)


### Bug Fixes

* :bug: 更新禁漫天堂的支持站点 ([07723fc](https://github.com/hymbz/ComicReadScript/commit/07723fcad4bdc5edbae3f951e5b2816a1c9d2e32))

## [7.5.1](https://github.com/hymbz/ComicReadScript/compare/v7.5.0...v7.5.1) (2023-10-18)


### Performance Improvements

* 将快捷滚动限定为只在卷轴模式下生效 ([e2baf70](https://github.com/hymbz/ComicReadScript/commit/e2baf70ec719abf2d367d1d84714c48486066d7d))

## [7.5.0](https://github.com/hymbz/ComicReadScript/compare/v7.4.2...v7.5.0) (2023-10-15)


### Features

* :sparkles: 增加快捷滚动功能 ([b1f3d42](https://github.com/hymbz/ComicReadScript/commit/b1f3d4261a791ed27020a0b48589379f776c322f))


### Performance Improvements

* 增加卷轴模式下的图片缩放比例设置项 ([933f613](https://github.com/hymbz/ComicReadScript/commit/933f6138640ec0227d4cf2fd71aabd30b199c4a5))

## [7.4.2](https://github.com/hymbz/ComicReadScript/compare/v7.4.1...v7.4.2) (2023-10-12)


### Bug Fixes

* :bug: 修复会在支持站点误启用简易模式的 bug ([5721505](https://github.com/hymbz/ComicReadScript/commit/5721505e3bc000e0e04867187db7aa2145057e76))
* :bug: 修复启用简易模式后无法取消记忆当前站点的 bug ([7d49901](https://github.com/hymbz/ComicReadScript/commit/7d499016cdb69c4f7d62f7f9f58989c3b1953626))

## [7.4.1](https://github.com/hymbz/ComicReadScript/compare/v7.4.0...v7.4.1) (2023-10-10)


### Bug Fixes

* :bug: 修复在非漫画页弹窗报错的 bug ([d47a00e](https://github.com/hymbz/ComicReadScript/commit/d47a00ef7f6cbc11bfc93c5d805fca0c180bccbb))

## [7.4.0](https://github.com/hymbz/ComicReadScript/compare/v7.3.1...v7.4.0) (2023-10-09)


### Features

* :sparkles: 支持移动版百合会 ([9e8c3db](https://github.com/hymbz/ComicReadScript/commit/9e8c3dbf45ebaaf9fe955c32b71bf6becf5dc3e7)), closes [#111](https://github.com/hymbz/ComicReadScript/issues/111)

## [7.3.1](https://github.com/hymbz/ComicReadScript/compare/v7.3.0...v7.3.1) (2023-10-05)


### Bug Fixes

* :bug: 更新禁漫天堂的网址 ([824386a](https://github.com/hymbz/ComicReadScript/commit/824386a3b288511dc01754fe988f4fa479c4b0c9))

## [7.3.0](https://github.com/hymbz/ComicReadScript/compare/v7.2.0...v7.3.0) (2023-10-04)


### Features

* :sparkles: 增加简易模式触发图片加载的方式以适配更多情况 ([c9b2d68](https://github.com/hymbz/ComicReadScript/commit/c9b2d682a5ad9f516ec6c51dcdc7ec2b73db15a4)), closes [#109](https://github.com/hymbz/ComicReadScript/issues/109)

## [7.2.0](https://github.com/hymbz/ComicReadScript/compare/v7.1.5...v7.2.0) (2023-10-04)


### Features

* :sparkles: 增加简易模式触发图片加载的方式以适配更多情况 ([2bb2133](https://github.com/hymbz/ComicReadScript/commit/2bb2133dd3f7d27e5d0629a393e3106a8b3b32d1)), closes [#109](https://github.com/hymbz/ComicReadScript/issues/109)


### Bug Fixes

* :bug: 修复部分网站下载的漫画文件后辍异常的 bug ([35ba45b](https://github.com/hymbz/ComicReadScript/commit/35ba45ba96016c2ca02bd1b0abe08a3bf0d3a64d)), closes [#110](https://github.com/hymbz/ComicReadScript/issues/110)

## [7.1.5](https://github.com/hymbz/ComicReadScript/compare/v7.1.4...v7.1.5) (2023-09-30)


### Bug Fixes

* :bug: 修复手机上卷轴模式的显示异常 ([ed233f0](https://github.com/hymbz/ComicReadScript/commit/ed233f0671ea7e38a750445a4858f3c759aabcd2))


### Performance Improvements

* 增加切换图片自动放大选项的快捷键 ([3d9660a](https://github.com/hymbz/ComicReadScript/commit/3d9660a3aceae3f3e9590901b30421117dd8b44f))

## [7.1.4](https://github.com/hymbz/ComicReadScript/compare/v7.1.3...v7.1.4) (2023-09-28)


### Bug Fixes

* :bug: 修复滚动条样式异常的 bug ([6c513f1](https://github.com/hymbz/ComicReadScript/commit/6c513f1e2a4ac6ff9155a56c320c22def5963ad6))

## [7.1.3](https://github.com/hymbz/ComicReadScript/compare/v7.1.2...v7.1.3) (2023-09-27)


### Bug Fixes

* :bug: 修复加载中图片位置错误的 bug ([ecf0974](https://github.com/hymbz/ComicReadScript/commit/ecf097425b03b0abcc94557248d967e79d573fe7))
* :bug: 修复切换单双页模式时未使页数保持不变的 bug ([03ac72c](https://github.com/hymbz/ComicReadScript/commit/03ac72c2da0b5051c7e31e9bd4789d5934136b44))
* :bug: 修复在火狐翻页会闪屏的 bug ([c4af4f5](https://github.com/hymbz/ComicReadScript/commit/c4af4f52cc7f845dea8a2873cb4c27ddc72ffcd0))

## [7.1.2](https://github.com/hymbz/ComicReadScript/compare/v7.1.1...v7.1.2) (2023-09-26)


### Bug Fixes

* :bug: 修复无法使用本机外自部署的翻译服务的 bug ([7c63392](https://github.com/hymbz/ComicReadScript/commit/7c633922a338d92710a1471ac9c11ae7a0789b4f))

## [7.1.1](https://github.com/hymbz/ComicReadScript/compare/v7.1.0...v7.1.1) (2023-09-25)


### Bug Fixes

* :bug: 修复脚本无法正常运行的 bug ([63252b2](https://github.com/hymbz/ComicReadScript/commit/63252b2e34b0f5af36a703e218669a9b0c10c806))

## [7.1.0](https://github.com/hymbz/ComicReadScript/compare/v7.0.0...v7.1.0) (2023-09-25)


### Bug Fixes

* :bug: 修复 PWA 无法记住选择语言的 bug ([c76b007](https://github.com/hymbz/ComicReadScript/commit/c76b0078b287dd685dbea3abe7d6b121591a06c0))
* :bug: 修复会在无关网页上意外运行并导致 css 异常的 bug ([1e8f2da](https://github.com/hymbz/ComicReadScript/commit/1e8f2da6d79527d66f7c75e59e89a5612cf98a16))

## [6.11.0](https://github.com/hymbz/ComicReadScript/compare/v6.10.2...v6.11.0) (2023-09-24)


### Features

* :sparkles: 实现 i18n ([e998a0e](https://github.com/hymbz/ComicReadScript/commit/e998a0edf50a07a123a7bf93f9e50b7304c44d9b))
* :sparkles: 支持 eh 的多页查看器 ([3475b36](https://github.com/hymbz/ComicReadScript/commit/3475b36d5a3bba0b478ce3b7d8305be3dcceeb1f))
* :sparkles: 支持 hitomi ([11df59e](https://github.com/hymbz/ComicReadScript/commit/11df59ee1194cafaddee302cd803c916356c0215))
* :sparkles: 支持 kemono ([c722ec7](https://github.com/hymbz/ComicReadScript/commit/c722ec716bb76ef43d643deab49bde265f7bf67f))


### Performance Improvements

* :zap: 增加 预加载页数 的设置项 ([597fbab](https://github.com/hymbz/ComicReadScript/commit/597fbab1fb8689b5d82072e826bad355c05ba4f0))

## [6.10.2](https://github.com/hymbz/ComicReadScript/compare/v6.10.1...v6.10.2) (2023-09-16)


### Bug Fixes

* :bug: 修复 dmzj 改版导致的部分隐藏漫画失效的 bug ([e5bc6f8](https://github.com/hymbz/ComicReadScript/commit/e5bc6f8135d0f2e00d438b8e14b0d6e39c344610))

## [6.10.1](https://github.com/hymbz/ComicReadScript/compare/v6.10.0...v6.10.1) (2023-09-10)


### Bug Fixes

* :bug: 修复翻译功能的自定义 URL 未正确显示的 bug ([7b74872](https://github.com/hymbz/ComicReadScript/commit/7b7487225695fc6a755b8097847460bcf061c51f))


## [6.10.0](https://github.com/hymbz/ComicReadScript/compare/v6.9.5...v6.10.0) (2023-09-03)


### Features

* :sparkles: 增加将点击区域改为上下翻页的选项 ([de0d726](https://github.com/hymbz/ComicReadScript/commit/de0d7264df6420ab3588860132eec7cd85623b09))


### Bug Fixes

* :bug: 修复 eh 在翻页后加载会导致图序混乱的 bug ([1d2d9cd](https://github.com/hymbz/ComicReadScript/commit/1d2d9cd8de87c1111b935bec5a2b5b9fa86529ea))
* :bug: 修复卷轴模式下按键滚动触发结束页的判定异常的 bug ([f0b93fb](https://github.com/hymbz/ComicReadScript/commit/f0b93fbc1a411b8ded60102a7f6daabe5cc1a959))
* :bug: 修复卷轴模式下未自动设置焦点的 bug ([a05064b](https://github.com/hymbz/ComicReadScript/commit/a05064b1e827c23079a9497a37e38ca3a7844c45))
* :bug: 修复卷轴模式下无法使用鼠标中键自动滚屏的 bug ([c2e6fd2](https://github.com/hymbz/ComicReadScript/commit/c2e6fd27ea2fdc9862e7cde876527b8a7e537e90))
* :bug: 修复绅士漫画翻译出错的 bug ([d216321](https://github.com/hymbz/ComicReadScript/commit/d2163212c98fa51b943e7891b9ec06f55b115632))


## [6.9.5](https://github.com/hymbz/ComicReadScript/compare/v6.9.4...v6.9.5) (2023-08-30)


### Bug Fixes

* :bug: 修复无法修改背景颜色的 bug ([8d116f7](https://github.com/hymbz/ComicReadScript/commit/8d116f7ea684d3eef8336d52c56d416686f0dda1))


### Performance Improvements

* :zap: 当屏幕过小时自动将点击翻页的区域改为上下翻页 ([f49b8dc](https://github.com/hymbz/ComicReadScript/commit/f49b8dcf6793123d2760923296864b613be577be))

## [6.9.4](https://github.com/hymbz/ComicReadScript/compare/v6.9.3...v6.9.4) (2023-08-26)


### Bug Fixes

* :bug: 修复百合会看不了第二页后的漫画楼层的 bug ([09b0389](https://github.com/hymbz/ComicReadScript/commit/09b038906522a2aeb77fb2e59729df9a88646f38))


### Performance Improvements

* :zap: 在开启简易阅读时增加禁用 自动进入阅读模式 的提示 ([60c32f9](https://github.com/hymbz/ComicReadScript/commit/60c32f907491d5b1076ab3c6011bf4728f37ef5e))

## [6.9.3](https://github.com/hymbz/ComicReadScript/compare/v6.9.2...v6.9.3) (2023-08-24)


### Bug Fixes

* :bug: 增加支持绅士漫画的其他域名 ([719f494](https://github.com/hymbz/ComicReadScript/commit/719f4948d437a740047be15f64dd4176d19c1ec1))

## [6.9.2](https://github.com/hymbz/ComicReadScript/compare/v6.9.1...v6.9.2) (2023-08-23)


### Bug Fixes

* :bug: 修复在 eh 上和其他脚本冲突导致的 bug ([59dd68e](https://github.com/hymbz/ComicReadScript/commit/59dd68e10fb7b81aae458f6ea37ae04558fde5a6))

## [6.9.1](https://github.com/hymbz/ComicReadScript/compare/v6.9.0...v6.9.1) (2023-08-21)


### Bug Fixes

* :bug: 修复当网页宽度较窄时在 eh 上无法正常运行的 bug ([97c1085](https://github.com/hymbz/ComicReadScript/commit/97c10855a06a68d4f6abf305ebea9fa978534e0e))

## [6.9.0](https://github.com/hymbz/ComicReadScript/compare/v6.8.4...v6.9.0) (2023-08-19)


### Features

* :sparkles: 新增支持站点 PonpomuYuri ([fe11ac8](https://github.com/hymbz/ComicReadScript/commit/fe11ac831d7fdaf85f98b29ed805c0f0e1beab1e))


### Bug Fixes

* :bug: 修复 dmzj 改版导致的切换章节后卡死的 bug ([42041ea](https://github.com/hymbz/ComicReadScript/commit/42041ead2d86686a86a1dd811d0142ba8188bc6c))

## [6.8.4](https://github.com/hymbz/ComicReadScript/compare/v6.8.3...v6.8.4) (2023-08-14)


### Bug Fixes

* :bug: 修复 eh 和其他脚本冲突导致的加载异常 ([5e6ac07](https://github.com/hymbz/ComicReadScript/commit/5e6ac071cc41510d56223e6e0a46e9652bc9cbca))

## [6.8.3](https://github.com/hymbz/ComicReadScript/compare/v6.8.2...v6.8.3) (2023-08-14)


### Bug Fixes

* :bug: 修复无法使用 ehentai 的 load comic 按钮加载的 bug ([08698a2](https://github.com/hymbz/ComicReadScript/commit/08698a2f5cdf6c9301e76bf3a93c8be9c9b9ec69))
* :bug: 修复无法使用鼠标中键切换页面填充的 bug ([c79f0d6](https://github.com/hymbz/ComicReadScript/commit/c79f0d64c4ea9e516f4a99a224ee8d62d48fd8d3))


### Performance Improvements

* :zap: 为 dmzj 的隐藏漫画增加显示评论 ([0ae3707](https://github.com/hymbz/ComicReadScript/commit/0ae3707e5c2c830b43fe998d853c0d53dad60e34))

## [6.8.2](https://github.com/hymbz/ComicReadScript/compare/v6.8.1...v6.8.2) (2023-08-12)


### Bug Fixes

* :bug: 修复和 Dark Reader 的冲突 ([ffc5336](https://github.com/hymbz/ComicReadScript/commit/ffc5336f14c7a9c9568a04f84ac87d208b724314))
* :bug: 修复在已支持的站点上显示简易模式菜单项的 bug ([b235add](https://github.com/hymbz/ComicReadScript/commit/b235add45ba4076b3138e1aaba66798ed706be51))


### Performance Improvements

* :zap: 优化 eh、jm 的加载策略，尽快进入阅读模式 ([0709ac9](https://github.com/hymbz/ComicReadScript/commit/0709ac9e31776a9d37d8b3cec48108f261293bed))

## [6.8.1](https://github.com/hymbz/ComicReadScript/compare/v6.8.0...v6.8.1) (2023-08-11)


### Bug Fixes

* :bug: 修复悬浮按钮显示异常的 bug ([d9a2405](https://github.com/hymbz/ComicReadScript/commit/d9a2405d241d2a68f1177bac9f2b66bec8900e40))

## [6.8.0](https://github.com/hymbz/ComicReadScript/compare/v6.7.1...v6.8.0) (2023-08-11)


### Features

* :sparkles: 实现简易阅读模式下和其他自动翻页、聚图脚本的联动 ([7a7b96b](https://github.com/hymbz/ComicReadScript/commit/7a7b96b73100ced876d0a941a322999e104ae4db))
* :sparkles: 为简易阅读模式增加识别漫画页功能，避免在其他页面运行 ([0e4b64e](https://github.com/hymbz/ComicReadScript/commit/0e4b64e8e262c8e17154af34f580a13d62b03ce9))

### Bug Fixes

* :bug: 修复快捷键配置未能正确储存的 bug ([aa49a05](https://github.com/hymbz/ComicReadScript/commit/aa49a05634a47b50825286737bb770e9eb1859bf))

## [6.7.1](https://github.com/hymbz/ComicReadScript/compare/v6.7.0...v6.7.1) (2023-08-07)


### Bug Fixes

* :bug: 修复无法自定义快捷键的 bug ([d8164b4](https://github.com/hymbz/ComicReadScript/commit/d8164b47a8e83bda62b7a6eeb53dfe1982bbba06))

## [6.7.0](https://github.com/hymbz/ComicReadScript/compare/v6.6.0...v6.7.0) (2023-08-07)


### Features

* :sparkles: 增加自定义快捷键的设置项 ([707c8c2](https://github.com/hymbz/ComicReadScript/commit/707c8c21275e0dce854d2eb4ba3a32e6923d7cc8))


### Bug Fixes

* :bug: 修复 komiic 在某些情况下上下话翻页功能失效的 bug ([56047ef](https://github.com/hymbz/ComicReadScript/commit/56047ef159df230eedd2c664984f3fa56b9389b0))


### Performance Improvements

* :zap: 阅读模式下的按键不再会触发站点的快捷键 ([5d324bd](https://github.com/hymbz/ComicReadScript/commit/5d324bdecf4cf356177848211b1b56ccc4ce6e49))
* :zap: 实现使用鼠标中键切换页面填充 ([61eda3d](https://github.com/hymbz/ComicReadScript/commit/61eda3dd0bf344d668f8197ac9115894d82b7d3f))


## [6.6.0](https://github.com/hymbz/ComicReadScript/compare/v6.5.3...v6.6.0) (2023-08-06)


### Features

* :sparkles: 新增支持站点 komiic ([4d1de5e](https://github.com/hymbz/ComicReadScript/commit/4d1de5e076f8e3166fb83b2584303fb0064b12f9))


### Bug Fixes

* :bug: 修复 nhentai 未登录状态下自动翻页失效的 bug ([9e606a1](https://github.com/hymbz/ComicReadScript/commit/9e606a137388575c23be4f0daefda78f7ae75001))
* :bug: 修复卷轴模式下无法使用键盘弹出结束页的 bug ([ac17ed4](https://github.com/hymbz/ComicReadScript/commit/ac17ed49cd57141c91ba2c7949f99dded05d78f7))

## [6.5.3](https://github.com/hymbz/ComicReadScript/compare/v6.5.2...v6.5.3) (2023-07-27)


### Bug Fixes

* :bug: 修复进入阅读模式后浏览器焦点不在页面内的 bug ([f7c0fd3](https://github.com/hymbz/ComicReadScript/commit/f7c0fd35452e4d1e0dbffeb6f17eb092c626c445))
* :bug: 修复漫画柜偶尔加载出错的 bug ([aebbb76](https://github.com/hymbz/ComicReadScript/commit/aebbb76967e2a35a2c1e7513e9750c93337552a6))

## [6.5.2](https://github.com/hymbz/ComicReadScript/compare/v6.5.1...v6.5.2) (2023-07-23)


### Bug Fixes

* :bug: 修复卷轴模式下首张图片可能无法加载的 bug ([963d686](https://github.com/hymbz/ComicReadScript/commit/963d686ce03262a8ee16e4784a85edbcb746528f))


### Performance Improvements

* :zap: 增加自定义翻译服务 URL 的设置 ([645086d](https://github.com/hymbz/ComicReadScript/commit/645086d4f33a59854e8ed665121af0532b7dc538))

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
