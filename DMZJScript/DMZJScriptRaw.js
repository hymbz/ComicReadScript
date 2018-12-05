/* global qiehuan, huPoint, g_comic_name, g_chapter_name, g_comic_id, g_comic_url */

GM_addStyle(':root {--color1: #05a7ca;--color2: #f8fcff;--color3: #ffffff;--color4: #aea5a5;}');

loadScriptMenu({
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
    '阅读被封漫画': true,
    '在新页面中打开链接': true,
    '解除吐槽的字数限制': true
  },
  'Version': GM_info.script.version
});

switch (location.hostname) {
  case 'manhua.dmzj.com': {
    if (document.title === '页面找不到') {
      let urlInfo = document.URL.split('/');
      GM_xmlhttpRequest({
        method: 'GET',
        url: `https://manhua.dmzj.com/${urlInfo[3]}`,
        onload: function (xhr) {
          if (xhr.status === 200) {
            self.location.href = `https://m.dmzj.com/view/${RegExp('g_current_id = "(\\d+)').exec(xhr.responseText)[1]}/${urlInfo[4].split('.')[0]}.html`;
          }
        }
      });
    } else {
      // 判断当前页是漫画页
      if (typeof g_chapter_name !== 'undefined') {
        if (ScriptMenu.UserSetting['漫画阅读'].Enable) {
          GM_addStyle(`${JSON.parse(GM_getResourceText('DMZJcss')).sections[0].code}@@DMZJScriptRaw.css@@`);
          if (!ScriptMenu.UserSetting['漫画阅读']['夜间模式'])
            document.body.className = 'day';

          // 切换至上下翻页阅读
          if ($.cookie('display_mode') === '0')
            qiehuan();

          let List = document.querySelectorAll('.inner_img img'),
              i = List.length;
          while (i--)
            if (List[i].getAttribute('data-original'))
              List[i].setAttribute('src', List[i].getAttribute('data-original'));

          let comicReadMode = document.querySelector('.btns a:last-of-type');
          comicReadMode.innerHTML = '阅读模式';
          comicReadMode.setAttribute('href', 'javascript:;');
          comicReadMode.removeAttribute('target');
          comicReadMode.addEventListener('click', function () {
            if (typeof ComicReadWindow === 'undefined') {
              loadComicReadWindow({
                'comicImgList': List,
                'readSetting': ScriptMenu.UserSetting['漫画阅读'],
                'EndExit': function () {
                  huPoint();
                  scrollTo(0, getTop(document.getElementById('hd')));
                },
                'comicName': `${g_comic_name} ${g_chapter_name}`,
                'nextChapter': document.getElementById('next_chapter') ? `${document.getElementById('next_chapter').href}#comicMode` : null,
                'prevChapter': document.getElementById('prev_chapter') ? `${document.getElementById('prev_chapter').href}#comicMode` : null
              });
            }
            ComicReadWindow.start();
          });
          if (location.hash === '#comicMode') {
            let checkLoad = function () {
              if (document.readyState === 'complete')
                comicReadMode.click();
              else
                setTimeout(checkLoad, 100);
            };
            checkLoad();
          }
        }
        // 修改发表吐槽的函数，删去字数判断。只是删去了原函数的一个判断条件而已，所以将这段压缩了一下
        if (ScriptMenu.UserSetting['体验优化']['解除吐槽的字数限制'])
          unsafeWindow.addpoint = function () { let e = $('#gdInput').val(); let c = $('input[name=length]').val(); if (e == '') { alert('沉默是你的个性，但还是吐个槽吧！'); return false; } else { if ($.trim(e) == '') { alert('空寂是你的个性，但还是吐个槽吧！'); return false; } } let d = $('#suBtn'); let b = d.attr('onclick'); let a = d.html(); d.attr('onclick', '').html('发表中..').css({ 'background': '#eee', 'color': '#999', 'cursor': 'not-allowed' }); if (is_login) { $.ajax({ type: 'get', url: `${comicUrl}/api/viewpoint/add`, dataType: 'jsonp', jsonp: 'callback', jsonpCallback: 'success_jsonpCallback_201508281119', data: `type=${type}&type_id=${comic_id}&chapter_id=${chapter_id}&uid=${uid}&nickname=${nickname}&title=${encodeURIComponent(e)}`, success: function (f) { if (f.result == 1000) { $('#gdInput').val(''); if ($('#moreLi').length > 0) { $('#moreLi').before(`<li><a href="javascript:;"  class="c9 said" onclick="clickZ($(this));clickY($(this))"  vote_id="${f.data.id}"  >${e}</a></li>`); } else { $('#tc').hide(); if (c == undefined) { $('.comic_gd_li').append(`<li><a href="javascript:;"  class="c0 said" onclick="clickZ($(this));clickY($(this))"  vote_id="${f.data.id}" >${e}</a></li>`); } else { if (c > 9) { $('.comic_gd_li').append(`<li><a href="javascript:;"  class="c9 said" onclick="clickZ($(this));clickY($(this))"  vote_id="${f.data.id}" >${e}</a></li>`); } else { $('.comic_gd_li').append(`<li><a href="javascript:;"  onclick="clickZ($(this));clickY($(this))" class="c${c} said"    vote_id="${f.data.id}">${e}</a></li>`); } } } alert('吐槽成功'); } else { if (f.result == 2001) { $('body').append(zcHtml); zcClick(); } else { alert(f.msg); } } d.attr({ 'onclick': b, 'style': '' }).html(a); } }); } };
      } else {
        GM_addStyle('#floatCode,.toppic_content+div:not(.wrap),#type_comics+a,icorss_acg{display: none !important;}.cartoon_online_border>img{transform: rotate(180deg);}');

        // 判断当前页是漫画详情页
        if (typeof g_comic_name !== 'undefined') {
          // 判断漫画被禁
          if (ScriptMenu.UserSetting['体验优化']['阅读被封漫画'] && document.querySelector('.cartoon_online_border>img')) {
            [...document.querySelectorAll('.odd_anim_title ~ div')].forEach(e => e.parentNode.removeChild(e));

            GM_xmlhttpRequest({
              method: 'GET',
              url: `http://v2api.dmzj.com/comic/${g_comic_id}.json`,
              onload: function (xhr) {
                if (xhr.status === 200) {
                  let temp = '',
                      Info = JSON.parse(xhr.responseText),
                      List = Info.chapters;
                  for (let i = 0; i < List.length; i++) {
                    temp += `<div class="photo_part"><div class="h2_title2"><span class="h2_icon h2_icon22"></span><h2>${Info.title}：${List[i].title}</h2></div></div><div class="cartoon_online_border" style="border-top: 1px dashed #0187c5;"><ul>`;
                    let chaptersList = List[i].data;
                    for (let i = 0; i < chaptersList.length; i++)
                      temp += `<li><a target="_blank" title="${chaptersList[i].chapter_title}" href="https://manhua.dmzj.com/${g_comic_url}${chaptersList[i].chapter_id}.shtml">${chaptersList[i].chapter_title}</a></li>`;
                    temp += '</ul><div class="clearfix"></div></div>';
                  }
                  appendDom(document.getElementsByClassName('middleright_mr')[0], temp);
                }
              }
            });
          } else if (ScriptMenu.UserSetting['体验优化']['在新页面中打开链接'])
            [...document.querySelectorAll('a:not([href^="javascript:"])')].forEach(e => e.setAttribute('target', '_blank'));
        }
      }
    }
    break;
  }
  case 'm.dmzj.com': {
    if (ScriptMenu.UserSetting['体验优化']['阅读被封漫画'] && typeof obj_id === 'undefined') {
      GM_addStyle('body{display:flex;margin:0;flex-direction:column;align-items:center}body.hide img{display:none}img{max-width:95%;margin:1em 0}#comicRead{order:9999}');
      if (ScriptMenu.UserSetting['漫画阅读']['夜间模式']) {
        document.body.style.backgroundColor = '#171717';
        document.body.style.color = '#fff';
      }
      document.body.innerText = '';
      document.body.className = 'hide';
      let loadText = document.createElement('p');
      loadText.innerText = '正在加载中，请坐和放宽，若长时间无反应请刷新页面';
      appendDom(document.body, loadText);
      let imgTotalNum;
      GM_xmlhttpRequest({
        method: 'GET',
        url: `http://v2api.dmzj.com/chapter/${RegExp('\\d+/\\d+').exec(document.URL)[0]}.json`,
        onload: function (xhr) {
          if (xhr.status === 200) {
            let Info = JSON.parse(xhr.responseText);
            imgTotalNum = Info.picnum;
            document.title = Info.title;
            let loadImg = function (index) {
              let i = index;
              GM_xmlhttpRequest({
                method: 'GET',
                url: Info.page_url[i],
                headers: {
                  'Referer': 'http://images.dmzj.com/'
                },
                responseType: 'blob',
                onload: function (xhr) {
                  if (xhr.status === 200) {
                    let temp = document.createElement('img');
                    temp.src = URL.createObjectURL(xhr.response);
                    temp.style.order = i;
                    appendDom(document.body, temp);
                    const loadImgNum = document.getElementsByTagName('img').length;
                    if (loadImgNum === imgTotalNum) {
                      document.body.removeChild(loadText);
                      loadComicReadWindow({
                        'comicImgList': [...document.getElementsByTagName('img')].sort((a, b) => a.style.order - b.style.order),
                        'readSetting': ScriptMenu.UserSetting['漫画阅读'],
                        'comicName': document.title
                      });
                      let start = function () {
                        if (ComicReadWindow.comicImgList.every(e => e.complete))
                          ComicReadWindow.start();
                        else
                          setTimeout(start, 100);
                      };
                      setTimeout(start, 100);
                      document.body.className = '';
                    } else
                      loadText.innerText = `正在加载中，请坐和放宽，若长时间无反应请刷新页面。目前已加载${loadImgNum}/${imgTotalNum}`;
                  } else
                    loadImg(i);
                }
              });
            };
            for (let index = 0; index < Info.picnum; index++)
              loadImg(index);
          }
        }
      });
    }
    break;
  }
}
