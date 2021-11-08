// ==UserScript==
// @name      ComicRead
// @version     4.7
// @author      hymbz
// @description 为漫画站增加双页阅读模式并优化使用体验。百合会——「记录阅读历史，体验优化」、动漫之家——「看被封漫画，导出导入漫画订阅/历史记录」、ehentai——「匹配 nhentai 漫画、Tag」、nhentai——「彻底屏蔽漫画，自动翻页」、dm5、manhuagui、manhuadb、mangabz、copymanga、manhuacat。部分支持站点以外的网站，也可以使用简易阅读模式来双页阅读漫画。
// @namespace   ComicRead
// @include     *
// @connect     *
// @grant       GM_xmlhttpRequest
// @grant       GM_deleteValue
// @grant       GM_listValues
// @grant       GM_setValue
// @grant       GM_getValue
// @grant       GM_addStyle
// @grant       GM_getResourceText
// @grant       GM_notification
// @grant       GM_registerMenuCommand
// @grant       GM_addElement
// @resource    DMZJcss https://userstyles.org/styles/chrome/119945.json
// @resource    vue https://cdn.jsdelivr.net/npm/vue@2.6.14
// @resource    FileSaver https://cdn.jsdelivr.net/npm/file-saver@2.0.0
// @resource    JSZip https://cdnjs.cloudflare.com/ajax/libs/jszip/3.1.5/jszip.min.js
// @supportURL  https://github.com/hymbz/ComicReadScript/issues
// @updateURL   https://github.com/hymbz/ComicReadScript/raw/master/ComicRead.user.js
// @downloadURL https://github.com/hymbz/ComicReadScript/raw/master/ComicRead.user.js
// @noframes
// ==/UserScript==

/**
 * 获取元素所在高度
 * @param {*} event 指定的元素
 * @returns {int} 元素所在高度
 */
const getTop = (event) => event.getBoundingClientRect().top + document.body.scrollTop + document.documentElement.scrollTop;

/**
 * 添加元素
 * @param {object} node 被添加元素
 * @param {(string)} textnode 添加元素
 * @param {object | nulll} referenceNode 参考元素，添加元素将插在参考元素前
 */
const appendDom = (node, textnode, referenceNode=null) => {
  const temp = document.createElement('div');
  temp.innerHTML = textnode;
  const frag = document.createDocumentFragment();
  while (temp.firstChild)
    frag.appendChild(temp.firstChild);
  node.insertBefore(frag, referenceNode);
  // node.appendChild(frag);
};

const selfEval = (textContent)=>{
  GM_addElement('script', {textContent});
}

/**
 * 加载外部脚本
 */
const loadExternalScripts = {
  Vue: () => { selfEval(GM_getResourceText('vue')) },
  FileSaver: () => { selfEval(GM_getResourceText('FileSaver')) },
  JSZip: () => { selfEval(GM_getResourceText('JSZip')) },
};

let ComicReadWindow;
let ScriptMenu;

/**
 * 加载构建 ComicReadWindow
 * @param {Object} Info 相关信息
 * @param {Object} Info.comicImgList 漫画图片列表
 * @param {Object} Info.readSetting 相关的配置数据
 * @param {Object} Info.EndExit 点击结尾 End 退出时执行的操作
 * @param {string} Info.comicName 漫画标题，用于下载漫画时命名用
 * @param {string} Info.nextChapter 下一话链接
 * @param {string} Info.prevChapter 上一话链接
 * @param {string} Info.blobList blob格式的图片文件列表，下载用
 */
