// ==UserScript==
// @name      Ehentai Script
// @version     0.2
// @author      hymbz
// @description Ehentai脚本——双页阅读、nhentai 搜索
// @namespace   EhentaiScript
// @match       *://e-hentai.org/*
// @match       *://exhentai.org/*
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
// @updateURL   https://github.com/hymbz/ComicReadScript/raw/master/EhentaiScript/EhentaiScript.user.js
// @downloadURL https://github.com/hymbz/ComicReadScript/raw/master/EhentaiScript/EhentaiScript.user.js
// ==/UserScript==
/* global unsafeWindow, GM_addStyle, GM_info, GM_xmlhttpRequest, appendDom, getTop, comicReadWindow, ScriptMenu, gid, selected_link, selected_tag */

GM_addStyle(':root {--color1: #5C3C2C;--color2: #E3E0D1;--color3: #edebdf;--color4: #aea5a5;} body {padding: 0 !important}');
ScriptMenu.load({
  '漫画阅读': {
    'Enable': true,
    '双页显示': true,
    '页面填充': true,
    '点击翻页': false,
    '阅读进度': true,
    '夜间模式': true
  },
  'nhentai相关': {
    'Enable': true,
    '匹配漫画': true,
    '搜索跳转': true
  },
  'Version': GM_info.script.version
});

