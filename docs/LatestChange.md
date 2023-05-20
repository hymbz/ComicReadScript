## [0.4.0](https://github.com/hymbz/ComicReadScriptTest/compare/v0.3.0...v0.4.0) (2023-05-20)


### Features

* :sparkles: 当超过3张图的类型为长图时，自动开启卷轴模式 ([9dd8e58](https://github.com/hymbz/ComicReadScriptTest/commit/9dd8e58ea3cf07e36b4daede2f55545b1eed4f8c))
* :sparkles: 将卷轴模式下图片的最大宽度设为窗口高度的50% ([38158c7](https://github.com/hymbz/ComicReadScriptTest/commit/38158c7ade1c3d02fac41f0c4618add8bd4ac894))
* :sparkles: 使卷轴模式下可以保持缩放状态进行滚动 ([7b3c358](https://github.com/hymbz/ComicReadScriptTest/commit/7b3c3582481c83071e46e1b950ac8d385b6a4569))
* :sparkles: 适配出现结尾跨页图时的默认填充页添加情况 ([f69d529](https://github.com/hymbz/ComicReadScriptTest/commit/f69d52933a8f5fd504aa289f67a2d0431d146eb7))
* :sparkles: 在开头和中间出现跨页时关掉首页填充 ([c8fd720](https://github.com/hymbz/ComicReadScriptTest/commit/c8fd7201831a759557e7f419089d2cc8a7c31047))
* :sparkles: 在页数过多时自动禁用空闲加载功能 ([5a44df1](https://github.com/hymbz/ComicReadScriptTest/commit/5a44df1e20ff0edaf587934ff00dd8e19f19fef0))
* :sparkles: 增加始终加载所有图片的选项 ([9bc5d4c](https://github.com/hymbz/ComicReadScriptTest/commit/9bc5d4c45581dd4d82795eac78088284fa12e18a))
* :sparkles: 支持方舟的泰拉记事社 ([032482f](https://github.com/hymbz/ComicReadScriptTest/commit/032482f77816dead4cfe9da44296cc2caf2b186f))


### Bug Fixes

* :bug: 修复加载逻辑错误 ([3fa6b74](https://github.com/hymbz/ComicReadScriptTest/commit/3fa6b74aff0937a9f24fac77da1d4a541871408a))
* :bug: 修复卷轴模式下结束页显示错误的 bug ([ede9280](https://github.com/hymbz/ComicReadScriptTest/commit/ede9280a1c422e81a7fccf6495beafd8e90a051d))
* :bug: 修复切换到卷轴模式时滚动条显示错误 ([96b1c72](https://github.com/hymbz/ComicReadScriptTest/commit/96b1c722d0f9020886b57e01221a28c92945d332))
* :bug: 修改脚本名防止和正式版冲突 ([05839ab](https://github.com/hymbz/ComicReadScriptTest/commit/05839abb295d0f93a8c225e739b49deb0e761ff9))


### Performance Improvements

* :zap: 删掉无用的 autoLoadOtherImg 配置项及相关判断代码 ([d74c861](https://github.com/hymbz/ComicReadScriptTest/commit/d74c86105f3792c293a165bbd02c8268b0cad17c))
* :zap: 优化 ehentai 的加载逻辑 ([014df64](https://github.com/hymbz/ComicReadScriptTest/commit/014df64d3ddebb5b2afd4fb64132ad30de4adcd4))
* :zap: 优化图片加载逻辑 ([34beb63](https://github.com/hymbz/ComicReadScriptTest/commit/34beb63926ca55a5e30aeb318909c5e00e27543a))
