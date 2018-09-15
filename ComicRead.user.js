// ==UserScript==
// @name      ComicRead
// @version     1.2
// @author      hymbz
// @description 阅读和设置
// @require     https://cdn.jsdelivr.net/npm/vue
// @require     https://cdnjs.cloudflare.com/ajax/libs/jszip/3.1.5/jszip.min.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/FileSaver.js/1.3.8/FileSaver.min.js
// ==/UserScript==
/* global GM_xmlhttpRequest, GM_setValue, GM_getValue, GM_addStyle, GM_info, Vue, JSZip, saveAs */

/**
 * 获取元素所在高度
 * @param {*} event 指定的元素
 * @returns {int} 元素所在高度
 */
let getTop = event => event.getBoundingClientRect().top + document.body.scrollTop + document.documentElement.scrollTop;

/**
 * 添加元素
 * @param {object} node 被添加元素
 * @param {(object|string)} textnode 添加元素
 */
let appendDom = function (node, textnode) {
  if (typeof textnode === 'string') {
    let temp = document.createElement('div');
    temp.innerHTML = textnode;
    let frag = document.createDocumentFragment();
    while (temp.firstChild)
      frag.appendChild(temp.firstChild);
    node.appendChild(frag);
  }
  else
    node.appendChild(textnode);
};

/**
 * 推送通知
 * @param {*} text 通知内容
 */
let showNotice = function (text) {
  if (Notification.permission === 'granted')
    new Notification('提醒', { body: text });
  else
    alert(text);
};
// 申请 Notification 的权限
if (window.Notification && Notification.permission === 'default') {
  Notification.requestPermission();
}