// 判断当前页是否是漫画详情页
if (typeof gid !== 'undefined') {
  if (ScriptMenu.UserSetting['漫画阅读'].Enable) {
    appendDom(document.getElementById('gd5'), '<p class="g2 gsp"><img src="https://exhentai.org/img/mr.gif"><a id="comicReadMode" href="javascript:;"> Load comic</a></p>');
    let imgList = [];
    document.getElementById('comicReadMode').addEventListener('click', function () {
      let comicReadModeDom = document.getElementById('comicReadMode');
      if (!comicReadModeDom.innerHTML.includes('loading')) {
        let getImgUrl = html => html.split('id="img" src="')[1].split('"')[0];
        let nextRe = /id="next" .*? href="(.+?)(?=")/;
        const imgTotalNum = parseInt(document.querySelectorAll('#gdd tbody tr td.gdt2')[5].innerHTML);
        const comicName = document.getElementById('gj').innerHTML ? document.getElementById('gj').innerHTML : document.getElementById('gn').innerHTML;

        let Loop = function (url, i) {
          GM_xmlhttpRequest({
            method: 'GET',
            url: url,
            onload: function (xhr) {
              if (xhr.status === 200) {
                GM_xmlhttpRequest({
                  method: 'GET',
                  url: getImgUrl(xhr.responseText), comicReadModeDom,
                  responseType: 'blob',
                  onload: function (xhr) {
                    if (xhr.status === 200) {
                      imgList[i] = document.createElement('img');
                      imgList[i].src = URL.createObjectURL(xhr.response);
                      if (imgList.length !== imgTotalNum)
                        comicReadModeDom.innerHTML = ` loading —— ${imgList.length}/${imgTotalNum}`;
                      else if (imgList.every(e => Boolean(e))) {
                        comicReadWindow.load({
                          'comicImgList': imgList,
                          'readSetting': ScriptMenu.UserSetting['漫画阅读'],
                          'EndExit': () => scrollTo(0, getTop(document.getElementById('cdiv'))),
                          'comicName': comicName
                        });
                        comicReadModeDom.innerHTML = ' Read';
                      }
                    }
                  }
                });
                const nextUrl = nextRe.exec(xhr.responseText)[1];
                if (nextUrl !== xhr.finalUrl)
                  Loop(nextUrl, i + 1);
              } else
                throw `${xhr.status}:${url}`;
            }
          });
        };

        if (imgList.length) {
          comicReadWindow.load({
            'comicImgList': imgList,
            'readSetting': ScriptMenu.UserSetting['漫画阅读'],
            'EndExit': () => scrollTo(0, getTop(document.getElementById('cdiv'))),
            'comicName': comicName
          });
          comicReadWindow.PageNum = 0;
        } else {
          comicReadModeDom.innerHTML = ` loading —— 0/${imgTotalNum}`;
          Loop(`https://exhentai.org/s/${document.querySelector('#gd1 div').style.backgroundImage.split('/')[6].slice(0, 10)}/${gid}-1`, 0);
        }
        if (comicReadWindow.comicName === comicName)
          comicReadWindow.start();
      }
    });
  }

  let nHentaiComicInfo;
  if (ScriptMenu.UserSetting['eHentai相关']['匹配漫画']) {
    GM_xmlhttpRequest({
      method: 'GET',
      url: `https://nhentai.net/api/galleries/search?query=${document.getElementById('gn').innerHTML.replace(/ /g, '+')}`,
      onload: function (xhr) {
        if (xhr.status === 200) {
          nHentaiComicInfo = JSON.parse(xhr.responseText);

          // 构建新标签行
          let newTagLine = document.createElement('tr');
          if (nHentaiComicInfo.result.length) {
            let temp = '<td class="tc">nhentai:</td><td>';
            let i = nHentaiComicInfo.result.length;
            while (i--) {
              const tempComicInfo = nHentaiComicInfo.result[i];
              temp += `<div id="td_nhentai:${tempComicInfo.id}" class="gtl" style="opacity:1.0" title="${tempComicInfo.title.hasOwnProperty('japanese') ? tempComicInfo.title['japanese'] : tempComicInfo.title['english']}"><a href="https://nhentai.net/g/${tempComicInfo.id}/" index=${i} onclick="return toggle_tagmenu('nhentai:${tempComicInfo.id}',this)">${tempComicInfo.id}</a></a></div>`;
            }
            newTagLine.innerHTML = `${temp}</td>`;
          } else
            newTagLine.innerHTML = '<td class="tc">nhentai:</td><td class="tc" style="text-align: left;">Null</td>';

          document.querySelector('#taglist tbody').appendChild(newTagLine);
        }
      }
    });
  }

  // 重写 _refresh_tagmenu_act 函数，加入脚本的功能
  unsafeWindow._refresh_tagmenu_act = function (a, b) {
    let tagmenu_act_dom = document.getElementById('tagmenu_act');
    if (a.includes('nhentai:')) {
      tagmenu_act_dom.innerHTML = `<img src="https://ehgt.org/g/mr.gif" class="mr" alt=">"><a href="${b.href}" target="_blank"> Jump to nhentai</a>`;
      if (ScriptMenu.UserSetting['漫画阅读'].Enable) {
        tagmenu_act_dom.innerHTML += '<img src="https://ehgt.org/g/mr.gif" class="mr" alt=">"><a href="#"> Load comic</a>';
        let comicReadModeDom = tagmenu_act_dom.querySelector('a[href="#"]');

        // 加载 nhentai 漫画
        let imgList = {};
        comicReadModeDom.addEventListener('click', function (e) {
          e.preventDefault();
          if (!comicReadModeDom.innerHTML.includes('loading')) {
            const tempComicInfo = nHentaiComicInfo.result[selected_link.getAttribute('index')];
            const imgTotalNum = tempComicInfo.num_pages;
            const comicName = tempComicInfo.title.hasOwnProperty('japanese') ? tempComicInfo.title['japanese'] : tempComicInfo.title['english'];

            if (imgList[selected_tag]) {
              comicReadWindow.load({
                'comicImgList': imgList[selected_tag],
                'readSetting': ScriptMenu.UserSetting['漫画阅读'],
                'EndExit': () => scrollTo(0, getTop(document.getElementById('cdiv'))),
                'comicName': comicName
              });
              comicReadWindow.PageNum = 0;
            } else {
              comicReadModeDom.innerHTML = ` loading —— 0/${imgTotalNum}`;
              // 用于转换获得图片文件扩展名的 dict
              const dict = {
                'j': 'jpg',
                'p': 'png'
              };
              let loadImgNum = 0;
              imgList[selected_tag] = [];

              for (let i = 0; i < imgTotalNum; i++) {
                GM_xmlhttpRequest({
                  method: 'GET',
                  url: `https://i.nhentai.net/galleries/${tempComicInfo.media_id}/${i + 1}.${dict[tempComicInfo.images.pages[i].t]}`,
                  responseType: 'blob',
                  onload: function (xhr) {
                    if (xhr.status === 200) {
                      imgList[selected_tag][i] = document.createElement('img');
                      imgList[selected_tag][i].src = URL.createObjectURL(xhr.response);
                      if (++loadImgNum !== imgTotalNum)
                        comicReadModeDom.innerHTML = ` loading —— ${loadImgNum}/${imgTotalNum}`;
                      else {
                        comicReadWindow.load({
                          'comicImgList': imgList,
                          'readSetting': ScriptMenu.UserSetting['漫画阅读'],
                          'EndExit': () => scrollTo(0, getTop(document.getElementById('comment-container'))),
                          'comicName': comicName
                        });
                        comicReadModeDom.innerHTML = ' Read';
                      }
                    }
                  }
                });
              }
            }
            if (comicReadWindow.comicName === comicName)
              comicReadWindow.start();
          }
        });
      }
    } else {
      let temp = '';
      if (b.className !== 'tup')
        temp += ' <img src="https://ehgt.org/g/mr.gif" class="mr" alt="&gt;" /> <a href="#" onclick="tag_vote_up(); return false">' + (b.className === '' ? 'Vote Up' : 'Withdraw Vote') + '</a>';
      if (b.className !== 'tdn')
        temp += ' <img src="https://ehgt.org/g/mr.gif" class="mr" alt="&gt;" /> <a href="#" onclick="tag_vote_down(); return false">' + (b.className === '' ? 'Vote Down' : 'Withdraw Vote') + '</a>';
      temp += '<img src="https://ehgt.org/g/mr.gif" class="mr" alt="&gt;" /> <a href="#" onclick="tag_show_galleries(); return false">Show Tagged Galleries</a><img src="https://ehgt.org/g/mr.gif" class="mr" alt="&gt;" /> <a href="#" onclick="tag_define(); return false">Show Tag Definition</a><img src="https://ehgt.org/g/mr.gif" class="mr" alt="&gt;" /> ';

      if (ScriptMenu.UserSetting['eHentai相关']['搜索跳转']) {
        const tag = selected_link.id.slice(3).split(':');
        if (tag.length !== 1)
          temp += `<a href="https://nhentai.net/${tag[0] === 'female' ? 'tag' : tag[0]}/${tag[1].replace(/_/g, '-')}" target="_blank">Search nhentai</a>`;
        else
          temp += `<a href="https://nhentai.net/tag/${tag[0].replace(/_/g, '-')}" target="_blank">Search nhentai</a>`;
      }
      else
        temp += '<a href="#" onclick="toggle_tagmenu(undefined, undefined); return false">Add New Tag</a>';
      tagmenu_act_dom.innerHTML = temp;
    }
  };
}
