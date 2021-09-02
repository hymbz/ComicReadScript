// ==UserScript==
// @name      ComicRead
// @version     4.5
// @author      hymbz
// @description 为漫画站增加双页阅读模式并优化使用体验。百合会——「记录阅读历史，体验优化」、动漫之家——「看被封漫画，导出导入漫画订阅/历史记录」、ehentai——「匹配 nhentai 漫画、Tag」、nhentai——「彻底屏蔽漫画，自动翻页」、dm5、manhuagui、manhuadb、mangabz、copymanga。部分支持站点以外的网站，也可以使用简易阅读模式来双页阅读漫画。
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
    GM_addStyle('#comicRead{position:relative;z-index:999999;text-align:left}#comicShow{position:relative;top:0;left:0;padding-top:1rem;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;background-color:white}#comicShow:not(.scrollMode) [index]{display:flex;align-items:center;justify-content:center;width:100vw;height:100vh;margin:0}#comicShow:not(.scrollMode) [index] img{display:inline-block;width:auto;height:100%;vertical-align:middle;image-rendering:-webkit-optimize-contrast}#comicShow:not(.scrollMode) [index] img.long{position:absolute;width:100%;height:auto}#comicShow:not(.scrollMode) [index] img.fill{visibility:hidden}#comicShow [index="end"]{display:flex;justify-content:center;font-weight:bold;line-height:60px;z-index:3;height:60px !important;margin:0 !important}#comicShow [index="end"] a{font-size:20px;position:absolute;color:var(--color1)}#comicShow [index="end"] a[title="退出"]{font-size:40px}#comicShow [index="end"] a[title="上一话"]{left:40vw}#comicShow [index="end"] a[title="下一话"]{right:40vw}#comicShow.scrollMode img{max-width:95%;margin:2em auto;display:block}#comicShow.scrollMode .fill{display:none}#sidebar{width:auto;height:auto;background-color:transparent;display:block;position:fixed;z-index:1;top:50vh;left:-40px;transition:left .6s;transform:translate(0, -50%)}#sidebar.show{left:0}#sidebar:not(.show) div::before,#sidebar:not(.show) div::after{content:none}#sidebar div{width:30px;height:30px;margin:10px;cursor:pointer;border-radius:15px;background-color:white}#sidebar div svg{position:relative;top:3px;left:3px;width:24px;height:24px;text-align:center;fill:#171717}#sidebar div[switch="true"]{background-color:#171717}#sidebar div[switch="true"] svg{fill:white}#sidebar div:nth-last-of-type(3),#sidebar div:last-of-type{margin-top:5vh}#comicPage{position:fixed;top:50%;right:0;display:flex;flex-direction:column;flex-wrap:wrap-reverse;max-height:60vh;transform:translate(-50%, -50%)}#comicPage div{box-sizing:content-box;width:12px;height:12px;margin:5px;cursor:pointer;border:2px solid;border-color:#171717;border-radius:25px}#comicPage div.now,#comicPage div:hover{background-color:#171717}#magnifier{position:fixed;z-index:1;top:0;left:0;overflow:hidden;width:40vw;height:40vh;background:white;box-shadow:grey 0 6px 24px 4px}#magnifier div[index]{width:200vw;height:200vh}#magnifier #scope{position:fixed;width:20vw;height:20vh;border:2px dashed darkgrey}#comicRead.night #comicShow{background-color:#171717}#comicRead.night #comicPage div{border-color:white}#comicRead.night #comicPage div.now,#comicRead.night #comicPage div:hover{background-color:white}#comicRead.night #sidebar div{background-color:#171717}#comicRead.night #sidebar div svg{fill:white}#comicRead.night #sidebar div[switch="true"]{background-color:white}#comicRead.night #sidebar div[switch="true"] svg{fill:#171717}#comicRead.night #magnifier{background:#171717}#comicRead.night [tooltip]:hover::after{color:black;background:#CCC;box-shadow:0 1em 2em -0.5em rgba(255,255,255,0.35)}#comicRead.night [tooltip][flow^="left"]:hover::before{border-left-color:#CCC}#comicRead.night [tooltip][flow^="right"]:hover::before{border-right-color:#CCC}.hidden{display:none}[tooltip]{position:relative}[tooltip]:hover::before,[tooltip]:hover::after{font-size:.9em;line-height:1;position:absolute;display:block;user-select:none;text-transform:none;pointer-events:none}[tooltip]:hover::before{z-index:1001;content:"";border:5px solid transparent}[tooltip]:hover::after{font-family:Helvetica,sans-serif;z-index:1000;overflow:hidden;min-width:3em;max-width:21em;padding:1ch 1.5ch;content:attr(tooltip);text-align:center;white-space:nowrap;text-overflow:ellipsis;color:#FFF;border-radius:.3ch;background:#333;box-shadow:0 1em 2em -0.5em rgba(0,0,0,0.35)}[tooltip=""]:hover::before,[tooltip=""]:hover::after{display:none !important}[tooltip][flow^="left"]:hover::before{top:50%;left:calc(0em - 5px);transform:translate(-0.5em, -50%);border-right-width:0;border-left-color:#333}[tooltip][flow^="left"]:hover::after{top:50%;right:calc(100% + 5px);transform:translate(-0.5em, -50%)}[tooltip][flow^="right"]:hover::before{top:50%;right:calc(0em - 5px);transform:translate(.5em, -50%);border-right-color:#333;border-left-width:0}[tooltip][flow^="right"]:hover::after{top:50%;left:calc(100% + 5px);transform:translate(.5em, -50%)}');
    appendDom(document.body, `<div id="comicRead" v-show="show" :class="{night:readSetting['夜间模式']}" @wheel.stop="scrollPage"><div id="sidebar"><template v-if="readSetting['卷轴模式']"><div flow="right" tooltip="卷轴模式" switch="true" @click="switchScrollMode"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M0 0h24v24H0z" fill="none"/><path d="M2 21h19v-3H2v3zM20 8H3c-.55 0-1 .45-1 1v6c0 .55.45 1 1 1h17c.55 0 1-.45 1-1V9c0-.55-.45-1-1-1zM2 3v3h19V3H2z"/></svg></div></template><template v-else><div flow="right" tooltip="双页显示" :switch="readSetting['双页显示']" @click="readSetting['双页显示']=!readSetting['双页显示'];updatedData()"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M3 5H1v16c0 1.1.9 2 2 2h16v-2H3V5zm18-4H7c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V3c0-1.1-.9-2-2-2zm0 16H7V3h14v14zm-4-4h-4v-2h2c1.1 0 2-.89 2-2V7c0-1.11-.9-2-2-2h-4v2h4v2h-2c-1.1 0-2 .89-2 2v4h6v-2z"/></svg></div><div v-else flow="right" tooltip="因窗口或图片比例问题，无法切换双页显示" switch="false"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M3 5H1v16c0 1.1.9 2 2 2h16v-2H3V5zm18-4H7c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V3c0-1.1-.9-2-2-2zm0 16H7V3h14v14zm-4-4h-4v-2h2c1.1 0 2-.89 2-2V7c0-1.11-.9-2-2-2h-4v2h4v2h-2c-1.1 0-2 .89-2 2v4h6v-2z"/></svg></div><div flow="right" tooltip="卷轴模式" @click="switchScrollMode"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M0 0h24v24H0z" fill="none"/><path d="M2 21h19v-3H2v3zM20 8H3c-.55 0-1 .45-1 1v6c0 .55.45 1 1 1h17c.55 0 1-.45 1-1V9c0-.55-.45-1-1-1zM2 3v3h19V3H2z"/></svg></div><div flow="right" tooltip="页面填充" :switch="fillInfluence['now']" @click="pageFill"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M9 7H7v2h2V7zm0 4H7v2h2v-2zm0-8c-1.11 0-2 .9-2 2h2V3zm4 12h-2v2h2v-2zm6-12v2h2c0-1.1-.9-2-2-2zm-6 0h-2v2h2V3zM9 17v-2H7c0 1.1.89 2 2 2zm10-4h2v-2h-2v2zm0-4h2V7h-2v2zm0 8c1.1 0 2-.9 2-2h-2v2zM5 7H3v12c0 1.1.89 2 2 2h12v-2H5V7zm10-2h2V3h-2v2zm0 12h2v-2h-2v2z"/></svg></div><div flow="right" tooltip="点击翻页" :switch="readSetting['点击翻页']" @click="readSetting['点击翻页']=!readSetting['点击翻页']"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M9 11.24V7.5C9 6.12 10.12 5 11.5 5S14 6.12 14 7.5v3.74c1.21-.81 2-2.18 2-3.74C16 5.01 13.99 3 11.5 3S7 5.01 7 7.5c0 1.56.79 2.93 2 3.74zm9.84 4.63l-4.54-2.26c-.17-.07-.35-.11-.54-.11H13v-6c0-.83-.67-1.5-1.5-1.5S10 6.67 10 7.5v10.74l-3.43-.72c-.08-.01-.15-.03-.24-.03-.31 0-.59.13-.79.33l-.79.8 4.94 4.94c.27.27.65.44 1.06.44h6.79c.75 0 1.33-.55 1.44-1.28l.75-5.27c.01-.07.02-.14.02-.2 0-.62-.38-1.16-.91-1.38z"/></svg></div><div flow="right" tooltip="阅读进度" :switch="readSetting['阅读进度']" @click="readSetting['阅读进度']=!readSetting['阅读进度']"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M22 13h-8v-2h8v2zm0-6h-8v2h8V7zm-8 10h8v-2h-8v2zm-2-8v6c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V9c0-1.1.9-2 2-2h6c1.1 0 2 .9 2 2zm-1.5 6l-2.25-3-1.75 2.26-1.25-1.51L3.5 15h7z"/></svg></div></template><div flow="right" tooltip="夜间模式" :switch="readSetting['夜间模式']" @click="readSetting['夜间模式']=!readSetting['夜间模式']"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M20 8.69V4h-4.69L12 .69 8.69 4H4v4.69L.69 12 4 15.31V20h4.69L12 23.31 15.31 20H20v-4.69L23.31 12 20 8.69zM12 18c-.89 0-1.74-.2-2.5-.55C11.56 16.5 13 14.42 13 12s-1.44-4.5-3.5-5.45C10.26 6.2 11.11 6 12 6c3.31 0 6 2.69 6 6s-2.69 6-6 6z"/></svg></div><div flow="right" tooltip="放大" @click="magnifier = !magnifier"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg></div><div flow="right" tooltip="下载" @click="download"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM17 13l-5 5-5-5h3V9h4v4h3z"/></svg></div><div flow="right" tooltip="退出" @click="exitComicRead(false)"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg></div></div><div id="comicShow" v-if="ComicImgInfo.length && !readSetting['卷轴模式']":style="{backgroundColor:readSetting['背景颜色']}"@dblclick="magnifier = !readSetting['点击翻页'] && !magnifier"@touchstart="lastTouchmove = $event;" @touchend="TouchControl" @touchmove="MouseMoveControl"@click="MouseMoveControl" @mousemove.capture="MouseMoveControl"><div v-for="(LineComicImg,pageNum) in ComicImgInfo" :index="pageNum"><img v-for="Img in LineComicImg" :src=Img.src :class="Img.class" :alt="Img.index"></div><div index="end"><a title="上一话" href="javascript:;" v-if="prevChapter" @click="changeChapter(false)">上一话</a><a title="退出" href="javascript:;" @click="exitComicRead(true)">End</a><a title="下一话" href="javascript:;" v-if="nextChapter" @click="changeChapter(true)">下一话</a></div><div id="magnifier" v-show="magnifier"><div :index="PageNum"><img v-for="Img in ComicImgInfo[PageNum]" :src=Img.src :class="Img.class" :alt="Img.index"></div><div id="scope"></div></div><div id="comicPage" v-if="readSetting['阅读进度']"><div v-for="(LineComicImg,pageNum) in ComicImgInfo" :class="pageNum===PageNum?'now':''" :tooltip="LineComicImg.map(e=>e.index+1).join('，')" flow="left" @click="PageNum=pageNum"></div></div></div><div v-else id="comicShow" class="scrollMode":style="{backgroundColor:readSetting['背景颜色']}"@mousemove.capture="MouseMoveControl"><div v-for="(Img,index) in comicImgList" :index="index"><img :src=Img.src :alt="index"></div><div index="end"><a title="上一话" v-if="prevChapter" :href="prevChapter">上一话</a><a title="退出" href="javascript:;" @click="exitComicRead(true)">End</a><a title="下一话" v-if="nextChapter" :href="nextChapter">下一话</a></div></div></div>`);
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
    ComicReadWindow.show = true;
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

  GM_addStyle('#ScriptMenu{position:fixed;z-index:9999999;top:10vh;left:30vw;flex-wrap:wrap;width:40vw;height:45vh;color:black;border-radius:10px;background-color:var(--color1)}#ScriptMenu .SMtitle{flex-basis:100%;height:3em;cursor:move;color:#FFF}#ScriptMenu .SMtitle p{font-size:1.2em;font-weight:bold;padding:.75em 1em}#ScriptMenu .SMtitle svg{position:absolute;top:12px;right:2%;width:18px;height:17px;cursor:pointer;border-radius:4px;background-color:darkgray;fill:white}#ScriptMenu .SMtitle svg:hover{background-color:#20BBE4}#ScriptMenu .SMtab{float:left;width:15%;min-width:80px;height:95%;margin:0;padding:1em 0;text-align:right;border:1px var(--color1);border-bottom-style:solid;border-left-style:solid;background-color:var(--color2)}#ScriptMenu .SMtab ul{margin:0;padding:0}#ScriptMenu .SMtab ul li{line-height:33px;margin:0 10px;list-style:none;cursor:pointer;border-bottom:1px solid var(--color4)}#ScriptMenu .SMtab ul li.a{margin:-1px 0 0;padding:0 10px 0 9px;border-top:1px solid var(--color4);border-bottom-style:solid;background:var(--color3)}#ScriptMenu .SMtab ul li:first-of-type{border-top:1px solid var(--color4)}#ScriptMenu .SMtab a{line-height:35px;cursor:pointer}#ScriptMenu .SMconifg{line-height:1.6em;overflow:auto;height:95%;padding:2em 1.5em 0;text-align:left;border:1px var(--color1);border-right-style:solid;border-bottom-style:solid;background-color:var(--color3)}#ScriptMenu .SMconifg button{cursor:pointer;vertical-align:middle;color:#FFF !important;border:none;border-radius:5px;background-color:var(--color1);background-image:none}#ScriptMenu .SMconifg>div{margin-bottom:2em;padding:13px;border:1px solid}#ScriptMenu .SMconifg>div p:first-child{width:max-content;margin-top:-23px;padding:0 4px;cursor:default;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;background-color:var(--color3);-webkit-touch-callout:none;-khtml-user-select:none}#ScriptMenu .SMconifg>div>div{display:inline-block;margin-right:2em}#ScriptMenu .SMconifg>div>div input{margin:.5em 0}#ScriptMenu .SMconifg>div.disabled{border-color:darkgray}#ScriptMenu .SMconifg>div.disabled p{color:darkgray}');
  appendDom(document.body, `<div id="ScriptMenu" :style="{top:top+'px',left:left+'px'}" v-if="show"><div class="SMtitle" draggable="true" @touchstart="dragMoveStart" @touchmove="dragMove" @dragstart="dragMoveStart" @drag="dragMove"><p>脚本设置</p><svg title="关闭" @click="saveUserSetting" viewBox="0 0 24 24"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg></div><div class="SMtab"><ul><li @click="showWindow = '功能设置'" :class="{a: showWindow == '功能设置'}">功能设置</li><li @click="showWindow = '其他'" :class="{a: showWindow == '其他'}">其他</li><li @click="showWindow = '关于'" :class="{a: showWindow == '关于'}">关于</li></ul></div><div class="SMconifg"><template v-if="showWindow == '功能设置'"><div v-for="(value, key) in UserSetting" v-if="key != 'Version'" :class="{disabled: !value.Enable}"><p @click="UserSetting[key].Enable = !UserSetting[key].Enable;">[[value.Enable?key:key+"(禁用)"]]</p><div v-for="(v, k) in value" v-if="value.Enable && k!=='Enable'"><template v-if="typeof v == 'boolean'"><input class="pc" type="checkbox" v-model="UserSetting[key][k]" checked="">[[k]]</template><template v-else-if="k == '背景颜色'"><span>自定义背景颜色 </span><input type="color" v-model="UserSetting['漫画阅读']['背景颜色']" /><input v-model="UserSetting['漫画阅读']['背景颜色']" /></template><template v-else>[[k]]：<input class="px" type="text" v-model.trim.lazy="UserSetting[key][k]"></template></div></div></template><template v-else-if="showWindow == '其他'"><button @click="ResetUserSetting"><strong>恢复默认设置</strong></button></template><template v-else-if="showWindow == '关于'"><p><strong>当前版本号：[[UserSetting.Version]]</strong><br><br><strong>Github地址——<a href="https://github.com/hymbz/ComicReadScript" target="_blank">https://github.com/hymbz/ComicReadScript</a></strong><br><strong>Greasy Fork地址——<a href="https://greasyfork.org/zh-CN/scripts/374903-comicread" target="_blank">https://greasyfork.org/zh-CN/scripts/374903-comicread</a></strong></strong></p></template></div></div>`);
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
    