const loadComicReadWindow = function (Info) {
  if (!Info.hasOwnProperty('comicImgList') || !Info.comicImgList.length)
    throw 'comicImgList 为空';

  if (typeof Vue === 'undefined')
    loadExternalScripts.Vue();

  if (ComicReadWindow === undefined) {
    GM_addStyle('@@ComicRead.css@@');
    appendDom(document.body, '@@ComicRead.html@@');
    ComicReadWindow = new Vue({
      el: '#comicRead',
      delimiters: ['[[', ']]'],
      data: {
        readSetting: {},
        show: false,
        ComicImgInfo: [],
        PageNum: 0,
        magnifier: false,
        lastTouchmove: {},
        nextChapter: null,
        prevChapter: null,
        fillInfluence: {},
        comicImgList: [],
      },
      methods: {
        updatedData () {
          // 处理图片
          const fillPage = (src) => ({
            src,
            index: '填充',
            class: 'fill',
          });
          const pageRatio = window.innerWidth / 2 / window.innerHeight;
          const bannerRatio = window.innerWidth / window.innerHeight;
          const verticalRatio = window.innerWidth / 2 / 3 / window.innerHeight;
          let tempImgInfo = [];
          this.ComicImgInfo = [];

          for (let i = 0; i < this.comicImgList.length; i++) {
            const imgRatio = this.comicImgList[i].width / this.comicImgList[i].height;
            const imgInfo = {
              src: this.comicImgList[i].src,
              index: i,
              class: '',
            };

            if (this.readSetting['双页显示']) {
              if (this.fillInfluence[i - 1])
                tempImgInfo.push(fillPage(imgInfo.src));
              if (imgRatio <= pageRatio) {
                if (imgRatio < verticalRatio)
                  imgInfo.class = 'vertical';
                if (tempImgInfo.length)
                  this.ComicImgInfo.push([imgInfo, tempImgInfo.shift()]);
                else
                  tempImgInfo.push(imgInfo);
                continue;
              } else {
                if (tempImgInfo.length) {
                  if (tempImgInfo[0].class === 'fill')
                    tempImgInfo = [];
                  else
                    this.ComicImgInfo.push([fillPage(tempImgInfo[0].src), tempImgInfo.shift()]);
                }
                if (this.fillInfluence[i] === undefined)
                  this.fillInfluence[i] = false;
              }
            }
            imgInfo.class = imgRatio > bannerRatio ? 'long' : 'wide';
            this.ComicImgInfo.push([imgInfo]);
          }

          if (tempImgInfo.length && tempImgInfo[0].class !== 'fill')
            this.ComicImgInfo.push([fillPage(tempImgInfo[0].src), tempImgInfo.shift()]);

          const isVerticalComic = () => this.ComicImgInfo.reduce((num, e) => num + e.filter(e => e.class === 'vertical').length, 0) > this.comicImgList.length * 0.6;
          if (!this.readSetting['卷轴模式'] && isVerticalComic())
            this.switchScrollMode();
        },
        download () {
          // 下载漫画
          if (typeof JSZip === 'undefined') {
            loadExternalScripts.FileSaver();
            loadExternalScripts.JSZip();
          }

          const zip = new JSZip();
          const imgIndexLength = this.comicImgList.length.toString().length;
          let imgIndex = this.comicImgList.length;

          if (this.blobList) {
            const {blobList} = this;
            while (imgIndex--)
              zip.file(`${imgIndex.toString().padStart(imgIndexLength, 0)}.${blobList[imgIndex][1]}`, blobList[imgIndex][0]);
            zip.generateAsync({type: 'blob'}).then((content) => {
              saveAs(content, `${ComicReadWindow.comicName}.zip`);
            });
          } else {
            const imgTotalNum = ComicReadWindow.comicImgList.length;
            let comicDownloadNum = 0;
            const downDom = document.querySelector('[tooltip^="下载"]');
            const downDomSvg = downDom.getElementsByTagName('path')[0];

            while (imgIndex--) {
              const tempIndex = imgIndex + 1;
              GM_xmlhttpRequest({
                method: 'GET',
                url: this.comicImgList[imgIndex].src,
                headers: {referer: location.href},
                responseType: 'blob',
                onload: (xhr, index = tempIndex) => {
                  if (xhr.status === 200) {
                    zip.file(`${index.toString().padStart(imgIndexLength, 0)}.${xhr.finalUrl.replace(/.+\.|\?.*/g, '')}`, xhr.response);
                    if (++comicDownloadNum === imgTotalNum) {
                      downDom.setAttribute('tooltip', '下载完成');
                      downDomSvg.setAttribute('d', 'M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM10 17l-3.5-3.5 1.41-1.41L10 14.17 15.18 9l1.41 1.41L10 17z');
                      zip.generateAsync({type: 'blob'}).then((content) => {
                        saveAs(content, `${ComicReadWindow.comicName}.zip`);
                      });
                    } else
                      downDom.setAttribute('tooltip', `${comicDownloadNum}/${imgTotalNum}`);
                  }
                },
              });
            }
          }
        },
        scrollPage (event, changeChapter = false) {
          if (typeof event === 'object' ? event.deltaY < 0 : event) {
            if (this.PageNum === 'end')
              this.PageNum = this.ComicImgInfo.length - 1;
            else if (this.PageNum > 0)
              this.PageNum--;
            else {
              if (changeChapter && this.prevChapter)
                this.changeChapter(false);
            }
          } else {
            if (this.PageNum === this.ComicImgInfo.length - 1)
              this.PageNum = 'end';
            else if (this.PageNum <= this.ComicImgInfo.length)
              this.PageNum++;
            else {
              if (changeChapter && this.nextChapter)
                this.changeChapter(true);
            }
          }
          if (this.magnifier)
            this.magnifier = this.PageNum !== 'end';
          this.fillInfluence.now = this.pageFill();
        },
        changeChapter (next) {
          // 跳转至上一话或下一话
          const jumpChapter = next ? this.nextChapter : this.prevChapter;
          if (jumpChapter instanceof Function)
            jumpChapter();
          else
            location.href = jumpChapter;
        },
        exitComicRead (end) {
          // 退出，如果是从结尾的 End 退出的执行 EndExit，否则跳至网页顶部
          document.documentElement.style.overflow = 'auto';
          this.show = false;
          [...document.querySelectorAll('body>.hidden')].forEach(e => e.classList.remove('hidden'));
          if (end) {
            this.PageNum = 0;
            this.EndExit();
          } else
            scrollTo(0, 0);
        },
        MouseMoveControl (event) {
          // 处理鼠标的移动和点击事件
          if (this.magnifier) {
            const magnifier = document.getElementById('magnifier');
            if (event.type === 'touchmove')
              event = event.changedTouches[0];
            magnifier.style.top = `${event.clientY > window.innerHeight / 2 ? event.clientY - (window.innerHeight * 0.5) : event.clientY + (window.innerHeight * 0.1) + 5}px`;
            magnifier.style.left = `${event.clientX > window.innerWidth / 2 ? event.clientX - (window.innerWidth * 0.5) : event.clientX + (window.innerWidth * 0.1) + 5}px`;
            magnifier.firstChild.style.marginTop = `-${(event.clientY * 2) - (window.innerHeight * 0.2)}px`;
            magnifier.firstChild.style.marginLeft = `-${(event.clientX * 2) - (window.innerWidth * 0.2)}px`;
            document.getElementById('scope').style.top = `${event.clientY - (window.innerHeight * 0.1)}px`;
            document.getElementById('scope').style.left = `${event.clientX - (window.innerWidth * 0.1)}px`;
          } else if (event.type === 'mousemove') {
            if (event.clientX < 100)
              document.getElementById('sidebar').className = 'show';
            else if (document.getElementById('sidebar').className)
              document.getElementById('sidebar').className = '';
          } else if (event.type === 'click' && this.readSetting['点击翻页']) {
            this.scrollPage(event.clientX > screen.availWidth / 2);
            document.getElementById('sidebar').className = '';
          }
        },
        TouchControl (event) {
          // 处理手势
          const x = this.lastTouchmove.touches[0].clientX - event.changedTouches[0].clientX;
          const y = this.lastTouchmove.touches[0].clientY - event.changedTouches[0].clientY;
          if (Math.abs(x) > 10 && Math.abs(y) > 10 && Math.abs(x / y) < 1)
            this.scrollPage(y < 0);
          else
            document.getElementById('sidebar').className = x > 0 ? '' : 'show';
        },
        pageFill (type) {
          // 根据 type 返回或修改当前页所在 fillInfluence 的值。type 指调用方式，直接调用函数返回，否则修改
          if (this.PageNum === 'end')
            return false;
          if (this.ComicImgInfo.length === 0)
            this.updatedData();
          // 使用 filter 过滤是为了处理填充页在前的情况
          // 找出当前显示页面的 index
          let i = this.ComicImgInfo[this.PageNum].filter(e => !isNaN(e.index))[0].index;
          // 找到所属的 fillInfluence 值
          while (!this.fillInfluence.hasOwnProperty(i) && i--)
            ;
          if (type) {
            this.fillInfluence[i] = !this.fillInfluence[i];
            this.fillInfluence.now = this.fillInfluence[i];
            if (this.ComicImgInfo[this.PageNum][0].class === 'fill')
              this.PageNum--;
            this.updatedData();
          } else
            return this.fillInfluence[i];
        },
        switchScrollMode () {
          // 切换卷轴模式
          this.readSetting['卷轴模式'] = !this.readSetting['卷轴模式'];
          document.documentElement.style.overflow = this.readSetting['卷轴模式'] ? 'hidden auto' : 'hidden';
          if (this.readSetting['卷轴模式'])
            [...document.querySelectorAll('body>:not(#comicRead)')].forEach(e => e.classList.add('hidden'));
          this.$forceUpdate();
        },
      },
      updated () {
        this.$nextTick(() => {
          scrollTo(0, getTop(document.querySelector(`#comicShow>[index='${this.PageNum}']`)));
        });
      },
    });
  }

  Object.assign(ComicReadWindow, Info);

  // 关闭记录滚动历史
  history.scrollRestoration = 'manual';
  // 在浏览器窗口大小改变时刷新
  window.onresize = ComicReadWindow.updatedData;
  // 键盘翻页
  document.onkeyup = (e) => {
    if (!ComicReadWindow.show)
      return;

    switch (e.keyCode) {
      // 方向键左
      case 37:
      // 逗号
      case 188:
        ComicReadWindow.scrollPage(!ComicReadWindow.readSetting['翻页键反转'], true);
        break;
      // 方向键右
      case 39:
      // 句号
      case 190:
        ComicReadWindow.scrollPage(ComicReadWindow.readSetting['翻页键反转'], true);
        break;

      // PageUp
      case 33:
      // 方向键上
      case 38:
        ComicReadWindow.scrollPage(true, true);
        break;
      // 空格
      case 32:
      // PageDown
      case 34:
      // 方向键下
      case 40:
        ComicReadWindow.scrollPage(false, true);
        break;
    }
  };

  ComicReadWindow.start = () => {
    document.documentElement.style.overflow = ComicReadWindow.readSetting['卷轴模式'] ? 'hidden auto' : 'hidden';
    if (ComicReadWindow.readSetting['卷轴模式']) {
      [...document.querySelectorAll('body>:not(#comicRead)')].forEach(e => e.classList.add('hidden'));
      scrollTo(0, 0);
    }

    // 在所有图片加载完毕前，每隔一秒刷新一次
    const updated = () => {
      ComicReadWindow.fillInfluence = {
        '-1': Info.readSetting['页面填充'],
        now: Info.readSetting['页面填充'],
      };
      ComicReadWindow.updatedData();

      if (![...ComicReadWindow.comicImgList].every(e => e.complete))
        setTimeout(updated, 1000);
    };
    updated();
    setTimeout(()=>{ ComicReadWindow.show = true }, 0);
  };
};

