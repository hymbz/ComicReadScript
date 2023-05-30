动漫之家的隐藏漫画有以下几种情况：

1. 在目录页提示「因版权国家法规……」。所有 api 都能拿到目录数据，可以直接重新生成目录，但旧APi只能获取到连载版本的章节

2. 目录页被删，但PC端漫画页还在。那就可以通过谷歌搜索找到进入

3. 目录页被删，但手机端漫画页还在，但提示漫画不存在。

    那就只能通过 api 获取数据了，但因为 api 需要漫画 id，而 dmzj 的手机端 url 有两种，只有「https://m.dmzj.com/info/45163.html」格式的 url 才能拿到 id 正常调用接口获取数据。在以前可以通过 <https://dmzj.nsapps.cn/> 搜索找到，但现在已经上不去了。如果能搜到 id 的话，还是能通过手动构建 url 来进入

## 例子

- 旧 api 就能拿到数据
  https://manhua.dmzj.com/yanquan
- v4Api才能拿到数据
  https://manhua.dmzj.com/sexmigongzaiwojiadixiachuxianlehcishudengyudengjid

## API

- https://api.dmzj.com/dynamic/comicinfo/50654.json
- https://v4api.idmzj.com/comic/detail/51944?uid=2665531&disable_level=1

## 参考

- https://github.com/xiaoyaocz/flutter_dmzj/blob/ecbe73eb435624022ae5a77156c5d3e0c06809cc/lib/requests/api.dart
- https://github.com/erinacio/tachiyomi-extensions/blob/548be91cccb8f248342e2e7762c2c3d4b2d02036/src/zh/dmzj/src/eu/kanade/tachiyomi/extension/zh/dmzj/Dmzj.kt
- https://greasyfork.org/zh-CN/scripts/466729-动漫之家解除屏蔽
