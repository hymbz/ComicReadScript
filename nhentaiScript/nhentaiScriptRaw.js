// ==UserScript==
// @name      nhentai Script
// @version     0.1
// @author      hymbz
// @description nhentai脚本——双页阅读、彻底屏蔽漫画、自动翻页
// @namespace   nhentaiScript
// @match       *://nhentai.net/*
// @grant       GM_xmlhttpRequest
// @grant       GM_deleteValue
// @grant       GM_listValues
// @grant       GM_setValue
// @grant       GM_getValue
// @grant       GM_addStyle
// @grant       GM_getResourceText
// @grant       GM_getResourceURL
// @grant       GM_registerMenuCommand
// @run-at      document-end
// @connect     *
// @require     https://cdn.jsdelivr.net/npm/vue
// @require     https://cdnjs.cloudflare.com/ajax/libs/jszip/3.1.5/jszip.min.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/FileSaver.js/1.3.8/FileSaver.min.js
// @require     https://greasyfork.org/scripts/371295-comicread/code/ComicRead.js
// @supportURL  https://github.com/hymbz/ComicReadScript/issues
// @updateURL   https://github.com/hymbz/ComicReadScript/raw/master/nhentaiScript/nhentaiScript.user.js
// @downloadURL https://github.com/hymbz/ComicReadScript/raw/master/nhentaiScript/nhentaiScript.user.js
// ==/UserScript==
/* global unsafeWindow, GM_addStyle, GM_info, GM_xmlhttpRequest, appendDom, getTop, comicReadWindow, ScriptMenu, gallery, N */

GM_addStyle(':root {--color1: #ed2553;--color2: #0d0d0d;--color3: #1f1f1f;--color4: #aea5a5;} #ScriptMenu{color: white !important;} @@nhentaiScript.css@@');
ScriptMenu.load({
  '漫画阅读': {
    'Enable': true,
    '双页显示': true,
    '页面填充': true,
    '点击翻页': false,
    '阅读进度': true,
    '夜间模式': true
  },
  '体验优化': {
    'Enable': true,
    '自动翻页': true,
    '彻底屏蔽漫画': true,
    '在新页面中打开链接': true
  },
  'Version': GM_info.script.version
});


// 用于转换获得图片文件扩展名的 dict
const fileType = {
  'j': 'jpg',
  'p': 'png'
};

// 判断当前页是漫画详情页
if (typeof gallery !== 'undefined') {
  appendDom(document.getElementById('download').parentNode, '<a href="javascript:;" id="comicReadMode" class="btn btn-secondary"><i class="fa fa-book"></i> Load comic</a>');
  let comicReadModeDom = document.getElementById('comicReadMode');
  document.getElementById('comicReadMode').addEventListener('click', function () {
    if (comicReadWindow.comicImgList)
      comicReadWindow.start();
    else {
      const imgTotalNum = gallery.num_pages;
      comicReadModeDom.innerHTML = ` loading —— 0/${imgTotalNum}`;
      let loadImgNum = 0;
      let imgList = [];
      for (let i = 0; i < imgTotalNum; i++) {
        GM_xmlhttpRequest({
          method: 'GET',
          url: `https://i.nhentai.net/galleries/${gallery.media_id}/${i + 1}.${fileType[gallery.images.pages[i].t]}`,
          responseType: 'blob',
          onload: function (xhr) {
            if (xhr.status === 200) {
              imgList[i] = document.createElement('img');
              imgList[i].src = URL.createObjectURL(xhr.response);
              if (++loadImgNum !== imgTotalNum)
                comicReadModeDom.innerHTML = ` loading —— ${loadImgNum}/${imgTotalNum}`;
              else {
                comicReadWindow.load({
                  'comicImgList': imgList,
                  'readSetting': ScriptMenu.UserSetting['漫画阅读'],
                  'EndExit': () => scrollTo(0, getTop(document.getElementById('comment-container'))),
                  'comicName': gallery.title.hasOwnProperty('japanese') ? gallery.title['japanese'] : gallery.title['english']
                });
                comicReadModeDom.innerHTML = ' Read';
              }
            }
          }
        });
      }
    }
  });
}

