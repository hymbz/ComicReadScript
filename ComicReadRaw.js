// ==UserScript==
// @name      ComicRead
// @version     1.5
// @author      hymbz
// @description 为漫画站增加双页阅读模式并优化使用体验。百合会——「记录阅读历史，体验优化」、动漫之家——「看被封漫画，解除吐槽的字数限制」、ehentai——「匹配 nhentai 漫画、Tag」、nhentai——「彻底屏蔽漫画，自动翻页」。针对支持站点以外的网站，也可以使用简易阅读模式来双页阅读漫画。
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
// @run-at      document-end
// @resource    DMZJcss https://userstyles.org/styles/chrome/119945.json
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
let getTop = (event) => event.getBoundingClientRect().top + document.body.scrollTop + document.documentElement.scrollTop;

/**
 * 添加元素
 * @param {object} node 被添加元素
 * @param {(object|string)} textnode 添加元素
 */
let appendDom = (node, textnode) => {
  let temp = document.createElement('div');
  temp.innerHTML = textnode;
  let frag = document.createDocumentFragment();
  while (temp.firstChild)
    frag.appendChild(temp.firstChild);
  node.appendChild(frag);
};

/**
 * 加载外部脚本
 */
const loadExternalScripts = {
  'Vue': () => { '@@Vue.js@@'; },
  'FileSaver': () => { '@@FileSaver.js@@'; },
  'JSZip': () => { '@@JSZip.js@@'; }
};

