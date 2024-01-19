

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