/* global fid, tid, ajaxget */
GM_addStyle(':root {--color1:#6E2B19;--color2:#FFEEBA;--color3:#FFF5D7;--color4:#DBC38C;} .lastReadTag{white-space:nowrap;border:2px solid var(--lastReadTagColor)}a.lastReadTag{font-weight:bold;margin-left:1em;padding:1px 4px;color:var(--lastReadTagColor);border-radius:6px 0 0 6px}a.lastReadTag:last-child{border-radius:6px}div.lastReadTag{display:initial;margin-left:-0.4em;padding:1px;color:#ffedbb;border-radius:0 6px 6px 0;background-color:var(--lastReadTagColor)}#threadlisttableid tbody:nth-child(2n) div.lastReadTag{color:#fff6d7}.tl th a:visited,.tl td.fn a:visited{color:#6E2B19}.tl .num{width:80px !important}.tc{display:flex;justify-content:center;margin:0}#fp-nav ul li .fp-tooltip{color:black}.header-tool.y{width:auto !important}');
loadScriptMenu('UserSetting', {
  记录阅读历史: {
    Enable: true,
    上次阅读进度标签颜色: '#6e2b19',
    保留天数: -1,
  },
  体验优化: {
    Enable: true,
    关闭快捷导航的跳转: true,
    修正点击页数时的跳转判定: true,
    固定导航条: true,
    自动进入漫画阅读模式: true,
  },
});


if (ScriptMenu.UserSetting['体验优化']['关闭快捷导航的跳转'])
  document.querySelector('#qmenu a').setAttribute('href', 'javascript:;');
if (ScriptMenu.UserSetting['体验优化']['固定导航条'])
  document.getElementsByClassName('header-stackup')[0].style.position = 'fixed';

