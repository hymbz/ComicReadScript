# 最简单的 manga-image-translator 本地部署流程

## 开头劝退

本地部署需要一定的动手能力，纯计算机小白且不打算学习动手的可以直接右上角了，目前还没有一键安装部署的方法。

部署好后默认只能使用一些免费的翻译服务，要想有好的翻译效果，还需要自行获取相关翻译服务的 api。翻译效果和获取难度基本成正比，具体请参考 [manga-image-translator](https://github.com/zyddnys/manga-image-translator/blob/main/README_CN.md#翻译器列表) 文档的翻译器列表部分。

## 简单说明

因为感觉 [manga-image-translator](https://github.com/zyddnys/manga-image-translator/blob/main/README_CN.md) 的文档对不了解相关知识的普通人来说可能太难看懂了，所以为了方便更多人在本地部署 manga-image-translator 才有了这篇文章。

> 这篇文章仅仅是我自己对部署流程的笔记，具体还请以 [manga-image-translator](https://github.com/zyddnys/manga-image-translator/blob/main/README_CN.md) 官方文档为主

manga-image-translator 有两种部署方式，一种是配置好环境后直接把代码下载下来运行，因为配置环境很麻烦所以 pass。这篇文章介绍的是更简单的通过 Docker 来部署。

简单介绍下 Docker，你可以把它理解成一个模拟器，可以从应用商店下载各类应用运行，每个应用都是在单独的环境中运行，所以不会影响到电脑，也能很方便的在不同版本的应用间切换。唯一的问题就是它没有图形界面，只能通过命令行来运行。

所以要在本地部署 manga-image-translator 就只有两步：安装 Docker、下载 manga-image-translator，其中比较麻烦的就只有安装 Docker，装好以后只需要一行命令就能自动下载并运行 manga-image-translator 了。

> 注意！在 windows 上开启 Hyper-V 会导致大部分虚拟机、安卓模拟器无法使用，需要修改设置或改换支持Hyper-V的版本。如有相关需求无法开启，就只能参照 [官方文档](https://github.com/zyddnys/manga-image-translator/blob/main/README_CN.md#使用说明) 来安装了

## 安装 Docker

安装 Docker 的教程网上已经很多了，可自行搜索「Windows Docker 安装」参考安装。这里推荐 [菜鸟教程的文章](https://www.runoob.com/docker/windows-docker-install.html)

## 部署 manga-image-translator

随便找个地方创建一个新文件夹，在其中创建一个名为 `docker-compose.yml` 的文件。

>注意不是文本文件，如果是通过新建文本文件创建的话，记得要把 .txt 的后辍删掉

将文件内容改为：

```yaml
version: "3.8"
services:
  manga_image_translator:
    image: zyddnys/manga-image-translator:main
    container_name: manga_image_translator_cpu
    command: -l ENG --manga2eng -v --mode web --host=0.0.0.0 --port=5003
    volumes:
      - ./result:/app/result
    ports:
      - 5003:5003
    ipc: host
```

点击文件夹左上角「文件」菜单中的，「打开 Windows PowerShell」，这样启动的 PowerShell 会自动将所在路径设为当前目录

之后输入 `docker-compose up`，回车运行就会自动安装并运行起来了

> 如果提示「error during connect: this error may indicate that the docker daemon is not running」说明 docker 还没启动，参考安装 Docker 的教程到开始菜单之类的地方启动一下就好

首次安装会花上一段时间，因为包含了所有依赖项和模型，所以总共需要下载 15GB

当看到下面这两行输出时，就代表启动成功了。此时在浏览器上打开 <http://127.0.0.1:5003> 网页就能使用 manga-image-translator 了

```
manga_image_translator_cpu  | [web] Running in web mode
manga_image_translator_cpu  | Serving up app on http://0.0.0.0:5003
```

注意此时不要关闭命令行窗口

## 配置翻译服务

以彩云和 ChatGPT 举例：

```yaml
version: "3.8"
services:
  manga_image_translator:
    image: zyddnys/manga-image-translator:main
    container_name: manga_image_translator_cpu
    command: -l ENG --manga2eng -v --mode web --host=0.0.0.0 --port=5003
    volumes:
      - ./result:/app/result
    ports:
      - 5003:5003
    ipc: host
    # 增加下面这段
    environment:
      OPENAI_API_KEY: <你自己的 api key>
      CAIYUN_TOKEN: <你自己的 api key>
```

修改后使用命令 `docker-compose restart` 重启 manga-image-translator 即可。

> 按理来说此处应有 ChatGPT 账号的广告，但因为我实在是讨厌中间商赚差价，所以虽然觉得应该在这里推荐几个网站方便购买使用 api，但最后还是作罢，有需要的自行搜索吧。
>
> 不过要提醒一下，比起以时间为单位购买/租借账号，选择那些根据实时用量扣费的会更划算。一次只要充几块钱就能用好久，也不怕网站跑路。

最后，如果在部署后有任何问题，还请去 [manga-image-translator 的 issues](https://github.com/zyddnys/manga-image-translator/issues) 上反馈。