/**
 * 加载构建 ScriptMenu
 * @param {string} websiteSettingName 用来获取指定网站的用户配置的唯一标识符
 * @param {Object} defaultUserSetting 默认设置
 */
// eslint-disable-next-line no-unused-vars
const loadScriptMenu = function (websiteSettingName, defaultUserSetting) {
  if (typeof Vue === 'undefined')
    loadExternalScripts.Vue();

  GM_addStyle('@@ScriptMenu.css@@');
  appendDom(document.body, '@@ScriptMenu.html@@');
  ScriptMenu = new Vue({
    el: '#ScriptMenu',
    delimiters: ['[[', ']]'],
    data: {
      UserSetting: '',
      showWindow: '功能设置',
      top: '',
      left: '',
      show: false,
    },
    methods: {
      dragMoveStart (event) {
        const temp = document.getElementById('ScriptMenu').getBoundingClientRect();
        this.top = temp.top;
        this.left = temp.left;
        if (event.type === 'touchstart') {
          this.offsetX = event.changedTouches[0].clientX - temp.left;
          this.offsetY = event.changedTouches[0].clientY - temp.top;
        } else {
          event.dataTransfer.setDragImage(new Image(), 0, 0);
          this.offsetX = event.offsetX;
          this.offsetY = event.offsetY;
        }
      },
      dragMove (event) {
        event.preventDefault();
        if (event.type === 'touchmove')
          event = event.changedTouches[0];
        // 不知道为什么，在拖动触发的最后一次 drag 事件里，event 里的鼠标位置移到了(0,0)，所以在这里加了个判断
        if (event.clientX || event.clientY) {
          this.top = event.clientY - this.offsetY;
          this.left = event.clientX - this.offsetX;
        }
      },
      saveUserSetting () {
        GM_setValue(websiteSettingName, JSON.stringify(this.UserSetting));
        this.show = false;
      },
      ResetUserSetting () {
        this.UserSetting = this.defaultUserSetting;
        GM_setValue(websiteSettingName, JSON.stringify(this.UserSetting));
        GM_notification('已恢复默认设置');
      },
    },
  });

  ScriptMenu.defaultUserSetting = Object.assign({
    漫画阅读: {
      Enable: true,
      双页显示: true,
      页面填充: true,
      点击翻页: false,
      阅读进度: true,
      夜间模式: false,
      卷轴模式: false,
      翻页键反转: false,
      背景颜色: '',
    },
  }, defaultUserSetting);
  if (GM_getValue(websiteSettingName))
    ScriptMenu.UserSetting = JSON.parse(GM_getValue(websiteSettingName));
  else {
    ScriptMenu.UserSetting = ScriptMenu.defaultUserSetting;
    GM_setValue(websiteSettingName, JSON.stringify(ScriptMenu.defaultUserSetting));
  }
  // 检查脚本版本，如果版本发生变化，将旧版设置移至新版设置
  if (GM_getValue('Version') !== GM_info.script.version) {
    const move = (a, b) => {
      Object.keys(b).forEach(e => {
        if (typeof b[e] === 'object')
          move(a[e], b[e]);
        else
          a[e] = b[e];
      });
    };
    move(ScriptMenu.defaultUserSetting, ScriptMenu.UserSetting);
    ScriptMenu.UserSetting = ScriptMenu.defaultUserSetting;
    GM_setValue('Version', GM_info.script.version);
    GM_setValue(websiteSettingName, JSON.stringify(ScriptMenu.UserSetting));
    GM_notification(`ComicRead 更新至 ${GM_info.script.version}`);
  }

  GM_registerMenuCommand('漫画阅读脚本设置', () => { ScriptMenu.show = true });
};