let ComicReadWindow,
    ScriptMenu;

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
let loadComicReadWindow = function (Info) {
  if(!Info.hasOwnProperty('comicImgList') || !Info.comicImgList.length)
    throw 'comicImgList 为空';

  if (typeof Vue === 'undefined')
    loadExternalScripts['Vue']();

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
        fillInfluence: {
          'now': true
        }
      },
      methods: {
        updatedData: function () {
          // 处理图片
          const fillPage = (src) => ({
                src: src,
                index: '填充',
                class: 'fill'
              }),
              twoPageRatio = window.innerWidth / 2 / window.innerHeight,
              onePageRatio = window.innerWidth / window.innerHeight;
          let tempImgInfo = [];
          this.ComicImgInfo = [];

          for (let i = 0; i < this.comicImgList.length; i++) {
            const imgRatio = this.comicImgList[i].width / this.comicImgList[i].height;
            let imgInfo = {
              'src': this.comicImgList[i].src,
              'index': i,
              'class': ''
            };

            if (this.readSetting['双页显示']) {
              if (this.fillInfluence[i - 1])
                tempImgInfo.push(fillPage(imgInfo.src));
              if (imgRatio < twoPageRatio) {
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
                if (!this.fillInfluence.hasOwnProperty(i))
                  this.fillInfluence[i] = false;
              }
            }
            imgInfo['class'] = imgRatio > onePageRatio ? 'long' : 'wide';
            this.ComicImgInfo.push([imgInfo]);
          }

          if (tempImgInfo.length && tempImgInfo[0].class !== 'fill')
            this.ComicImgInfo.push([fillPage(tempImgInfo[0].src), tempImgInfo.shift()]);
        },
        download: function () {
          // 下载漫画
          if (typeof JSZip === 'undefined') {
            loadExternalScripts['FileSaver']();
            loadExternalScripts['JSZip']();
          }

          let zip = new JSZip(),
              imgIndex = this.comicImgList.length;

          if (this.blobList) {
            const blobList = this.blobList;
            while (imgIndex--)
              zip.file(`${imgIndex}.${blobList[imgIndex][1]}`, blobList[imgIndex][0]);
            zip.generateAsync({ type: 'blob' }).then((content) => {
              saveAs(content, `${ComicReadWindow.comicName}.zip`);
            });
          } else {
            const imgTotalNum = ComicReadWindow.comicImgList.length;
            let comicDownloadNum = 0,
                downDom = document.querySelector('[tooltip^="下载"]'),
                downDomSvg = downDom.getElementsByTagName('path')[0];

            while (imgIndex--) {
              let tempIndex = imgIndex + 1;
              GM_xmlhttpRequest({
                method: 'GET',
                url: this.comicImgList[imgIndex].src,
                headers: {
                  referer: new URL(this.comicImgList[imgIndex].src).origin
                },
                responseType: 'blob',
                onload: (xhr, index = tempIndex) => {
                  if (xhr.status === 200) {
                    zip.file(`${index}.${xhr.finalUrl.replace(/.+\./, '')}`, xhr.response);
                    if (++comicDownloadNum === imgTotalNum) {
                      downDom.setAttribute('tooltip', '下载完成');
                      downDomSvg.setAttribute('d', 'M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM10 17l-3.5-3.5 1.41-1.41L10 14.17 15.18 9l1.41 1.41L10 17z');
                      zip.generateAsync({ type: 'blob' }).then((content) => {
                        saveAs(content, `${ComicReadWindow.comicName}.zip`);
                      });
                    } else
                      downDom.setAttribute('tooltip', `${comicDownloadNum}/${imgTotalNum}`);
                  }
                }
              });
            }
          }
        },
        scrollPage: function (event) {
          if (typeof event === 'object' ? event.deltaY < 0 : event) {
            if (this.PageNum === 'end')
              this.PageNum = this.ComicImgInfo.length - 1;
            else if (this.PageNum > 0)
              this.PageNum--;
            else
              return;
          } else {
            if (this.PageNum === this.ComicImgInfo.length - 1)
              this.PageNum = 'end';
            else if (this.PageNum <= this.ComicImgInfo.length)
              this.PageNum++;
            else
              return;
          }
          if (this.magnifier)
            this.magnifier = this.PageNum !== 'end';
        },
        exitComicRead: function (end) {
          // 退出，如果是从结尾的 End 退出的执行 EndExit，否则跳至网页顶部
          document.body.style.overflow = 'auto';
          this.show = false;
          if (end) {
            this.PageNum = 0;
            this.EndExit();
          } else
            scrollTo(0, 0);
        },
        MouseMoveControl: function (event) {
          // 处理鼠标的移动和点击事件
          if (this.magnifier) {
            let magnifier = document.getElementById('magnifier');
            if (event.type === 'touchmove')
              event = event.changedTouches[0];
            magnifier.style.top = `${event.clientY > window.innerHeight / 2 ? event.clientY - window.innerHeight * 0.5 : event.clientY + window.innerHeight * 0.1 + 5}px`;
            magnifier.style.left = `${event.clientX > window.innerWidth / 2 ? event.clientX - window.innerWidth * 0.5 : event.clientX + window.innerWidth * 0.1 + 5}px`;
            magnifier.firstChild.style.marginTop = `-${event.clientY * 2 - window.innerHeight * 0.2}px`;
            magnifier.firstChild.style.marginLeft = `-${event.clientX * 2 - window.innerWidth * 0.2}px`;
            document.getElementById('scope').style.top = `${event.clientY - window.innerHeight * 0.1}px`;
            document.getElementById('scope').style.left = `${event.clientX - window.innerWidth * 0.1}px`;
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
        TouchControl: function (event) {
          // 处理手势
          const x = this.lastTouchmove.touches[0].clientX - event.changedTouches[0].clientX;
          const y = this.lastTouchmove.touches[0].clientY - event.changedTouches[0].clientY;
          if (Math.abs(x) > 10 && Math.abs(y) > 10 && Math.abs(x / y) < 1)
            this.scrollPage(y < 0);
          else
            document.getElementById('sidebar').className = x > 0 ? '' : 'show';
        },
        pageFill: function (type) {
          // 根据 type 返回或修改当前页所在 fillInfluence 的值。type 指调用方式，直接调用函数返回，否则修改
          if (this.PageNum === 'end')
            return false;
          if (this.ComicImgInfo.length === 0)
            this.updatedData();
          let i = this.ComicImgInfo[this.PageNum][0].index;
          while (i-- && !this.fillInfluence.hasOwnProperty(i));
          if (type) {
            this.fillInfluence[i] = !this.fillInfluence[i];
            this.updatedData();
          }
          else
            return this.fillInfluence[i];
        }
      },
      updated: function () {
        this.fillInfluence['now'] = this.pageFill();
        this.$nextTick(() => {
          scrollTo(0, getTop(document.querySelector(`#comicShow>[index='${this.PageNum}']`)));
        });
      }
    });
  }

  Object.assign(ComicReadWindow, Info);
  ComicReadWindow.fillInfluence[-1] = Info.readSetting['页面填充'];

  // 关闭记录滚动历史
  history.scrollRestoration = 'manual';
  // 在浏览器窗口大小改变时刷新
  window.onresize = ComicReadWindow.updatedData;
  // 键盘翻页
  document.onkeyup = (e) => {
    switch (e.keyCode) {
      case 32:
      case 37:
      case 40:
        ComicReadWindow.scrollPage(false);
        break;
      case 38:
      case 39:
        ComicReadWindow.scrollPage(true);
        break;
    }
  };

  ComicReadWindow.start = () => {
    document.body.style.overflow = 'hidden';
    ComicReadWindow.show = true;
    // 在所有图片加载完毕前，每隔一秒刷新一次
    let updated = () => {
      ComicReadWindow.updatedData();
      if (document.readyState !== 'complete')
        setTimeout(updated, 1000);
    };
    updated();
  };
};

