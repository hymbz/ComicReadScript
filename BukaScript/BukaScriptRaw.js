// ==UserScript==
// @name      Buka Script
// @version     1.1
// @author      hymbz
// @description 布卡脚本——双页阅读
// @namespace   BukaScript
// @match       *://www.buka.cn/*
// @grant       GM_xmlhttpRequest
// @grant       GM_deleteValue
// @grant       GM_listValues
// @grant       GM_setValue
// @grant       GM_getValue
// @grant       GM_addStyle
// @grant       GM_getResourceText
// @grant       GM_getResourceURL
// @run-at      document-end
// @require     https://cdn.jsdelivr.net/npm/vue
// @require     https://cdnjs.cloudflare.com/ajax/libs/jszip/3.1.5/jszip.min.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/FileSaver.js/1.3.8/FileSaver.min.js
// @require     https://greasyfork.org/scripts/371295-comicread/code/ComicRead.js
// @supportURL  https://github.com/hymbz/ComicReadScript/issues
// @updateURL   https://github.com/hymbz/ComicReadScript/raw/master/BukaScript/BukaScript.user.js
// @downloadURL https://github.com/hymbz/ComicReadScript/raw/master/BukaScript/BukaScript.user.js
// ==/UserScript==
/* global GM_addStyle, GM_info, appendDom, comicReadWindow, ScriptMenu */

GM_addStyle(':root {--color1: #F4B440;--color2: rgb(246, 246, 246);;--color3: #fff;--color4: #aea5a5;}.right-btns{position: absolute;left: 1037px;}');

ScriptMenu.load({
  '漫画阅读': {
    'Enable': true,
    '双页显示': true,
    '页面填充': true,
    '点击翻页': false,
    '阅读进度': true,
    '夜间模式': true
  },
  'Version': GM_info.script.version
});
if (document.URL.split('/')[3] === 'view') {
  let List = document.querySelectorAll('img[data-original]');
  let i = List.length;
  while (i--) {
    List[i].setAttribute('src', List[i].getAttribute('data-original'));
    List[i].style.display = 'inline';
  }

  comicReadWindow.load({
    'comicImgList': [...document.querySelectorAll('.manga-imgs img')],
    'readSetting': ScriptMenu.UserSetting['漫画阅读'],
    'EndExit': () => { },
    'comicName': document.title
  });

  appendDom(document.getElementsByClassName('manga-btns-2')[0], '<a href="javascript:;" id="comicReadMode">阅读</a>');
  document.getElementById('comicReadMode').addEventListener('click', function () {
    let checkImgLoad = function () {
      let i = comicReadWindow.comicImgList.length;
      while (i--) {
        if (!comicReadWindow.comicImgList[i].complete)
          return false;
      }
      return true;
    };

    if (checkImgLoad() || confirm('可能还有图片正在加载，请确认所有图片均已加载完毕'))
      comicReadWindow.start();
  });
} else {
  // 添加脚本设置窗口
  appendDom(document.querySelector('div.head-nav > div'), '<a href="javascript:;" title="布卡漫画所有漫画" class="nav-btn" id="ScriptMenuMode">脚本设置</a>');
  document.getElementById('ScriptMenuMode').addEventListener('click', function () {
    ScriptMenu.show = true;
  });
}