// 匹配站点
switch (location.hostname) {
  case 'bbs.yamibo.com': {
    '@@YamiboScript.@@';
    break;
  }
  case 'www.yamibo.com': {
    '@@NewYamiboScript.@@';
    break;
  }
  case 'i.dmzj.com':
  case 'm.dmzj.com':
  case 'manhua.dmzj.com': {
    '@@DMZJScript.@@';
    break;
  }
  case 'exhentai.org':
  case 'e-hentai.org': {
    '@@EhentaiScript.@@';
    break;
  }
  case 'nhentai.net': {
    '@@NhentaiScript.@@';
    break;
  }
  case 'tel.dm5.com':
  case 'en.dm5.com':
  case 'www.dm5.com':
  case 'www.1kkk.com': {
    '@@dm5Script.@@';
    break;
  }
  case 'www.manhuagui.com':
  case 'www.mhgui.com':
  case 'tw.manhuagui.com': {
    '@@manhuaguiScript.@@';
    break;
  }
  case 'www.manhuacat.com': {
    '@@manhuacatScript.@@';
    break;
  }
  case 'www.manhuadb.com': {
    '@@manhuadbScript.@@';
    break;
  }
  case 'www.mangabz.com':
  case 'mangabz.com': {
    '@@mangabzScript.@@';
    break;
  }
  case 'copymanga.com':
  case 'copymanga.net':
  case 'copymanga.org':
  case 'www.copymanga.com':{
    '@@copymangaScript.@@';
    break;
  }
  default: {
    window.addEventListener('load', () => {
      let lock = true;
      const autoLoadList = GM_getValue('autoLoadList', []);
      const autoLoad = autoLoadList.includes(location.hostname);
      const start = () => {
        GM_addStyle(':root {--color1: #05a7ca;--color2: #f8fcff;--color3: #ffffff;--color4: #aea5a5;}');

        const imgList = [...document.getElementsByTagName('img')]
          .filter(e => e.naturalHeight > 500 && e.naturalWidth > 500)
          .map(e => e.src);
        if (ComicReadWindow === undefined) {
          if (imgList.length === 0) {
            if (!autoLoad)
              alert('没有找到图片');
            // 为了保证兼容，只能简单粗暴的不断检查网页的图片来更新数据
            if (autoLoad && lock) {
              setInterval(start, 2000);
              lock = false;
            }
            return false;
          }

          if (!ScriptMenu)
            loadScriptMenu(location.hostname, {});

          loadComicReadWindow({
            comicImgList: [...new Set(imgList)].map((e) => {
              const temp = document.createElement('div');
              temp.innerHTML = `<img id="imgPic" class="img-responsive" src="${e}" alt="">`;
              return temp.firstChild;
            }),
            readSetting: ScriptMenu.UserSetting['漫画阅读'],
            EndExit: () => { scrollTo(0, 0) },
            comicName: document.title,
          });
          ComicReadWindow.start();
        } else {
          ComicReadWindow.comicImgList = [...new Set(imgList)].map((e) => {
            const temp = document.createElement('div');
            temp.innerHTML = `<img id="imgPic" class="img-responsive" src="${e}" alt="">`;
            return temp.firstChild;
          });
          ComicReadWindow.updatedData();
        }
        return true;
      };

      GM_registerMenuCommand('进入简易漫画阅读模式', () => {
        if (start() && !autoLoad)
          GM_registerMenuCommand('为此站点自动开启阅读模式', () => {
            loadScriptMenu(location.hostname, {});
            GM_setValue('autoLoadList', [...autoLoadList, location.hostname]);
          });
      });
      if (autoLoad) {
        loadScriptMenu(location.hostname, {});
        GM_registerMenuCommand('不再自动开启阅读模式', () => {
          autoLoadList.splice(autoLoadList.indexOf(3), 1);
          GM_setValue('autoLoadList', autoLoadList);
        });
        start();
      }
    });
  }
}