// 判断当前页是漫画浏览页
else if (document.getElementsByClassName('index-container').length) {
  const blacklist = N.options.blacklisted_tags;

  if (ScriptMenu.UserSetting['体验优化']['自动翻页']) {
    let pageNum = document.querySelector('.page.current') ? +document.querySelector('.page.current').innerHTML : false;
    let loadLock = !pageNum;
    let apiUrl;
    let contentDom = document.getElementById('content');

    let load = function () {
      if (!loadLock && contentDom.lastElementChild.getBoundingClientRect().top <= window.innerHeight) {
        loadLock = true;
        GM_xmlhttpRequest({
          method: 'GET',
          url: `${apiUrl}page=${++pageNum}${window.location.pathname.includes('popular') ? '&sort=popular ' : ''}`,
          onload: function (xhr) {
            if (xhr.status === 200) {
              let Info = JSON.parse(xhr.responseText);
              let comicDomHtml = '';
              for (let i = 0; i < Info.result.length; i++) {
                const tempComicInfo = Info.result[i];
                if (!ScriptMenu.UserSetting['体验优化']['彻底屏蔽漫画'] || (blacklist && blacklist.length && tempComicInfo.tags.every(e => !blacklist.includes(e.id))))
                  comicDomHtml += `<div class="gallery" data-tags="${tempComicInfo.tags.map(e => e.id).join(' ')}"><a ${ScriptMenu.UserSetting['体验优化']['在新页面中打开链接'] ? 'target="_blank"' : ''} href="/g/${tempComicInfo.id}/" class="cover" style="padding:0 0 142.79999999999998% 0"><img is="lazyload-image" class="" width="${tempComicInfo.images.thumbnail.w}" height="${tempComicInfo.images.thumbnail.h}" src="https://t.nhentai.net/galleries/${tempComicInfo.media_id}/thumb.${fileType[tempComicInfo.images.thumbnail.t]}"><div class="caption">${tempComicInfo.title.english}</div></a></div>`;
              }

              // 构建页数按钮
              if (comicDomHtml) {
                let pageNumDom = [];
                for (let i = pageNum - 5; i <= pageNum + 5; i++)
                  if (i > 0 && i <= Info.num_pages)
                    pageNumDom.push(`<a ${ScriptMenu.UserSetting['体验优化']['在新页面中打开链接'] ? 'target="_blank" ' : ''}href="?page=${i}" class="page${i === pageNum ? ' current' : ''}">${i}</a>`);
                appendDom(contentDom, `<h1>${pageNum}</h1><div class="container index-container">${comicDomHtml}</div><section class="pagination">
                <a ${ScriptMenu.UserSetting['体验优化']['在新页面中打开链接'] ? 'target="_blank" ' : ''}href="?page=1" class="first"><i class="fa fa-chevron-left"></i><i class="fa fa-chevron-left"></i></a><a ${ScriptMenu.UserSetting['体验优化']['在新页面中打开链接'] ? 'target="_blank" ' : ''}href="?page=${pageNum - 1}" class="previous"><i class="fa fa-chevron-left"></i></a>
                ${pageNumDom.join('')}
                ${pageNum !== Info.num_pages ? `<a ${ScriptMenu.UserSetting['体验优化']['在新页面中打开链接'] ? 'target="_blank" ' : ''}href="?page=${pageNum + 1}" class="next"><i class="fa fa-chevron-right"></i></a><a ${ScriptMenu.UserSetting['体验优化']['在新页面中打开链接'] ? 'target="_blank" ' : ''}href="?page=${Info.num_pages}" class="last"><i class="fa fa-chevron-right"></i><i class="fa fa-chevron-right"></i></a>` : ''}</section>`);
              }

              // 添加分隔线
              appendDom(contentDom, '<hr>');
              if (pageNum < Info.num_pages)
                loadLock = false;
              else
                contentDom.lastElementChild.style.animationPlayState = 'paused';

              // 当前页的漫画全部被屏蔽或当前显示的漫画少到连滚动条都出不来时，继续加载
              if (!comicDomHtml || contentDom.offsetHeight < document.body.offsetHeight)
                load();
            }
          }
        });
      }
    };

    if (ScriptMenu.UserSetting['体验优化']['彻底屏蔽漫画'] && blacklist && blacklist.length) {
      let n = document.querySelectorAll(blacklist.map(blacklist => N.format('.gallery[data-tags~="{0}"]', blacklist)).join(','));
      let i = n.length;
      while (i--)
        n[i].parentNode.removeChild(n[i]);
    }

    if (window.location.pathname === '/') {
      apiUrl = 'https://nhentai.net/api/galleries/all?';
      unsafeWindow.onscroll = load;
      appendDom(contentDom, '<hr>');
      load();
    } else if (!loadLock) {
      GM_xmlhttpRequest({
        method: 'GET',
        url: document.querySelector('.index-container > div > a').href,
        onload: function (xhr) {
          if (xhr.status === 200) {
            apiUrl = `https://nhentai.net/api/galleries/tagged?tag_id=${new RegExp(`(?<=tag-)\\d+?(?= ">${document.querySelector('#content span:nth-child(2)').innerHTML})`).exec(xhr.responseText)[0]}&`;
            unsafeWindow.onscroll = load;
            appendDom(contentDom, '<hr>');
            load();
          }
        }
      });
    }
  }
}

if (ScriptMenu.UserSetting['体验优化']['在新页面中打开链接'])
  [...document.getElementsByTagName('a')].forEach(e => e.setAttribute('target', '_blank'));