let comicReadWindow = new Vue({
  delimiters: ['[[', ']]'],
  data: {
    readSetting: {},
    show: false,
    ComicImgInfo: [],
    PageNum: 0,
    magnifier: false,
    lastTouchmove: {},
    nextChapter: null,
    prevChapter: null
  },
  methods: {
    updatedData: function () {
      // 处理图片
      const twoPageRatio = window.innerWidth / 2 / window.innerHeight;
      const onePageRatio = window.innerWidth / window.innerHeight;
      comicReadWindow.ComicImgInfo = [];
      let tempImgInfo = [];

      if (comicReadWindow.readSetting['双页显示'] && comicReadWindow.readSetting['页面填充'] && comicReadWindow.comicImgList[0].width / comicReadWindow.comicImgList[0].height < twoPageRatio) {
        tempImgInfo.push({
          'src': comicReadWindow.comicImgList[0].getAttribute('src'),
          'index': '填充',
          'class': 'fill'
        });
      }

      let i;
      for (i = 0; i < comicReadWindow.comicImgList.length; i++) {
        const imgRatio = comicReadWindow.comicImgList[i].width / comicReadWindow.comicImgList[i].height;
        let imgInfo = {
          'src': comicReadWindow.comicImgList[i].getAttribute('src'),
          'index': i,
          'class': ''
        };

        if (comicReadWindow.readSetting['双页显示'] && imgRatio < twoPageRatio) {
          if (tempImgInfo.length)
            comicReadWindow.ComicImgInfo.push([imgInfo, tempImgInfo.shift()]);
          else
            tempImgInfo.push(imgInfo);
        } else {
          if (tempImgInfo.length)
            comicReadWindow.ComicImgInfo.push([tempImgInfo.shift()]);
          imgInfo['class'] = imgRatio > onePageRatio ? 'long' : 'wide';
          comicReadWindow.ComicImgInfo.push([imgInfo]);
        }
      }

      if (tempImgInfo.length)
        comicReadWindow.ComicImgInfo.push([tempImgInfo.shift()]);

      let final = comicReadWindow.ComicImgInfo[comicReadWindow.ComicImgInfo.length - 1];
      if (comicReadWindow.readSetting['页面填充'] && final.length === 1 && !final[0].class) {
        final.unshift({
          'src': final[0].src,
          'index': '填充',
          'class': 'fill'
        });
      }
    },
    download: function () {
      // 下载漫画
      let zip = new JSZip();
      let comicDownloadNum = 0;
      let imgIndex = this.comicImgList.length;
      let downDom = document.querySelector('[tooltip^="下载"]');
      let downDomSvg = downDom.getElementsByTagName('path')[0];

      while (imgIndex--) {
        let tempIndex = imgIndex + 1;
        GM_xmlhttpRequest({
          method: 'GET',
          url: this.comicImgList[imgIndex].getAttribute('src'),
          headers: {
            referer: RegExp('(.+?/){2}').exec(this.comicImgList[imgIndex].getAttribute('src'))[0]
          },
          responseType: 'blob',
          onload: function (xhr, index = tempIndex) {
            if (xhr.status === 200) {
              zip.file(`${index}.${xhr.finalUrl.replace(/.+\./, '')}`, xhr.response);
              if (++comicDownloadNum === this.comicImgList.length) {
                downDom.setAttribute('tooltip', '下载完成');
                downDomSvg.setAttribute('d', 'M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM10 17l-3.5-3.5 1.41-1.41L10 14.17 15.18 9l1.41 1.41L10 17z');
                zip.generateAsync({ type: 'blob' }).then(function (content) {
                  saveAs(content, `${comicReadWindow.comicName}.zip`);
                });
              } else
                downDom.setAttribute('tooltip', `${comicDownloadNum}/${this.comicImgList.length}`);
            } else
              downDom.setAttribute('tooltip', '下载出错');
          }
        });
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
      // 退出，如果是从结尾的 End 退出的则跳至评论，否则跳至网页顶部
      if (this.EndExit) {
        document.body.style.overflow = 'auto';
        this.show = false;
        if (end) {
          this.PageNum = 0;
          this.EndExit();
        } else
          scrollTo(0, 0);
      }
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
    }
  },
  updated: function () {
    this.$nextTick(function () {
      scrollTo(0, getTop(document.querySelector(`#comicShow>[index='${this.PageNum}']`)));
    });
  }
});

/**
 * @param {Object} Info 相关信息
 * @param {Object} Info.comicImgList 漫画图片列表
 * @param {Object} Info.readSetting 相关的配置数据
 * @param {Object} Info.EndExit 点击结尾 End 退出时执行的操作
 * @param {string} Info.comicName 漫画标题，用于下载漫画时命名用
 * @param {string} Info.nextChapter 下一话链接
 * @param {string} Info.prevChapter 上一话链接
 */
comicReadWindow.load = function (Info) {
  Object.assign(this, Info);
  // 关闭记录滚动历史
  history.scrollRestoration = 'manual';

  GM_addStyle(`#comicRead{position:relative;z-index:999999;text-align:left}#comicShow{position:relative;top:0;left:0;padding-top:1rem;background-color:white}#comicShow [index]{display:flex;justify-content:center;width:100vw;height:100vh;margin:0}#comicShow [index] img{display:inline-block;width:auto;height:100%;vertical-align:middle;image-rendering:-webkit-optimize-contrast}#comicShow [index] img.long{width:100%;height:auto}#comicShow [index] img.fill{visibility:hidden}#comicShow [index='end']{font-weight:bold;line-height:60px;z-index:3;height:60px !important;margin:0 !important}#comicShow [index='end'] a{font-size:20px;position:absolute;color:var(--color1)}#comicShow [index='end'] a[title='退出']{font-size:40px}#comicShow [index='end'] a:first-child{left:40vw}#comicShow [index='end'] a:last-child{right:40vw}#sidebar{position:fixed;z-index:1;top:50vh;left:-40px;transition:left .6s;transform:translate(0, -50%)}#sidebar.show{left:0}#sidebar:not(.show) div::before,#sidebar:not(.show) div::after{content:none}#sidebar div{width:30px;height:30px;margin:10px;cursor:pointer;border-radius:15px;background-color:white}#sidebar div svg{position:relative;top:3px;left:3px;width:24px;height:24px;text-align:center;fill:#171717}#sidebar div[switch='true']{background-color:#171717}#sidebar div[switch='true'] svg{fill:white}#sidebar div:nth-last-of-type(3),#sidebar div:last-of-type{margin-top:5vh}#comicPage{position:fixed;top:50%;right:0;display:flex;flex-direction:column;flex-wrap:wrap-reverse;max-height:60vh;transform:translate(-50%, -50%)}#comicPage div{width:12px;height:12px;margin:5px;cursor:pointer;border:2px solid;border-color:#171717;border-radius:25px}#comicPage div.now,#comicPage div:hover{background-color:#171717}#magnifier{position:fixed;z-index:1;top:0;left:0;overflow:hidden;width:40vw;height:40vh;background:white;box-shadow:grey 0 6px 24px 4px}#magnifier div[index]{width:200vw;height:200vh}#magnifier #scope{position:fixed;width:20vw;height:20vh;border:2px dashed darkgrey}#comicRead.night #comicShow{background-color:#171717}#comicRead.night #comicPage div{border-color:white}#comicRead.night #comicPage div.now,#comicRead.night #comicPage div:hover{background-color:white}#comicRead.night #sidebar div{background-color:#171717}#comicRead.night #sidebar div svg{fill:white}#comicRead.night #sidebar div[switch='true']{background-color:white}#comicRead.night #sidebar div[switch='true'] svg{fill:#171717}#comicRead.night #magnifier{background:#171717}#comicRead.night [tooltip]:hover::after{color:black;background:#CCC;box-shadow:0 1em 2em -0.5em rgba(255,255,255,0.35)}#comicRead.night [tooltip][flow^='left']:hover::before{border-left-color:#CCC}#comicRead.night [tooltip][flow^='right']:hover::before{border-right-color:#CCC}[tooltip]{position:relative}[tooltip]:hover::before,[tooltip]:hover::after{font-size:.9em;line-height:1;position:absolute;display:block;user-select:none;text-transform:none;pointer-events:none}[tooltip]:hover::before{z-index:1001;content:'';border:5px solid transparent}[tooltip]:hover::after{font-family:Helvetica,sans-serif;z-index:1000;overflow:hidden;min-width:3em;max-width:21em;padding:1ch 1.5ch;content:attr(tooltip);text-align:center;white-space:nowrap;text-overflow:ellipsis;color:#FFF;border-radius:.3ch;background:#333;box-shadow:0 1em 2em -0.5em rgba(0,0,0,0.35)}[tooltip='']:hover::before,[tooltip='']:hover::after{display:none !important}[tooltip][flow^='left']:hover::before{top:50%;left:calc(0em - 5px);transform:translate(-0.5em, -50%);border-right-width:0;border-left-color:#333}[tooltip][flow^='left']:hover::after{top:50%;right:calc(100% + 5px);transform:translate(-0.5em, -50%)}[tooltip][flow^='right']:hover::before{top:50%;right:calc(0em - 5px);transform:translate(.5em, -50%);border-right-color:#333;border-left-width:0}[tooltip][flow^='right']:hover::after{top:50%;left:calc(100% + 5px);transform:translate(.5em, -50%)}`);
  appendDom(document.getElementsByTagName('body')[0], `<div id="comicRead" v-show="show" :class="readSetting['夜间模式']?'night':''"><div id="sidebar"><div v-if="!readSetting['双页显示'] || ComicImgInfo.some(e=>e.length>1)" flow="right" tooltip="双页显示" :switch="readSetting['双页显示']" @click="readSetting['双页显示']=!readSetting['双页显示'];updatedData()"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M3 5H1v16c0 1.1.9 2 2 2h16v-2H3V5zm18-4H7c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V3c0-1.1-.9-2-2-2zm0 16H7V3h14v14zm-4-4h-4v-2h2c1.1 0 2-.89 2-2V7c0-1.11-.9-2-2-2h-4v2h4v2h-2c-1.1 0-2 .89-2 2v4h6v-2z"/></svg></div><div v-else flow="right" tooltip="因窗口比例问题，无法双页显示" switch="false"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M3 5H1v16c0 1.1.9 2 2 2h16v-2H3V5zm18-4H7c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V3c0-1.1-.9-2-2-2zm0 16H7V3h14v14zm-4-4h-4v-2h2c1.1 0 2-.89 2-2V7c0-1.11-.9-2-2-2h-4v2h4v2h-2c-1.1 0-2 .89-2 2v4h6v-2z"/></svg></div><div flow="right" tooltip="页面填充" :switch="readSetting['页面填充']" @click="readSetting['页面填充']=!readSetting['页面填充'];updatedData()"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M9 7H7v2h2V7zm0 4H7v2h2v-2zm0-8c-1.11 0-2 .9-2 2h2V3zm4 12h-2v2h2v-2zm6-12v2h2c0-1.1-.9-2-2-2zm-6 0h-2v2h2V3zM9 17v-2H7c0 1.1.89 2 2 2zm10-4h2v-2h-2v2zm0-4h2V7h-2v2zm0 8c1.1 0 2-.9 2-2h-2v2zM5 7H3v12c0 1.1.89 2 2 2h12v-2H5V7zm10-2h2V3h-2v2zm0 12h2v-2h-2v2z"/></svg></div><div flow="right" tooltip="点击翻页" :switch="readSetting['点击翻页']" @click="readSetting['点击翻页']=!readSetting['点击翻页']"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M9 11.24V7.5C9 6.12 10.12 5 11.5 5S14 6.12 14 7.5v3.74c1.21-.81 2-2.18 2-3.74C16 5.01 13.99 3 11.5 3S7 5.01 7 7.5c0 1.56.79 2.93 2 3.74zm9.84 4.63l-4.54-2.26c-.17-.07-.35-.11-.54-.11H13v-6c0-.83-.67-1.5-1.5-1.5S10 6.67 10 7.5v10.74l-3.43-.72c-.08-.01-.15-.03-.24-.03-.31 0-.59.13-.79.33l-.79.8 4.94 4.94c.27.27.65.44 1.06.44h6.79c.75 0 1.33-.55 1.44-1.28l.75-5.27c.01-.07.02-.14.02-.2 0-.62-.38-1.16-.91-1.38z"/></svg></div><div flow="right" tooltip="阅读进度" :switch="readSetting['阅读进度']" @click="readSetting['阅读进度']=!readSetting['阅读进度']"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M22 13h-8v-2h8v2zm0-6h-8v2h8V7zm-8 10h8v-2h-8v2zm-2-8v6c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V9c0-1.1.9-2 2-2h6c1.1 0 2 .9 2 2zm-1.5 6l-2.25-3-1.75 2.26-1.25-1.51L3.5 15h7z"/></svg></div><div flow="right" tooltip="夜间模式" :switch="readSetting['夜间模式']" @click="readSetting['夜间模式']=!readSetting['夜间模式']"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M20 8.69V4h-4.69L12 .69 8.69 4H4v4.69L.69 12 4 15.31V20h4.69L12 23.31 15.31 20H20v-4.69L23.31 12 20 8.69zM12 18c-.89 0-1.74-.2-2.5-.55C11.56 16.5 13 14.42 13 12s-1.44-4.5-3.5-5.45C10.26 6.2 11.11 6 12 6c3.31 0 6 2.69 6 6s-2.69 6-6 6z"/></svg></div><div flow="right" tooltip="放大" @click="magnifier = !magnifier"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg></div><div flow="right" tooltip="下载" @click="download($event)"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM17 13l-5 5-5-5h3V9h4v4h3z"/></svg></div><div flow="right" tooltip="退出" @click="exitComicRead(false)"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg></div></div><div id="comicShow" v-if="ComicImgInfo.length" @dblclick="magnifier = !readSetting['点击翻页'] && !magnifier"@wheel.stop="scrollPage" @touchstart="lastTouchmove = $event;" @touchend="TouchControl"@click="MouseMoveControl" @mousemove.capture="MouseMoveControl" @touchmove="MouseMoveControl"><div v-for="(LineComicImg,pageNum) in ComicImgInfo" :index="pageNum"><img v-for="Img in LineComicImg" :src=Img.src :class="Img.class" :alt="Img.index"></div><div index="end"><a v-if="prevChapter" :href="prevChapter">上一话</a><a title="退出" href="javascript:;" @click="exitComicRead(true)">End</a><a v-if="nextChapter" :href="nextChapter">下一话</a></div><div id="magnifier" v-show="magnifier"><div :index="PageNum"><img v-for="Img in ComicImgInfo[PageNum]" :src=Img.src :class="Img.class" :alt="Img.index"></div><div id="scope"></div></div><div id="comicPage" v-if="readSetting['阅读进度']"><div v-for="(LineComicImg,pageNum) in ComicImgInfo" :class="pageNum===PageNum?'now':''" :tooltip="LineComicImg.map(e=>e.index).join('，')" flow="left" @click="PageNum=pageNum"></div></div></div></div>`);
  comicReadWindow.$mount('#comicRead');

  window.onresize = comicReadWindow.updatedData;
  document.onkeyup = function (e) {
    if([32,37,40].includes(e.keyCode))
      comicReadWindow.scrollPage(false);
    else if ([38,39].includes(e.keyCode))
      comicReadWindow.scrollPage(true);
  };
};

comicReadWindow.start = function () {
  document.body.style.overflow = 'hidden';
  comicReadWindow.show = true;
  // 在所有图片加载完毕前，每隔一秒刷新一次
  let updated = function () {
    comicReadWindow.updatedData();
    if (document.readyState !== 'complete')
      setTimeout(updated, 1000);
  };
  updated();
};


GM_addStyle(`#ScriptMenu{position:fixed;z-index:999;top:10vh;left:30vw;flex-wrap:wrap;width:40vw;height:45vh;border-radius:10px;background-color:var(--color1)}#ScriptMenu .SMtitle{flex-basis:100%;height:3em;cursor:move;color:#FFF}#ScriptMenu .SMtitle p{font-size:1.2em;font-weight:bold;padding:.75em 1em}#ScriptMenu .SMtitle svg{position:absolute;top:12px;right:2%;width:18px;height:17px;cursor:pointer;border-radius:4px;background-color:darkgray;fill:white}#ScriptMenu .SMtitle svg:hover{background-color:#20BBE4}#ScriptMenu .SMtab{float:left;width:15%;min-width:80px;height:95%;margin:0;padding:1em 0;text-align:right;border:1px var(--color1);border-bottom-style:solid;border-left-style:solid;background-color:var(--color2)}#ScriptMenu .SMtab ul{margin:0;padding:0}#ScriptMenu .SMtab ul li{line-height:33px;margin:0 10px;list-style:none;cursor:pointer;border-bottom:1px solid var(--color4)}#ScriptMenu .SMtab ul li.a{margin:-1px 0 0;padding:0 10px 0 9px;border-top:1px solid var(--color4);border-bottom-style:solid;background:var(--color3)}#ScriptMenu .SMtab ul li:first-of-type{border-top:1px solid var(--color4)}#ScriptMenu .SMtab a{line-height:35px;cursor:pointer}#ScriptMenu .SMconifg{line-height:1.6em;overflow:auto;height:95%;padding:2em 1.5em 0;text-align:left;border:1px var(--color1);border-right-style:solid;border-bottom-style:solid;background-color:var(--color3)}#ScriptMenu .SMconifg button{cursor:pointer;vertical-align:middle;color:#FFF !important;border:none;border-radius:5px;background-color:var(--color1);background-image:none}#ScriptMenu .SMconifg>div{margin-bottom:2em;padding:13px;border:1px solid black}#ScriptMenu .SMconifg>div p:first-child{width:max-content;margin-top:-23px;padding:0 4px;cursor:default;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;color:black;background-color:var(--color3);-webkit-touch-callout:none;-khtml-user-select:none}#ScriptMenu .SMconifg>div>div{display:inline-block;margin-right:2em}#ScriptMenu .SMconifg>div>div input{margin:.5em 0}#ScriptMenu .SMconifg>div.disabled{border-color:darkgray}#ScriptMenu .SMconifg>div.disabled p{color:darkgray}`);
appendDom(document.getElementsByTagName('body')[0], `<div id="ScriptMenu" :style="{top:top+'px',left:left+'px'}" v-if="show"><div class="SMtitle" draggable="true" @touchstart="dragMoveStart" @touchmove="dragMove" @dragstart="dragMoveStart" @drag="dragMove"><p>脚本设置</p><svg title="关闭" @click="saveUserSetting" viewBox="0 0 24 24"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg></div><div class="SMtab"><ul><li @click="showWindow = '功能设置'" :class="{a: showWindow == '功能设置'}">功能设置</li><li @click="showWindow = '其他'" :class="{a: showWindow == '其他'}">其他</li><li @click="showWindow = '关于'" :class="{a: showWindow == '关于'}">关于</li></ul></div><div class="SMconifg"><template v-if="showWindow == '功能设置'"><div v-for="(value, key) in UserSetting" v-if="key != 'Version'" :class="{disabled: !value.Enable}"><p @click="UserSetting[key].Enable = !UserSetting[key].Enable;">[[value.Enable?key:key+"(禁用)"]]</p><div v-for="(v, k) in value" v-if="value.Enable && k!=='Enable'"><template v-if="typeof v == 'boolean'"><input class="pc" type="checkbox" v-model="UserSetting[key][k]" checked="">[[k]]</template><template v-else>[[k]]：<input class="px" type="text" v-model.trim.lazy="UserSetting[key][k]"></template></div></div></template><template v-else-if="showWindow == '其他'"><button @click="ResetUserSetting"><strong>恢复默认设置</strong></button></template><template v-else-if="showWindow == '关于'"><p><strong>当前版本号：[[UserSetting.Version]]</strong><br><br><strong>Github地址——<a href="https://github.com/hymbz/YamiboScript" target="_blank">https://github.com/hymbz/YamiboScript</a></strong><br><strong>Greasy Fork地址——<a href="https://greasyfork.org/zh-CN/scripts?set=324713" target="_blank">https://greasyfork.org/zh-CN/scripts?set=324713</a></strong></strong></p></template></div></div>`);
let ScriptMenu = new Vue({
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
      showNotice('已恢复默认设置');
    }
  }
});

ScriptMenu.load = function (defaultUserSetting) {
  ScriptMenu.defaultUserSetting = defaultUserSetting;
  ScriptMenu.UserSetting = GM_getValue('UserSetting') ? JSON.parse(GM_getValue('UserSetting')) : defaultUserSetting;
  // 检查脚本版本，如果版本发生变化，将旧版设置移至新版设置
  if (!ScriptMenu.UserSetting.Version || ScriptMenu.UserSetting.Version !== GM_info.script.version) {
    ScriptMenu.UserSetting = Object.assign(defaultUserSetting, ScriptMenu.UserSetting);
    ScriptMenu.UserSetting.Version = GM_info.script.version;
    GM_setValue('UserSetting', JSON.stringify(ScriptMenu.UserSetting));
    showNotice('脚本更新完毕');
  }
};