// 判断当前页是帖子
if (RegExp('thread(-\\d+){3}|mod=viewthread').test(document.URL)) {
  // 启用漫画阅读模式
  if ((fid === 30 || fid === 37) && ScriptMenu.UserSetting['漫画阅读'].Enable) {
    // 有目录
    const hasMenu = Boolean(document.getElementById('threadindex'));

    /**
     * 对页面进行处理以启用漫画阅读模式
     *
     */
    const procImg = () => {
      const comicImgList = [...document.querySelectorAll('.t_fsz img')];
      let i = comicImgList.length;
      while (i--) {
        if (comicImgList[i].getAttribute('file'))
          comicImgList[i].setAttribute('src', comicImgList[i].getAttribute('file'));
        if (comicImgList[i].src.includes('static/image'))
          comicImgList.splice(i, 1);
        else if (comicImgList[i].getAttribute('src').indexOf('http') !== 0)
          comicImgList[i].setAttribute('src', `${location.protocol}//${location.host}/${comicImgList[i].getAttribute('src')}`);
      }

      if (!comicImgList.length)
        return;

      /**
       * 检查图片加载情况，顺便删掉宽高小于 500 像素的图片
       *
       * @param {boolean} [loop=false] 需要循环检测图片加载情况时为 True
       * @returns {boolean} 图片加载情况
       */
      const checkImgLoad = (loop = false) => {
        let i = comicImgList.length;
        const tempImgList = comicImgList;
        while (i--) {
          if (!tempImgList[i].complete) {
            if (loop) {
              setTimeout(checkImgLoad, 300, true);
              return;
            }
            return false;
          } else if (tempImgList[i].height < 500 && tempImgList[i].width < 500)
            comicImgList.splice(i, 1);
        }
        if (loop)
          document.getElementById('comicReadMode').click();
        else
          return true;
      };

      if (ScriptMenu.UserSetting['体验优化']['自动进入漫画阅读模式'])
        setTimeout(checkImgLoad, 0, true);

      appendDom(document.querySelector('div.pti > div.authi'), '<span class="pipe show">|</span><a id="comicReadMode" class="show" href="javascript:;">漫画阅读</a>');
      document.getElementById('comicReadMode').addEventListener('click', event => {
        event.stopImmediatePropagation();
        if (hasMenu || ComicReadWindow === undefined) {
          loadComicReadWindow({
            comicImgList,
            readSetting: ScriptMenu.UserSetting['漫画阅读'],
            EndExit: () => scrollTo(0, getTop(document.getElementsByClassName('psth').length ? document.getElementsByClassName('psth')[0] : [...document.querySelectorAll('.pcb>div:first-of-type')].find(e => e.clientHeight < 2000))),
            comicName: document.getElementById('thread_subject').innerHTML,
          });

          // 通过标签确定上/下一话
          if (document.querySelector('.ptg.mbm.mtn>a')) {
            const findNext = (pageNum) => {
              GM_xmlhttpRequest({
                method: 'GET',
                url: `https://bbs.yamibo.com/misc.php?mod=tag&id=${document.querySelector('.ptg.mbm.mtn>a').href.split('id=')[1]}&type=thread&page=${pageNum}`,
                onload: (data) => {
                  const reg = /<th>\s<a href="thread-(\d+)(?=-)/g;
                  let nowTid;
                  let lastTid;
                  while ((nowTid = reg.exec(data.responseText)) !== null) {
                    if (lastTid && Number(nowTid[1]) === tid) {
                      ComicReadWindow.prevChapter = `thread-${lastTid}-1-1.html`;
                      ComicReadWindow.nextChapter = (nowTid = reg.exec(data.responseText)) === null ? null : `thread-${nowTid[1]}-1-1.html`;
                      break;
                    } else
                      lastTid = nowTid[1];
                  }
                  if (!ComicReadWindow.prevChapter)
                    findNext(pageNum + 1);
                },
              });
            };
            findNext(1);
          }
        }
        if (checkImgLoad() || confirm('图片未加载完毕，确认要直接进入阅读模式？'))
          ComicReadWindow.start();
      });
    };
    procImg();

    // 适配有目录的帖子
    if (hasMenu) {
      const adaptationMenu = () => {
        [...document.querySelectorAll('#threadindex li')].forEach(e => {
          e.addEventListener('click', () => {
            e.onclick = null;
            ajaxget(...e.getAttribute('onclick').match(/'.+?'/g).map(e => e.slice(1, -1)), '', 'block', setTimeout(() => {
              adaptationMenu();
              procImg();
            }, 1000));
          });
        });
      };
      adaptationMenu();
    }
  }


  // 启用记录阅读进度
  if (ScriptMenu.UserSetting['记录阅读历史'].Enable) {
    let lastFloor;

    GM_xmlhttpRequest({
      method: 'GET',
      url: `https://bbs.yamibo.com/api/mobile/index.php?module=viewthread&tid=${tid}`,
      onload: (data) => {
        const json = JSON.parse(data.responseText);
        lastFloor = json.Variables.thread.allreplies;
      },
    });

    // 在关闭和切换标签页时重新储存数据
    document.addEventListener('visibilitychange', () => {
      if (!document.visible && document.body.style.overflow !== 'hidden') {
        const anchorList = [...document.querySelectorAll('[id^=pid]')];
        const {scrollTop} = document.documentElement;
        while (getTop(anchorList[0]) < scrollTop)
          anchorList.shift();

        GM_setValue(tid, JSON.stringify({
          page: document.querySelector('#pgt strong') ? document.querySelector('#pgt strong').innerHTML : '1',
          lastFloor,
          lastAnchor: anchorList[0].id,
          time: new Date().getTime(),
        }));
      }
    });
  }

} else if (RegExp('forum(-\\d+){2}|mod=forumdisplay').test(document.URL)) {
  // 判断当前页是板块

  // 启用记录阅读进度
  if (ScriptMenu.UserSetting['记录阅读历史'].Enable) {
    GM_addStyle(`:root {--lastReadTagColor: ${ScriptMenu.UserSetting['记录阅读历史']['上次阅读进度标签颜色']}!important;}`);

    let custodyTime = 0;
    if (ScriptMenu.UserSetting['记录阅读历史']['保留天数'] !== -1)
      custodyTime = new Date().getTime() - (ScriptMenu.UserSetting['记录阅读历史']['保留天数'] * 24 * 60 * 60 * 1000);

    // 添加上次阅读进度提示标签
    const addLastReadTag = () => {
      if (document.getElementById('autopbn').text === '下一页 »') {
        let List = document.getElementsByClassName('lastReadTag');
        let i = List.length;
        while (i--)
          List[i].parentNode.removeChild(List[i]);

        List = document.querySelectorAll('tbody[id^=normalthread]');
        i = List.length;
        while (i--) {
          const tid = List[i].id.split('_')[1];
          if (GM_getValue(tid)) {
            const lastReadInfo = JSON.parse(GM_getValue(tid));
            if (lastReadInfo.time < custodyTime) {
              // 删除超过保留天数的阅读记录
              GM_deleteValue(List[i]);
            } else {
              const lastReplies = List[i].querySelector('.num a').innerHTML - lastReadInfo.lastFloor;
              appendDom(List[i].getElementsByTagName('th')[0], `
                <a href="thread-${tid}-${lastReadInfo.page}-1.html#${lastReadInfo.lastAnchor}"
                 class="lastReadTag" onclick="atarget(this)">回第${lastReadInfo.page}页</a>
                ${lastReplies ? `<div class="lastReadTag">+${lastReplies}</div>` : ''}
              `);
            }
          }
        }
      } else
        setTimeout(addLastReadTag, 100);
    };
    addLastReadTag();

    // 切换回当前页时重新添加提示标签
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden)
        addLastReadTag();
    });

    // 点击下一页后添加提示标签
    document.getElementById('autopbn').addEventListener('click', addLastReadTag);
  }

  if (ScriptMenu.UserSetting['体验优化']['修正点击页数时的跳转判定']) {
    const List = document.querySelectorAll('.tps>a');
    let i = List.length;
    while (i--)
      List[i].setAttribute('onclick', 'atarget(this)');
  }

}