/**
 * 加载构建 ScriptMenu
 * @param {Object} defaultUserSetting 默认设置
 */
let loadScriptMenu = function (defaultUserSetting) {
  if (typeof Vue === 'undefined')
    loadExternalScripts['Vue']();

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
      show: false
    },
    methods: {
      dragMoveStart: function (event) {
        let temp = document.getElementById('ScriptMenu').getBoundingClientRect();
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
      dragMove: function (event) {
        event.preventDefault();
        if (event.type === 'touchmove')
          event = event.changedTouches[0];
        // 不知道为什么，在拖动触发的最后一次 drag 事件里，event 里的鼠标位置移到了(0,0)，所以在这里加了个判断
        if (event.clientX || event.clientY) {
          this.top = event.clientY - this.offsetY;
          this.left = event.clientX - this.offsetX;
        }
      },
      saveUserSetting: function () {
        GM_setValue('UserSetting', JSON.stringify(this.UserSetting));
        this.show = false;
      },
      ResetUserSetting: function () {
        this.UserSetting = this.defaultUserSetting;
        GM_setValue('UserSetting', JSON.stringify(this.UserSetting));
        GM_notification('已恢复默认设置');
      }
    }
  });

  ScriptMenu.defaultUserSetting = defaultUserSetting;
  ScriptMenu.UserSetting = GM_getValue('UserSetting') ? JSON.parse(GM_getValue('UserSetting')) : defaultUserSetting;
  // 检查脚本版本，如果版本发生变化，将旧版设置移至新版设置
  if (!ScriptMenu.UserSetting.Version || ScriptMenu.UserSetting.Version !== GM_info.script.version) {
    ScriptMenu.UserSetting = Object.assign(defaultUserSetting, ScriptMenu.UserSetting);
    ScriptMenu.UserSetting.Version = GM_info.script.version;
    GM_setValue('UserSetting', JSON.stringify(ScriptMenu.UserSetting));
    GM_notification(`ComicRead 更新至 ${GM_info.script.version}`);
  }

  GM_registerMenuCommand('漫画阅读脚本设置', () => { ScriptMenu.show = true; });
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
  default: {
    window.onload = () => {
      GM_registerMenuCommand('进入简易漫画阅读模式', () => {
        if (typeof Vue === 'undefined') {
          const comicImgList = [...document.getElementsByTagName('img')].filter(e => e.height > 500 && e.width > 500);
          if(comicImgList.length === 0)
            alert('没有找到图片');
          else if (comicImgList.length !== new Set(comicImgList).length || confirm('该网页可能使用了懒加载技术，确认所有图片均已加载完毕？')) {
            loadComicReadWindow({
              'comicImgList': comicImgList,
              'readSetting': {
                'Enable': true,
                '双页显示': true,
                '页面填充': true,
                '点击翻页': false,
                '阅读进度': false,
                '夜间模式': false
              },
              'EndExit': () => { scrollTo(0, 0); },
              'comicName': document.title
            });
          }
        }
        ComicReadWindow.start();
      });
    };
  }
}
