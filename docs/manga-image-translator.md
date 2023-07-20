# 最简单的 manga-image-translator 本地部署流程

因为感觉 [manga-image-translator](https://github.com/zyddnys/manga-image-translator/blob/main/README_CN.md) 的文档对不了解这方面的普通人来说可能太难，所以为了方便更多人在本地部署 manga-image-translator 才有了这篇文章。

manga-image-translator 有两种部署方式，一种是配置好环境后直接把代码下载下来运行，因为配置环境很麻烦所以 pass。这篇文章介绍的是更简单的通过 Docker 来部署。

简单介绍下 Docker，你可以把它理解成一个模拟器，可以从应用商店下载各类应用运行，每个应用都是在单独的环境中运行，所以不会影响到电脑，也能很方便的在不同版本的应用间切换。唯一的问题就是它没有图形界面，只能通过命令行来运行。

所以要在本地部署 manga-image-translator 就只有两步：安装 Docker、下载 manga-image-translator，其中比较麻烦的就只有安装 Docker，装好以后只需要一行命令就能自动下载并运行 manga-image-translator 了。

## 安装 Docker

安装 Docker 的教程网上其实已经很多了，如果步骤和我这里对不上的话可以自行搜索「Windows Docker 安装」参考其他教程。

### 1. 开启 Hyper-V

> 注意！开启 Hyper-V 会导致大部分虚拟机、安卓模拟器无法使用，需要修改设置或另外安装支持Hyper-V的版本。如有相关需求无法开启，就只能参照 [官方文档](https://github.com/zyddnys/manga-image-translator/blob/main/README_CN.md#使用说明) 来安装了