;
    break;
  }
  case 'www.yamibo.com': {
    


// $('body').unbind();
document.getElementsByTagName('html')[0].style.overflowX = 'visible';
const List = document.getElementsByClassName('dropdown');
let i = List.length;
while (i--) {
  List[i].addEventListener('mouseenter', (e) => {
    e.currentTarget.className += ' open';
  });
  List[i].addEventListener('mouseleave', (e) => {
    e.currentTarget.className = e.currentTarget.className.split(' open')[0];
  });
}

GM_addStyle(':root {--color1:#551200;--color2:#FCF8E3;--color3:#F7F5F0;--color4:#BBB;}');
loadScriptMenu('NewYamiboUserSetting', {
  体验优化: {
    Enable: true,
    自动进入漫画阅读模式: true,
  },
});

// 判断当前页是漫画内容
if (document.URL.includes('view-chapter') && ScriptMenu.UserSetting['漫画阅读'].Enable) {
  const imgList = [];
  const id = RegExp('id=(\\d+)').exec(document.URL)[1] - 0;
  const nowIndex = document.querySelector('ul.pagination > li:last-of-type > input').value - 0;
  const finalIndex = document.querySelector('section div:first-of-type div:last-of-type').innerHTML.trim().split('：')[1] - 0;

  appendDom(
    document.querySelector('div.col-md-6.col-xs-12.pull-left'),
    '<button type="button" id="comicReadMode" class="btn btn-sm btn-yuri disabled"><i class="fa fa-book"></i> 漫画阅读</button>'
  );
  const comicReadMode = document.getElementById('comicReadMode');
  comicReadMode.addEventListener('click', () => {
    if (!document.getElementById('comicReadMode').className.includes('disabled'))
      ComicReadWindow.start();
  });

  for (let i = 1; i <= finalIndex; i++) {
    const index = i;
    if (index === nowIndex) {
      imgList.push({
        i: index,
        src: document.getElementById('imgPic').src,
      });
    } else {
      GM_xmlhttpRequest({
        method: 'GET',
        url: `https://www.yamibo.com/manga/view-chapter?id=${id}&page=${index}`,
        onload: (xhr) => {
          if (xhr.status === 200) {
            imgList.push({
              i: index,
              src: RegExp('<img id="imgPic".+="(.+?)".+>').exec(xhr.responseText)[1],
            });
            if (imgList.length === finalIndex) {
              loadComicReadWindow({
                comicImgList: imgList.sort((a, b) => a.i - b.i).map((e) => {
                  const temp = document.createElement('div');
                  temp.innerHTML = `<img id="imgPic" class="img-responsive" src="${e.src}" alt="">`;
                  return temp.firstChild;
                }),
                readSetting: ScriptMenu.UserSetting['漫画阅读'],
                EndExit: () => scrollTo(0, getTop(document.getElementById('w1'))),
                comicName: `${document.querySelector('ul.breadcrumb > li:nth-child(4) > a').innerHTML} ${document.getElementsByTagName('h3')[0].innerHTML}`,
                nextChapter: document.getElementById('btnNext') ? document.getElementById('btnNext').href : null,
                prevChapter: document.getElementById('btnPrev') ? document.getElementById('btnPrev').href : null,
              });
              document.getElementById('comicReadMode').className = 'btn btn-sm btn-yuri';
              if (ScriptMenu.UserSetting['体验优化']['自动进入漫画阅读模式'])
                ComicReadWindow.start();
            }
          }
        },
      });
    }
  }
}



;
    break;
  }
  case 'i.dmzj.com':
  case 'm.dmzj.com':
  case 'manhua.dmzj.com': {
    


/* global qiehuan, huPoint, g_comic_name, g_chapter_name, g_comic_id, g_comic_url, userId, ___json___ */
GM_addStyle(':root {--color1: #05a7ca;--color2: #f8fcff;--color3: #ffffff;--color4: #aea5a5;}');

loadScriptMenu('DMZJUserSetting', {
  体验优化: {
    Enable: true,
    阅读被封漫画: true,
    在新页面中打开链接: true,
    解除吐槽的字数限制: true,
    优化网页右上角用户信息栏的加载: true,
    自动进入漫画阅读模式: true,
  },
});

switch (location.hostname) {
  case 'manhua.dmzj.com': {
    window.addEventListener('load', () => {
      if (typeof ___json___ !== 'undefined' && ScriptMenu.UserSetting['体验优化']['优化网页右上角用户信息栏的加载'] && ___json___.result !== true) {
        GM_xmlhttpRequest({
          method: 'GET',
          url: 'https://user.dmzj.com/passport/message',
          onload (xhr) {
            eval(xhr.responseText.slice(4));
            document.querySelector('script[src="https://user.dmzj.com/passport/message"]').onreadystatechange();
          },
        });
      }
    });

    if (document.title === '页面找不到') {
      const [, comicName, g_current_id] = location.pathname.split('/');
      GM_xmlhttpRequest({
        method: 'GET',
        url: `https://manhua.dmzj.com/${comicName}`,
        onload: (xhr) => {
          if (xhr.status === 200) {
            self.location.href = `https://m.dmzj.com/view/${RegExp('g_current_id = "(\\d+)').exec(xhr.responseText)[1]}/${g_current_id.split('.')[0]}.html`;
          }
        },
      });
    } if (location.pathname.includes('/tags/')) {
      // 判断进入作者页
      GM_xmlhttpRequest({
        method: 'GET',
        url: document.querySelector('a.rss').href,
        onload: (xhr) => {
          if (xhr.status === 200) {
            const raw = xhr.responseText;
            // 页面上原有的漫画吧标题
            const titleList = [...document.querySelectorAll('#hothit p.t')].map(e => e.innerText.replace('[完]', ''));
            const data = raw
              .split('item')
              .filter((a, i) => i % 2)
              .map(item => {
                const title = /title><!\[CDATA\[(.+?)]]/.exec(item)[1];
                const imgUrl = /<img src='(.+?)'/.exec(item)[1];
                const newComicUrl = /manhua.dmzj.com\/(.+?)\?from=rssReader/.exec(item)[1];
                const newComicTitle = /title='(.+?)'/.exec(item)[1];
                const comicUrl = newComicUrl.split('/')[0];
                return {
                  title,
                  comicUrl,
                  imgUrl,
                  newComicUrl,
                  newComicTitle,
                };
              })
              .filter(({title}) => !titleList.includes(title));
            appendDom(document.getElementById('hothit'), data.map(({
              title,
              comicUrl,
              imgUrl,
              newComicUrl,
              newComicTitle,
            }) => `
              <div class="pic">
                <a href="/${comicUrl}/" target="_blank">
                <img src="${imgUrl}" alt="${title}" title="" style="">
                <p class="t">* ${title}</p></a>
                <p class="d">最新：<a href="/${newComicUrl}" target="_blank">${newComicTitle}</a></p>
              </div>`));
          }
        },
      });
    } else {
      // 判断当前页是漫画详情页
      if (typeof g_chapter_name === 'undefined') {
        GM_addStyle('#floatCode,.toppic_content+div:not(.wrap),#type_comics+a,icorss_acg{display: none !important;}.cartoon_online_border>img{transform: rotate(180deg);}');

        // 判断当前页是漫画页
        if (typeof g_comic_name !== 'undefined') {
          // 判断漫画被禁
          if (ScriptMenu.UserSetting['体验优化']['阅读被封漫画'] && document.querySelector('.cartoon_online_border>img')) {
            [...document.querySelectorAll('.odd_anim_title ~ div')].forEach(e => e.parentNode.removeChild(e));

            GM_xmlhttpRequest({
              method: 'GET',
              url: `https://api.dmzj.com/dynamic/comicinfo/${g_comic_id}.json`,
              onload: (xhr) => {
                if (xhr.status === 200) {
                  let temp = '';
                  const Info = JSON.parse(xhr.responseText).data;
                  const last_updatetime = Info.info.last_updatetime;
                  //for (let i = 0; i < chapters.length; i++) {
                    temp = `${temp}<div class="photo_part"><div class="h2_title2"><span class="h2_icon h2_icon22"></span><h2>${Info.info.title}</h2></div></div><div class="cartoon_online_border" style="border-top: 1px dashed #0187c5;"><ul>`;
                    const chaptersList = Info.list;
                    {
                      let i = chaptersList.length;
                      while (i--)
                        temp = `${temp}<li><a target="_blank" title="${chaptersList[i].chapter_name}" href="https://manhua.dmzj.com/${g_comic_url}${chaptersList[i].id}.shtml" ${chaptersList[i].updatetime === last_updatetime ? 'class="color_red"' : ''}>${chaptersList[i].chapter_name}</a></li>`;
                    }
                    temp = `${temp}</ul><div class="clearfix"></div></div>`;
                  //}
                  appendDom(document.getElementsByClassName('middleright_mr')[0], temp);
                }
              },
            });
          } else if (ScriptMenu.UserSetting['体验优化']['在新页面中打开链接'])
            [...document.querySelectorAll('a:not([href^="javascript:"])')].forEach(e => e.setAttribute('target', '_blank'));
        }
      } else {
        if (ScriptMenu.UserSetting['漫画阅读'].Enable) {
          GM_addStyle(`${JSON.parse(GM_getResourceText('DMZJcss')).sections[0].code}.mainNav{display:none !important}body.day{background-color:white !important}body.day .header-box{background-color:#DDD !important;box-shadow:0 1px 2px white}body.day .comic_gd_fb .gd_input{color:#666;background:white}`);
          if (!ScriptMenu.UserSetting['漫画阅读']['夜间模式'])
            document.body.className = 'day';

          // 切换至上下翻页阅读
          if ($.cookie('display_mode') === '0')
            qiehuan();

          const List = document.querySelectorAll('.inner_img img');
          let i = List.length;
          while (i--)
            if (List[i].getAttribute('data-original'))
              List[i].setAttribute('src', List[i].getAttribute('data-original'));

          const comicReadMode = document.querySelector('.btns a:last-of-type');
          comicReadMode.innerHTML = '阅读模式';
          comicReadMode.setAttribute('href', 'javascript:;');
          comicReadMode.removeAttribute('target');
          comicReadMode.onclick = () => {
            if (typeof ComicReadWindow === 'undefined') {
              loadComicReadWindow({
                comicImgList: List,
                readSetting: ScriptMenu.UserSetting['漫画阅读'],
                EndExit: () => {
                  huPoint();
                  scrollTo(0, getTop(document.getElementById('hd')));
                },
                comicName: `${g_comic_name} ${g_chapter_name}`,
                nextChapter: document.getElementById('next_chapter') ? `${document.getElementById('next_chapter').href}` : null,
                prevChapter: document.getElementById('prev_chapter') ? `${document.getElementById('prev_chapter').href}` : null,
              });
            }
            ComicReadWindow.start();
          };
          if (ScriptMenu.UserSetting['体验优化']['自动进入漫画阅读模式'])
            document.addEventListener('DOMContentLoaded', setTimeout(comicReadMode.onclick, 0));
        }
        // 修改发表吐槽的函数，删去字数判断。只是删去了原函数的一个判断条件而已，所以将这段压缩了一下
        if (ScriptMenu.UserSetting['体验优化']['解除吐槽的字数限制']) {
          const intervalID = setInterval(() => {
            if (!unsafeWindow.addpoint)
              return;
            clearInterval(intervalID);
            // eslint-disable-next-line
            unsafeWindow.addpoint = function () { const e = $('#gdInput').val(); const c = $('input[name=length]').val(); if (e == '') { alert('沉默是你的个性，但还是吐个槽吧！'); return false; } else { if ($.trim(e) == '') { alert('空寂是你的个性，但还是吐个槽吧！'); return false; } } const d = $('#suBtn'); const b = d.attr('onclick'); const a = d.html(); d.attr('onclick', '').html('发表中..').css({ 'background': '#eee', 'color': '#999', 'cursor': 'not-allowed' }); if (is_login) { $.ajax({ type: 'get', url: `${comicUrl}/api/viewpoint/add`, dataType: 'jsonp', jsonp: 'callback', jsonpCallback: 'success_jsonpCallback_201508281119', data: `type=${type}&type_id=${comic_id}&chapter_id=${chapter_id}&uid=${uid}&nickname=${nickname}&title=${encodeURIComponent(e)}`, success: function (f) { if (f.result == 1000) { $('#gdInput').val(''); if ($('#moreLi').length > 0) { $('#moreLi').before(`<li><a href="javascript:;"  class="c9 said" onclick="clickZ($(this));clickY($(this))"  vote_id="${f.data.id}"  >${e}</a></li>`); } else { $('#tc').hide(); if (c == undefined) { $('.comic_gd_li').append(`<li><a href="javascript:;"  class="c0 said" onclick="clickZ($(this));clickY($(this))"  vote_id="${f.data.id}" >${e}</a></li>`); } else { if (c > 9) { $('.comic_gd_li').append(`<li><a href="javascript:;"  class="c9 said" onclick="clickZ($(this));clickY($(this))"  vote_id="${f.data.id}" >${e}</a></li>`); } else { $('.comic_gd_li').append(`<li><a href="javascript:;"  onclick="clickZ($(this));clickY($(this))" class="c${c} said"    vote_id="${f.data.id}">${e}</a></li>`); } } } alert('吐槽成功'); } else { if (f.result == 2001) { $('body').append(zcHtml); zcClick(); } else { alert(f.msg); } } d.attr({ 'onclick': b, 'style': '' }).html(a); } }); } };
          }, 2000);
        }
      }
    }
    break;
  }
  case 'm.dmzj.com': {
    if (ScriptMenu.UserSetting['体验优化']['阅读被封漫画']) {
      // 分别处理目录页和漫画页
      switch (location.pathname.split('/')[1]) {
        case 'info': {
          if (typeof obj_id === 'undefined') {
            const comicId = parseInt(location.pathname.split('/')[2]);
            if (isNaN(comicId)) {
              document.body.innerHTML = '请从 <a href="https://dmzj.nsapps.cn/">https://dmzj.nsapps.cn/</a> 搜索漫画进入';
            } else {
              GM_xmlhttpRequest({
                method: 'GET',
                url: `http://v3api.dmzj.com/comic/comic_${comicId}.json`,
                onload: (xhr) => {
                  if (xhr.status === 200) {
                    try {
                      let temp = '';
                      const Info = JSON.parse(xhr.responseText);
                      const {chapters, last_updatetime} = Info;
                      for (let i = 0; i < chapters.length; i++) {
                        temp += `<h2>${Info.title}：${chapters[i].title}</h2>`;
                        const chaptersList = chapters[i].data;
                        {
                          let i = chaptersList.length;
                          while (i--)
                            temp += `<a target="_blank" title="${chaptersList[i].chapter_title}" href="https://m.dmzj.com/view/${comicId}/${chaptersList[i].chapter_id}.html" ${chaptersList[i].updatetime === last_updatetime ? 'style="color:red"' : ''}>${chaptersList[i].chapter_title}</a>`;
                        }
                      }
                      appendDom(document.body, temp);
                    } catch (error) {
                      if (error.name !== 'SyntaxError')
                        throw error;
                      appendDom(document.body, xhr.responseText);
                    }
                  }
                },
              });
              document.body.removeChild(document.body.childNodes[0]);
              GM_addStyle('body{padding:0 20vw;} a{margin:0 1em;line-height:2em;white-space:nowrap;display:inline-block;min-width:4em;}');
            }
          }
          break;
        }
        case 'view': {
          if (unsafeWindow.comic_id) {
            GM_addStyle('.subHeader{display:none !important}');
            const comicImgList = [...document.querySelectorAll('#commicBox img')]
              .map(img => {
                img.setAttribute('src', img.getAttribute('data-original'));
                return img;
              });
            loadComicReadWindow({
              comicImgList,
              readSetting: ScriptMenu.UserSetting['漫画阅读'],
              comicName: document.title,
              nextChapter: unsafeWindow.mReader.nextBtnAction,
              prevChapter: unsafeWindow.mReader.prevBtnAction,
            });
            ComicReadWindow.start();
          } else {
            GM_addStyle('body{display:flex;margin:0;flex-direction:column;align-items:center}body.hide img{display:none}img{max-width:95%;margin:1em 0}#comicRead{order:9999}');
            if (ScriptMenu.UserSetting['漫画阅读']['夜间模式']) {
              document.body.style.backgroundColor = '#171717';
              document.body.style.color = '#fff';
            }
            document.body.removeChild(document.body.childNodes[0]);
            document.body.className = 'hide';
            const loadText = document.createElement('p');
            loadText.innerText = '正在加载中，请坐和放宽，若长时间无反应请刷新页面';
            document.body.appendChild(loadText);
            GM_xmlhttpRequest({
              method: 'GET',
              url: `http://v3api.dmzj.com/chapter/${/\d+\/\d+/.exec(document.URL)[0]}.json`,
              onload: (xhr) => {
                if (xhr.status === 200) {
                  let Info;
                  try {
                    Info = JSON.parse(xhr.responseText);
                    document.title = Info.title;
                    const blobList = [];
                    let loadImgNum = 0;
                    let imgTotalNum = Info.picnum;

                    if (imgTotalNum) {
                      const loadImg = (index) => {
                        const i = index;
                        GM_xmlhttpRequest({
                          method: 'GET',
                          url: Info.page_url[i],
                          headers: {Referer: 'http://images.dmzj.com/'},
                          responseType: 'blob',
                          onload: (xhr) => {
                            if (xhr.status === 200) {
                              blobList[i] = [xhr.response, xhr.finalUrl.split('.').pop()];
                              if (++loadImgNum === imgTotalNum) {
                                const tempDom = document.createDocumentFragment();
                                for (let i = 0; i < imgTotalNum; i++)
                                  appendDom(tempDom, `<img src="${URL.createObjectURL(blobList[i][0])}">`);
                                document.body.appendChild(tempDom);
                                // 等待图片全部加载完毕在进行其他操作
                                const checkLoad = () => {
                                  const imgList = [...document.getElementsByTagName('img')];
                                  if (imgList.every(e => e.complete)) {
                                    document.body.removeChild(loadText);
                                    loadComicReadWindow({
                                      comicImgList: imgList,
                                      readSetting: ScriptMenu.UserSetting['漫画阅读'],
                                      comicName: document.title,
                                      blobList,
                                    });
                                    ComicReadWindow.start();
                                    document.body.className = '';
                                    GM_registerMenuCommand('进入漫画阅读模式', ComicReadWindow.start);
                                  } else
                                    setTimeout(checkLoad, 100);
                                };
                                setTimeout(checkLoad, 100);
                              } else
                                loadText.innerText = `正在加载中，请坐和放宽，若长时间无反应请刷新页面。目前已加载${loadImgNum}/${imgTotalNum}`;
                            } else
                              loadImg(i);
                          },
                        });
                      };
                      let i = Info.picnum;
                      while (i--)
                        loadImg(i);
                    } else {
                      loadText.innerText = '正常接口未返回具体图片数据，开始通过下载接口获取数据';
                      GM_xmlhttpRequest({
                        method: 'GET',
                        responseType: 'blob',
                        url: `https://imgzip.dmzj.com/s/${/\d+\/\d+/.exec(document.URL)[0]}.zip`,
                        onload: (xhr) => {
                          if (xhr.status === 200) {
                            if (typeof JSZip === 'undefined') {
                              loadExternalScripts.JSZip();
                            }
                            const zip = new JSZip();
                            const tempDom = document.createDocumentFragment();
                            zip.loadAsync(xhr.response).then(zip => {
                              loadText.innerText = '解压中';
                              imgTotalNum = Object.keys(zip.files).length;
                              let imgNum = 0;
                              Object.values(zip.files).forEach((zipData) => {
                                const order = zipData.name.split('.')[0];
                                zipData.async('blob').then(imgBlob => {
                                  appendDom(tempDom, `<img order=${order} src="${URL.createObjectURL(imgBlob)}">`);
                                  imgNum += 1;
                                  if (imgNum === imgTotalNum) {
                                    document.body.appendChild(tempDom);
                                    // 等待图片全部加载完毕在进行其他操作
                                    const checkLoad = () => {
                                      const imgList = [...document.getElementsByTagName('img')]
                                        .sort((a, b) => Number(a.getAttribute('order')) - b.getAttribute('order'));
                                      if (imgList.every(e => e.complete)) {
                                        document.body.removeChild(loadText);
                                        loadComicReadWindow({
                                          comicImgList: imgList,
                                          readSetting: ScriptMenu.UserSetting['漫画阅读'],
                                          comicName: document.title,
                                          blobList,
                                        });
                                        ComicReadWindow.start();
                                        document.body.className = '';
                                        GM_registerMenuCommand('进入漫画阅读模式', ComicReadWindow.start);
                                      } else
                                        setTimeout(checkLoad, 100);
                                    };
                                    setTimeout(checkLoad, 100);
                                  }
                                });
                              });
                            });
                          }
                        },
                      });
                    }

                  } catch (error) {
                    loadText.innerText = xhr.responseText;
                  }
                }
              },
            });
          }
          break;
        }
      }
    }
    break;
  }
  case 'i.dmzj.com': {

    /**
     * 获取用户数据
     * @param {String} type 数据类型
     * @param {Object} Dom 用于在其上显示进度的按钮
     *
     * @returns {Object} 用户数据
     */
    const getUserData = (type, Dom) => new Promise((resolve, reject) => {
      try {
        // 取得尾页页数
        const pageNum = (() => {
          const temp = document.querySelectorAll('#page_id a[href^="#"]');
          return Number(temp[temp.length - 1].innerText);
        })();
        let loadPageNum = pageNum;
        let returnHtml = '';
        const tipsDom = document.createElement('span');
        tipsDom.className = 'mess_num';
        Dom.parentNode.appendChild(tipsDom);

        for (let i = 0; i <= pageNum; i++) {
          $.ajax({
            url: `/ajax/my/${type}`,
            type: 'POST',
            data: {
              page: i,
              type_id: 1,
              letter_id: 0,
              read_id: 1,
            },
          }).done((data) => {
            returnHtml += data;
            loadPageNum -= 1;
            tipsDom.innerText = `${pageNum - loadPageNum}/${pageNum}`;
            if (!loadPageNum) {
              const tempDom = document.createElement('div');
              tempDom.innerHTML = returnHtml;
              resolve([...tempDom.getElementsByClassName('his_li')].map(e => {
                const aList = e.getElementsByTagName('a');
                return {
                  name: aList[1].innerText,
                  url: aList[0].href,
                  id: aList[aList.length - 1].id.split('_')[1],
                };
              }));
            }
          });
        }
      } catch (error) {
        reject(error);
      }
    });



    if (location.pathname.includes('subscribe') && document.querySelector('#yc1.optioned')) {
      GM_addStyle('.sub_center_con{position: relative;}#script{position: absolute;right: 0;top: 0;border-width: 1px;border-color: #e6e6e6;border-top-style: solid;border-left-style: solid;cursor: pointer;}#importDetails .account_btm_cont p{margin: 1em 0;}');
      appendDom(document.getElementsByClassName('sub_potion')[0], `
        <div id="script">
          <li>
            <label for="scriptImport"><a>导入</a></label>
            <input type="file" id="scriptImport" accept=".json" hidden>
          </li>
          <li>
            <label id="scriptExpor"><a>导出</a></label>
          </li>
        </div>
      `);

      const importDom = document.getElementById('scriptImport');
      const exportDom = document.getElementById('scriptExpor');

      exportDom.addEventListener('click', () => {
        const subscriptionData = [...document.getElementsByClassName('dy_content_li')].map(e => {
          const aList = e.getElementsByTagName('a');
          return {
            name: aList[1].innerText,
            url: aList[0].href,
            id: aList[aList.length - 1].getAttribute('value'),
          };
        });
        if (typeof saveAs === 'undefined')
          loadExternalScripts.FileSaver();
        saveAs(new Blob([JSON.stringify(subscriptionData, null, 4)], {type: 'text/plain;charset=utf-8'}), '动漫之家订阅信息.json');
      });

      importDom.addEventListener('change', (e) => {
        if (e.target.files.length) {
          getUserData('subscribe', exportDom).then(serverSubscriptionData => {
            const reader = new FileReader();
            reader.onload = (event) => {
              const loadDom = document.createElement('span');
              // 从服务器上获得的已订阅漫画的 id 列表
              const serverSubscriptionList = serverSubscriptionData.map(e => e.id);
              // 导入文件的订阅数据
              const subscriptionData = JSON.parse(event.target.result);
              // 需要订阅的漫画数据
              const needSubscribeList = subscriptionData.filter(e => !serverSubscriptionList.includes(e.id));
              const needSubscribeNum = needSubscribeList.length;

              if (needSubscribeNum) {
                let subscribeIndex = needSubscribeNum - 1;

                loadDom.className = 'mess_num';
                importDom.parentNode.appendChild(loadDom);

                const subscribe = () => {
                  $.ajax({
                    url: 'https://interface.dmzj.com/api/subscribe/add',
                    type: 'get',
                    jsonp: 'callback',
                    data: {
                      sub_id: needSubscribeList[subscribeIndex].id,
                      uid: userId,
                      sub_type: 0,
                    },
                    dataType: 'jsonp',
                    jsonpCallback: 'success',
                    error: () => { subscribe(needSubscribeList[subscribeIndex].id) },
                    success: (data) => {
                      // 1000:成功订阅, 809:已订阅
                      if (data.result !== 1000 && data.result !== 809)
                        throw `订阅返回值:${data.result}`;
                      if (subscribeIndex) {
                        loadDom.innerText = --subscribeIndex;
                        subscribe(needSubscribeList[subscribeIndex].id);
                      } else {
                        loadDom.parentNode.removeChild(loadDom);
                        appendDom(document.body, `
                      <div id="importDetails">
                        <div class="Choose_way box_show" style="display: block;height: auto;z-index: 9999;">
                          <div class="pwdno_bound_tit">
                            <p class="account_tit_font">导入完成</p>
                            <span class="account_close"></span>
                          </div>
                          <div class="account_btm_cont">
                            <p class="Choose_way_p">共导入 ${subscriptionData.length} 部漫画数据</p>
                            <p class="Choose_way_p">成功订阅 ${needSubscribeNum} 部：</p>
                            <p style="overflow: auto;max-height: 7em;border: 1px solid #3591d5;margin-bottom: 1em;">
                              ${needSubscribeList.map(e => e.name).join('<br />')}
                            </p>
                            <p class="Choose_way_p">其余 ${subscriptionData.length - needSubscribeNum} 部漫画已订阅</p>
                          </div>
                        </div>
                        <div style="width: 100%;height: 100%;position: fixed;left: 0;top: 0;background: rgba(0, 0, 0, .3);"></div>
                      </div>
                    `);
                        document.querySelector('#importDetails .account_close').addEventListener('click', (e) => {
                          document.body.removeChild(e.path[3]);
                        });
                      }
                    },
                  });
                };
                subscribe();
              } else
                alert(`导入 ${subscriptionData.length} 部漫画数据，均已订阅`);
            };
            reader.readAsText(e.target.files[0]);
          });
        }
      });
    } else if (location.pathname.includes('record') && document.querySelector('#yc1.optioned')) {
      GM_addStyle('.sub_center_con{position: relative;}#script{position: absolute;right: 0;top: 0;border-width: 1px;border-color: #e6e6e6;border-top-style: solid;border-left-style: solid;cursor: pointer;}#importDetails .account_btm_cont p{margin: 1em 0;}');
      appendDom(document.getElementsByClassName('inter_con_h')[0], `
        <a id="scriptExpor" class="del_all" style="margin: 0 1rem;" href="javascript:">导出</a>
      `);

      const exportDom = document.getElementById('scriptExpor');

      exportDom.addEventListener('click', () => {
        getUserData('record', exportDom).then(recordData => {
          if (typeof saveAs === 'undefined')
            loadExternalScripts.FileSaver();
          saveAs(new Blob([JSON.stringify(recordData, null, 4)], {type: 'text/plain;charset=utf-8'}), '动漫之家云端历史记录.json');
        });
      });
    }
    break;
  }
}


;
    break;
  }
  case 'exhentai.org':
  case 'e-hentai.org': {
    


/* global gid, selected_link, selected_tag */
GM_addStyle(':root {--color1: #5C3C2C;--color2: #E3E0D1;--color3: #edebdf;--color4: #aea5a5;} body {padding: 0 !important}');
loadScriptMenu('EhentaiUserSetting', {
  nhentai匹配: {
    Enable: true,
    漫画: true,
    Tag: true,
  },
});
const imgList = {ehentai: []};

// 判断当前页是否是漫画详情页
if (typeof gid !== 'undefined') {
  if (ScriptMenu.UserSetting['漫画阅读'].Enable) {
    appendDom(document.getElementById('gd5'), '<p class="g2 gsp"><img src="https://ehgt.org/g/mr.gif"><a id="comicReadMode" href="javascript:;"> Load comic</a></p>');
    let loadLock = false;
    document.getElementById('comicReadMode').addEventListener('click', function () {
      const comicReadModeDom = document.getElementById('comicReadMode');
      if (!imgList.ehentai.length) {
        const imgTotalNum = parseInt(document.querySelectorAll('#gdd tbody tr td.gdt2')[5].innerHTML);
        const getImgUrl = html => html.split('id="img" src="')[1].split('"')[0];
        const nextRe = /id="next" .*? href="(.+?)(?=")/;
        let loadImgNum = 0;

        // 递归循环获取图源
        const Loop = function (url, i, next = true) {
          GM_xmlhttpRequest({
            method: 'GET',
            url,
            onload (xhr) {
              if (xhr.status === 200) {
                const img = document.createElement('img');
                img.src = getImgUrl(xhr.responseText);
                img.onload = () => {
                  if (++loadImgNum === imgTotalNum)
                    comicReadModeDom.innerHTML = ' Read';
                  else
                    comicReadModeDom.innerHTML = ` loading —— ${loadImgNum}/${imgTotalNum}`;
                };
                img.onerror = () => {
                  Loop(url, i, false);
                };
                imgList.ehentai[i] = img;

                if (next) {
                  const nextUrl = nextRe.exec(xhr.responseText)[1];
                  if (nextUrl === xhr.finalUrl)
                    loadLock = true;
                  else
                    Loop(nextUrl, i + 1);
                }
              } else
                throw `${xhr.status}:${url}`;
            },
          });
        };
        comicReadModeDom.innerHTML = ` loading —— 0/${imgTotalNum}`;
        Loop(document.querySelector('#gdt > div:nth-child(1) a').href, 0);
      } else if (loadLock && (!comicReadModeDom.innerHTML.includes('loading') || confirm('图片未加载完毕，确认要直接进入阅读模式？'))) {
        loadComicReadWindow({
          comicImgList: imgList.ehentai,
          readSetting: ScriptMenu.UserSetting['漫画阅读'],
          EndExit: () => scrollTo(0, getTop(document.getElementById('cdiv'))),
          comicName: document.getElementById('gj').innerHTML ? document.getElementById('gj').innerHTML : document.getElementById('gn').innerHTML,
        });
        ComicReadWindow.PageNum = 0;
        ComicReadWindow.start();
      }
    });
  }

  let nHentaiComicInfo;
  if (ScriptMenu.UserSetting['nhentai匹配']['漫画']) {
    GM_xmlhttpRequest({
      method: 'GET',
      url: `https://nhentai.net/api/galleries/search?query=${encodeURIComponent(document.getElementById('gn').innerText)}`,
      onload (xhr) {
        if (xhr.status === 200) {
          nHentaiComicInfo = JSON.parse(xhr.responseText);

          // 构建新标签行
          const newTagLine = document.createElement('tr');
          if (nHentaiComicInfo.result.length) {
            let temp = '<td class="tc">nhentai:</td><td>';
            let i = nHentaiComicInfo.result.length;
            while (i--) {
              const tempComicInfo = nHentaiComicInfo.result[i];
              temp += `<div id="td_nhentai:${tempComicInfo.id}" class="gtl" style="opacity:1.0" title="${tempComicInfo.title.japanese ? tempComicInfo.title.japanese : tempComicInfo.title.english}"><a href="https://nhentai.net/g/${tempComicInfo.id}/" index=${i} onclick="return toggle_tagmenu('nhentai:${tempComicInfo.id}',this)">${tempComicInfo.id}</a></a></div>`;
            }
            newTagLine.innerHTML = `${temp}</td>`;
          } else
            newTagLine.innerHTML = '<td class="tc">nhentai:</td><td class="tc" style="text-align: left;">Null</td>';

          document.querySelector('#taglist tbody').appendChild(newTagLine);
        }
      },
    });
  }

  // 重写 _refresh_tagmenu_act 函数，加入脚本的功能
  unsafeWindow._refresh_tagmenu_act = function (a, b) {
    const tagmenu_act_dom = document.getElementById('tagmenu_act');
    if (a.includes('nhentai:')) {
      tagmenu_act_dom.innerHTML = `<img src="https://ehgt.org/g/mr.gif" class="mr" alt=">"><a href="${b.href}" target="_blank"> Jump to nhentai</a>`;
      if (ScriptMenu.UserSetting['漫画阅读'].Enable) {
        tagmenu_act_dom.innerHTML += `<img src="https://ehgt.org/g/mr.gif" class="mr" alt=">"><a href="#"> ${imgList[selected_tag] ? 'Read' : 'Load comic'}</a>`;
        const comicReadModeDom = tagmenu_act_dom.querySelector('a[href="#"]');
        let loadLock = false;
        // 加载 nhentai 漫画
        comicReadModeDom.addEventListener('click', function (e) {
          e.preventDefault();
          const tempComicInfo = nHentaiComicInfo.result[selected_link.getAttribute('index')];
          const imgTotalNum = tempComicInfo.num_pages;

          if (!imgList[selected_tag]) {
            comicReadModeDom.innerHTML = ` loading —— 0/${imgTotalNum}`;
            // 用于转换获得图片文件扩展名的 dict
            const fileType = {
              j: 'jpg',
              p: 'png',
              g: 'gif',
            };
            let loadImgNum = 0;
            imgList[selected_tag] = [];

            const loadImg = (i) => {
              GM_xmlhttpRequest({
                method: 'GET',
                url: `https://i.nhentai.net/galleries/${tempComicInfo.media_id}/${i + 1}.${fileType[tempComicInfo.images.pages[i].t]}`,
                headers: {Referer: `https://nhentai.net/g/${tempComicInfo.media_id}/${i + 1}/`},
                responseType: 'blob',
                onload: (xhr) => {
                  if (xhr.status === 200) {
                    const temp = document.createElement('div');
                    temp.innerHTML = `<img src="${URL.createObjectURL(xhr.response)}">`;
                    imgList[selected_tag][i] = temp.firstChild;
                    if (++loadImgNum === imgTotalNum) {
                      loadLock = true;
                      comicReadModeDom.innerHTML = ' Read';
                    } else {
                      loadImg(loadImgNum);
                      comicReadModeDom.innerHTML = ` loading —— ${loadImgNum}/${imgTotalNum}`;
                    }
                  } loadImg(i);
                },
              });
            };
            loadImg(0);

          } else if (loadLock && (!comicReadModeDom.innerHTML.includes('loading') || confirm('图片未加载完毕，确认要直接进入阅读模式？'))) {
            loadComicReadWindow({
              comicImgList: imgList[selected_tag],
              readSetting: ScriptMenu.UserSetting['漫画阅读'],
              EndExit: () => scrollTo(0, getTop(document.getElementById('cdiv'))),
              comicName: tempComicInfo.title.hasOwnProperty('japanese') ? tempComicInfo.title.japanese : tempComicInfo.title.english,
            });
            ComicReadWindow.PageNum = 0;
            ComicReadWindow.start();
          }
        });
      }
    } else {
      let temp = '';
      if (b.className !== 'tup')
        temp += ` <img src="https://ehgt.org/g/mr.gif" class="mr" alt="&gt;" /> <a href="#" onclick="tag_vote_up(); return false">${b.className === '' ? 'Vote Up' : 'Withdraw Vote'}</a>`;
      if (b.className !== 'tdn')
        temp += ` <img src="https://ehgt.org/g/mr.gif" class="mr" alt="&gt;" /> <a href="#" onclick="tag_vote_down(); return false">${b.className === '' ? 'Vote Down' : 'Withdraw Vote'}</a>`;
      temp += '<img src="https://ehgt.org/g/mr.gif" class="mr" alt="&gt;" /> <a href="#" onclick="tag_show_galleries(); return false">Show Tagged Galleries</a><img src="https://ehgt.org/g/mr.gif" class="mr" alt="&gt;" /> <a href="#" onclick="tag_define(); return false">Show Tag Definition</a><img src="https://ehgt.org/g/mr.gif" class="mr" alt="&gt;" /> ';

      if (ScriptMenu.UserSetting['nhentai匹配'].Tag) {
        const tag = selected_link.id.slice(3).split(':');
        if (tag.length === 1)
          temp += `<a href="https://nhentai.net/tag/${tag[0].replace(/_/g, '-')}" target="_blank">Search nhentai</a>`;
        else
          temp += `<a href="https://nhentai.net/${tag[0] === 'female' ? 'tag' : tag[0]}/${tag[1].replace(/_/g, '-')}" target="_blank">Search nhentai</a>`;
      } else
        temp += '<a href="#" onclick="toggle_tagmenu(undefined, undefined); return false">Add New Tag</a>';
      tagmenu_act_dom.innerHTML = temp;
    }
  };
}


;
    break;
  }
  case 'nhentai.net': {
    


/* global unsafeWindow, GM_addStyle, GM_info, GM_xmlhttpRequest, appendDom, getTop, ComicReadWindow, ScriptMenu, gallery, n */
GM_addStyle(':root {--color1: #ed2553;--color2: #0d0d0d;--color3: #1f1f1f;--color4: #aea5a5;} #ScriptMenu{color: white !important;} hr{bottom:0;box-sizing:border-box;margin:-1em auto 2em}hr:last-child{position:relative;animation:load .8s linear alternate infinite}hr:not(:last-child){display:none}@keyframes load{0%{width:100%}100%{width:0}}');
loadScriptMenu('NhentaiUserSetting', {
  体验优化: {
    Enable: true,
    自动翻页: true,
    彻底屏蔽漫画: true,
    在新页面中打开链接: true,
  },
});

// 用于转换获得图片文件扩展名的 dict
const fileType = {
  j: 'jpg',
  p: 'png',
  g: 'gif',
};

const getApiUrl = (location) => {
  if (location.pathname === '/')
    return 'https://nhentai.net/api/galleries/all?';
  else if (document.querySelector('a.tag'))
    return `https://nhentai.net/api/galleries/tagged?tag_id=${document.querySelector('a.tag').classList[1].split('-')[1]}&`;
  else if (location.pathname.includes('search'))
    return `https://nhentai.net/api/galleries/search?query=${new URLSearchParams(location.search).get('q')}&`;
  return '';
};

const buildImg = (src, onload, onerror) => {
  const img = document.createElement('img');
  img.src = src;
  img.onload = onload;
  img.onerror = onerror;
  return img;
};

// 判断当前页是漫画详情页
if (typeof gallery !== 'undefined' && ScriptMenu.UserSetting['漫画阅读'].Enable) {
  appendDom(document.getElementById('download').parentNode, '<a href="javascript:;" id="comicReadMode" class="btn btn-secondary"><i class="fa fa-book"></i> Load comic</a>');
  const comicReadModeDom = document.getElementById('comicReadMode');
  let loadLock = false;
  comicReadModeDom.addEventListener('click', () => {
    if (ComicReadWindow === undefined) {
      const imgTotalNum = gallery.num_pages;
      let loadImgNum = 0;
      const imgList = [];
      comicReadModeDom.innerHTML = `<i class="fa fa-spinner"></i> loading —— 0/${imgTotalNum}`;

      for (let i = 0; i < imgTotalNum; i++) {
        const src = `https://i.nhentai.net/galleries/${gallery.media_id}/${i + 1}.${gallery.images.pages[i].extension}`;
        const onload = () => {
          if (++loadImgNum === imgTotalNum) {
            comicReadModeDom.innerHTML = '<i class="fa fa-book"></i> Read';

            loadLock = true;
            loadComicReadWindow({
              comicImgList: imgList,
              readSetting: ScriptMenu.UserSetting['漫画阅读'],
              EndExit: () => scrollTo(0, getTop(document.getElementById('comment-container'))),
              comicName: gallery.title.japanese ? gallery.title.japanese : gallery.title.english,
            });
          } else
            comicReadModeDom.innerHTML = `<i class="fa fa-spinner"></i> loading —— ${loadImgNum}/${imgTotalNum}`;
        };
        const onerror = () => {
          setTimeout(() => {
            imgList[i] = buildImg(src, onload, onerror);
          }, 0);
        };
        onerror();
      }
    } else if (loadLock && (!comicReadModeDom.innerHTML.includes('loading') || confirm('图片未加载完毕，确认要直接进入阅读模式？')))
      ComicReadWindow.start();
  });
} else if (document.getElementsByClassName('index-container').length) {
  // 判断当前页是漫画浏览页
  const blacklist = n.options.blacklisted_tags;

  if (ScriptMenu.UserSetting['体验优化']['自动翻页']) {
    let pageNum = document.querySelector('.page.current') ? Number(document.querySelector('.page.current').innerHTML) : false;
    let loadLock = !pageNum;
    const contentDom = document.getElementById('content');
    const apiUrl = getApiUrl(location);

    // 加载下一页的漫画
    const loadNewComic = () => {
      if (!loadLock && contentDom.lastElementChild.getBoundingClientRect().top <= window.innerHeight) {
        loadLock = true;
        GM_xmlhttpRequest({
          method: 'GET',
          url: `${apiUrl}page=${++pageNum}${location.pathname.includes('popular') ? '&sort=popular ' : ''}`,
          onload: (xhr) => {
            if (xhr.status === 200) {
              const Info = JSON.parse(xhr.responseText);
              let comicDomHtml = '';
              for (let i = 0; i < Info.result.length; i++) {
                const tempComicInfo = Info.result[i];
                // 在 用户未登录 或 黑名单为空 或 未开启屏蔽 或 漫画标签都不在黑名单中 时才添加漫画结果
                if (!(blacklist && blacklist.length && ScriptMenu.UserSetting['体验优化']['彻底屏蔽漫画'] && tempComicInfo.tags.some(e => blacklist.includes(e.id))))
                  comicDomHtml += `<div class="gallery" data-tags="${tempComicInfo.tags.map(e => e.id).join(' ')}"><a ${ScriptMenu.UserSetting['体验优化']['在新页面中打开链接'] ? 'target="_blank"' : ''} href="/g/${tempComicInfo.id}/" class="cover" style="padding:0 0 ${tempComicInfo.images.thumbnail.h / tempComicInfo.images.thumbnail.w * 100}% 0"><img is="lazyload-image" class="" width="${tempComicInfo.images.thumbnail.w}" height="${tempComicInfo.images.thumbnail.h}" src="https://t.nhentai.net/galleries/${tempComicInfo.media_id}/thumb.${fileType[tempComicInfo.images.thumbnail.t]}"><div class="caption">${tempComicInfo.title.english}</div></a></div>`;
              }

              // 构建页数按钮
              if (comicDomHtml) {
                const pageNumDom = [];
                for (let i = pageNum - 5; i <= pageNum + 5; i++)
                  if (i > 0 && i <= Info.num_pages)
                    pageNumDom.push(`<a ${ScriptMenu.UserSetting['体验优化']['在新页面中打开链接'] ? 'target="_blank" ' : ''}href="?page=${i}" class="page${i === pageNum ? ' current' : ''}">${i}</a>`);
                appendDom(contentDom, `<h1>${pageNum}</h1><div class="container index-container">${comicDomHtml}</div><section class="pagination">
                <a ${ScriptMenu.UserSetting['体验优化']['在新页面中打开链接'] ? 'target="_blank" ' : ''}href="?page=1" class="first"><i class="fa fa-chevron-left"></i><i class="fa fa-chevron-left"></i></a><a ${ScriptMenu.UserSetting['体验优化']['在新页面中打开链接'] ? 'target="_blank" ' : ''}href="?page=${pageNum - 1}" class="previous"><i class="fa fa-chevron-left"></i></a>
                ${pageNumDom.join('')}
                ${pageNum === Info.num_pages ? '' : `<a ${ScriptMenu.UserSetting['体验优化']['在新页面中打开链接'] ? 'target="_blank" ' : ''}shref="?page=${pageNum + 1}" class="next"><i class="fa fa-chevron-right"></i></a><a${ScriptMenu.UserSetting['体验优化']['在新页面中打开链接'] ? 'target="_blank" ' : ''}href="?page=${Info.num_pages}" class="last"><i class="fa fa-chevron-right"></i><i class="fa fa-chevron-right"></i></a>`}
                </section>`);
              }

              // 添加分隔线
              contentDom.appendChild(document.createElement('hr'));
              if (pageNum < Info.num_pages)
                loadLock = false;
              else
                contentDom.lastElementChild.style.animationPlayState = 'paused';

              // 当前页的漫画全部被屏蔽或当前显示的漫画少到连滚动条都出不来时，继续加载
              if (!comicDomHtml || contentDom.offsetHeight < document.body.offsetHeight)
                loadNewComic();
            }
          },
        });
      }
    };

    if (ScriptMenu.UserSetting['体验优化']['彻底屏蔽漫画'] && blacklist && blacklist.length) {
      GM_addStyle('.blacklisted.gallery { display: none; }');
    }

    unsafeWindow.onscroll = loadNewComic;
    if (document.querySelector('section.pagination'))
      contentDom.appendChild(document.createElement('hr'));
    loadNewComic();
  }
}

if (ScriptMenu.UserSetting['体验优化']['在新页面中打开链接'])
  [...document.querySelectorAll('a:not([href^="javascript:"])')].forEach(e => e.setAttribute('target', '_blank'));


;
    break;
  }
  case 'tel.dm5.com':
  case 'en.dm5.com':
  case 'www.dm5.com':
  case 'www.1kkk.com': {
    


/* global DM5_CID, DM5_MID, DM5_VIEWSIGN_DT, DM5_VIEWSIGN, DM5_IMAGE_COUNT, DM5_CTITLE, DM5_PageType, d */
GM_addStyle(':root {--color1: #FD113A;--color2: #f7f7f7;--color3: #fff;--color4: #aea5a5;}');
loadScriptMenu('dm5UserSetting', {
  体验优化: {
    Enable: true,
    自动进入漫画阅读模式: true,
  },
});

const wait = (judge, work, delay, max, ...args) => {
  if (!max) return;

  try {
    if (judge()) work(...args)
    else throw new Error();
  } catch (e) {
    setTimeout(wait, delay, judge, work, delay, max - 1, ...args)
  };
}

const judge = () => !DM5_PageType && ScriptMenu.UserSetting['漫画阅读'].Enable

const work = () => {
  appendDom(
    document.querySelector('.right-bar'),
    '<a id="comicReadMode" href="javascript:;">脚本阅读模式</a>',
  );

  const comicReadMode = document.getElementById('comicReadMode');
  comicReadMode.addEventListener('click', () => { ComicReadWindow.start() });

  const key = $('#dm5_key').length > 0 ? $('#dm5_key').val() : '';
  const imgList = [];

  const addImgUrl = () => {
    $.ajax({
      url: 'chapterfun.ashx',
      data: {
        cid: DM5_CID,
        page: imgList.length + 1,
        key,
        language: 1,
        gtk: 6,
        _cid: DM5_CID,
        _mid: DM5_MID,
        _dt: DM5_VIEWSIGN_DT,
        _sign: DM5_VIEWSIGN,
      },
      type: 'GET',
      success(data) {
        imgList.push(...eval(data));

        if (imgList.length === DM5_IMAGE_COUNT) {
          loadComicReadWindow({
            comicImgList: imgList.map((e) => {
              const temp = document.createElement('div');
              temp.innerHTML = `<img id="imgPic" class="img-responsive" src="${e}" alt="">`;
              return temp.firstChild;
            }),
            readSetting: ScriptMenu.UserSetting['漫画阅读'],
            EndExit: () => scrollTo(0, getTop(document.querySelector('.top'))),
            comicName: DM5_CTITLE,
            nextChapter: document.querySelector('.logo_2') ? document.querySelector('.logo_2').href : null,
            prevChapter: document.querySelector('.logo_1') ? document.querySelector('.logo_1').href : null,
          });
          if (ScriptMenu.UserSetting['体验优化']['自动进入漫画阅读模式'])
            ComicReadWindow.start();
        } else {
          comicReadMode.innerText = `漫画加载中 - ${imgList.length}/${DM5_IMAGE_COUNT}`;
          addImgUrl();
        }
      },
    });
  };
  addImgUrl();
}

wait(judge, work, 100, 30)


;
    break;
  }
  case 'www.manhuagui.com':
  case 'tw.manhuagui.com': {
    


/* global cInfo, pVars */
// TODO:调整颜色
GM_addStyle(':root {--color1: #479fdd;--color2: #f0f0f0;--color3: #fff;--color4: #aea5a5;} body {padding: 0 !important}');
loadScriptMenu('manhuaguiUserSetting', {
  体验优化: {
    Enable: true,
    自动进入漫画阅读模式: true,
  },
});

if (ScriptMenu.UserSetting['漫画阅读'].Enable) {
  const tempDom = document.querySelector('.main-btn');
  tempDom.removeChild(tempDom.lastChild);
  appendDom(
    tempDom,
    '<a href="javascript:;" id="comicReadMode" class="btn-red">阅读模式</a>',
  );

  const comicReadMode = document.getElementById('comicReadMode');
  comicReadMode.addEventListener('click', () => { ComicReadWindow.start() });

  const comicInfo = JSON.parse(eval(document.querySelector('body > script:nth-child(8)').innerHTML.slice(26)).slice(12, -12));
  const imgs = comicInfo.files.map(file => `${pVars.manga.filePath}${file}?cid=${comicInfo.cid}${Object.entries(comicInfo.sl).map(attr => `&${attr[0]}=${attr[1]}`)}`);

  loadComicReadWindow({
    comicImgList: [...new Array(unsafeWindow.cInfo.len).keys()].map((e, i) => {
      const temp = document.createElement('div');
      temp.innerHTML = `<img id="imgPic" class="img-responsive" src="${imgs[i]}" alt="">`;
      return temp.firstChild;
    }),
    readSetting: ScriptMenu.UserSetting['漫画阅读'],
    EndExit: () => scrollTo(0, 0),
    comicName: `${comicInfo.bname} ${comicInfo.cname}`,
    nextChapter: cInfo.nextId !== 0 ? `/comic/${cInfo.bid}/${cInfo.nextId}` : null,
    prevChapter: cInfo.prevId !== 0 ? `/comic/${cInfo.bid}/${cInfo.prevId}` : null,
  });
  if (ScriptMenu.UserSetting['体验优化']['自动进入漫画阅读模式'])
    ComicReadWindow.start();
}



;
    break;
  }
  case 'www.manhuadb.com': {
    


GM_addStyle(':root {--color1: #e40b21;--color2: #f7f7f7;--color3: #fff;--color4: #aea5a5;scroll-behavior: auto !important;} body {padding: 0 !important}');
loadScriptMenu('manhuadbUserSetting', {
  体验优化: {
    Enable: true,
    自动进入漫画阅读模式: true,
  },
});

if (ScriptMenu.UserSetting['漫画阅读'].Enable && unsafeWindow.img_data_arr) {
  appendDom(
    document.querySelector('body > nav > div'),
    '<a id="comicReadMode" class="navbar-brand" href="javascript:;">漫画加载中</a>',
  );
  const comicReadMode = document.getElementById('comicReadMode');
  comicReadMode.addEventListener('click', () => {
    ComicReadWindow.start();
  });

  loadComicReadWindow({
    comicImgList: unsafeWindow.img_data_arr.map(data => {
      const temp = document.createElement('div');
      temp.innerHTML = `<img src="${unsafeWindow.img_host}/${unsafeWindow.img_pre}/${data.img}">`;
      return temp.firstChild;
    }),
    readSetting: ScriptMenu.UserSetting['漫画阅读'],
    EndExit: () => scrollTo(0, 0),
    comicName: document.title,
    nextChapter: () => { document.querySelector('a[title="下集"]').click() },
    prevChapter: () => { document.querySelector('a[title="上集"]').click() },
  });
  if (ScriptMenu.UserSetting['体验优化']['自动进入漫画阅读模式'])
    ComicReadWindow.start();
  comicReadMode.innerText = '阅读模式';
}


;
    break;
  }
  case 'www.mangabz.com':
  case 'mangabz.com': {
    


/* global MANGABZ_CURL, MANGABZ_CID, MANGABZ_MID, MANGABZ_VIEWSIGN_DT, MANGABZ_VIEWSIGN, MANGABZ_IMAGE_COUNT, MANGABZ_COOKIEDOMAIN  */
GM_addStyle(':root {--color1: #e40b21;--color2: #f7f7f7;--color3: #fff;--color4: #aea5a5;} body {padding: 0 !important}');
loadScriptMenu('mangabzUserSetting', {
  体验优化: {
    Enable: true,
    自动进入漫画阅读模式: true,
  },
});

if (ScriptMenu.UserSetting['漫画阅读'].Enable && MANGABZ_CID) {
  appendDom(
    document.querySelector('.top-title'),
    '<a id="comicReadMode" style="float:right; color:#FFF" href="javascript:;">漫画加载中</a>',
  );
  const comicReadMode = document.getElementById('comicReadMode');
  comicReadMode.addEventListener('click', () => {
    ComicReadWindow.start();
  });

  let prevChapter;
  let nextChapter;
  const chapterList = [...document.querySelectorAll('.container > .bottom-right > a')]
    .map(e => e.getAttribute('href'))
    .filter(url => !url.includes('javascript:'));
  if (chapterList.length === 2) {
    [prevChapter, nextChapter] = chapterList;
  } else if (chapterList.length) {
    if (chapterList[0] > MANGABZ_CURL)
      nextChapter = chapterList[0];
    else
      prevChapter = chapterList[0];
  }

  const imgList = [];
  const addImgUrl = () => {
    const urlParams = Object.entries({
      cid: MANGABZ_CID,
      page: imgList.length + 1,
      key: '',
      _cid: MANGABZ_CID,
      _mid: MANGABZ_MID,
      _dt: MANGABZ_VIEWSIGN_DT.replace(' ', '+').replace(':', '%3A'),
      _sign: MANGABZ_VIEWSIGN,
    }).map(([key, val]) => `${key}=${val}`).join('&');
    const url = `http://${MANGABZ_COOKIEDOMAIN}${MANGABZ_CURL}chapterimage.ashx?${urlParams}`;
    GM_xmlhttpRequest({
      method: 'GET',
      url,
      onload: (xhr) => {
        if (xhr.status === 200) {
          if (xhr.responseText) {
            imgList.push(...eval(xhr.responseText));
          } else {
            console.warn(null, xhr);
          }
          if (imgList.length !== MANGABZ_IMAGE_COUNT) {
            comicReadMode.innerText = `漫画加载中 - ${imgList.length}/${MANGABZ_IMAGE_COUNT}`;
            addImgUrl();
          } else {
            loadComicReadWindow({
              comicImgList: imgList.map(url => {
                const temp = document.createElement('div');
                temp.innerHTML = `<img src="${url}">`;
                return temp.firstChild;
              }),
              readSetting: ScriptMenu.UserSetting['漫画阅读'],
              EndExit: () => scrollTo(0, 0),
              comicName: document.title,
              nextChapter,
              prevChapter,
            });

            if (ScriptMenu.UserSetting['体验优化']['自动进入漫画阅读模式'])
              ComicReadWindow.start();
            comicReadMode.innerText = '阅读模式';
          }
        }
      },
    });
  };
  addImgUrl();
}


;
    break;
  }
  case 'copymanga.com':
  case 'copymanga.net':
  case 'copymanga.org':
  case 'www.copymanga.com':{
    


GM_addStyle(':root {--color1: #e40b21;--color2: #f7f7f7;--color3: #fff;--color4: #aea5a5;} body {padding: 0 !important}');
loadScriptMenu('copymangaUserSetting', {
  体验优化: {
    Enable: true,
    自动进入漫画阅读模式: true,
  },
});

if (ScriptMenu.UserSetting['漫画阅读'].Enable && document.querySelectorAll('.container-fluid.comicContent').length) {
  appendDom(
    document.querySelector('.footer'),
    '<div class="comicContent-prev list"><a id="comicReadMode" href="javascript:;">閲讀模式</a></div>',
  );
  // 在前面加一个隐藏按钮保证整体居中
  appendDom(
    document.querySelector('.footer'),
    '<div class="comicContent-prev index" style="visibility: hidden;"><a href="/">隐藏隐藏</a></div>',
    document.querySelector('.footer .index'),
  );
  const comicReadMode = document.getElementById('comicReadMode');
  comicReadMode.addEventListener('click', () => {
    ComicReadWindow.start();
  });

  const work = ()=>{
    const imgSrcList = [...document.querySelectorAll('.comicContent-image-list img')]
      .map(e => e.getAttribute('data-src'));

    const blobList = [];
    let loadImgNum = 0;
    const imgTotalNum = imgSrcList.length;

    if (imgTotalNum) {
      const loadImg = (index) => {
        const i = index;
        GM_xmlhttpRequest({
          method: 'GET',
          url: imgSrcList[i],
          headers: {Referer: location.href},
          responseType: 'blob',
          onload: (xhr) => {
            if (xhr.status === 200) {
              blobList[i] = [xhr.response, xhr.finalUrl.split('.').pop()];
              if (++loadImgNum === imgTotalNum) {
                comicReadMode.innerText = 'Read';
                loadComicReadWindow({
                  comicImgList: blobList.map(([blobData]) => {
                    const temp = document.createElement('div');
                    temp.innerHTML = `<img src="${URL.createObjectURL(blobData)}">`;
                    return temp.firstChild;
                  }),
                  readSetting: ScriptMenu.UserSetting['漫画阅读'],
                  comicName: document.title,
                  nextChapter: document.querySelector('.comicContent-next a:not(.prev-null)')?.href,
                  prevChapter: document.querySelector('.comicContent-prev:nth-child(3) a:not(.prev-null)')?.href,
                  blobList,
                });
                if (ScriptMenu.UserSetting['体验优化']['自动进入漫画阅读模式'])
                  ComicReadWindow.start();
              } else
                comicReadMode.innerText = `loading - ${loadImgNum}/${imgTotalNum}`;
            } else
              loadImg(i);
          },
        });
      };
      let i = imgTotalNum;
      while (i--)
        loadImg(i);
    }
  }

  const intervalID = setInterval(()=>{
    if(document.querySelectorAll('.comicContent-image-list img').length){
      clearInterval(intervalID);
      work();
    }
  }, 100)

}


;
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
