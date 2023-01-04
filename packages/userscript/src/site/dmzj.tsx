/* eslint-disable camelcase */
import { insertNode, querySelector, querySelectorAll } from '../helper';
import { useInit } from '../helper/useInit';

declare const g_chapter_name: string;
declare const g_comic_name: string;
declare const g_comic_url: string;
declare const g_comic_id: string;
declare const $: any;

// 解除吐槽的字数限制 功能部分引用的原代码使用到的变量
declare const is_login: any;
declare const comicUrl: any;
declare const type: any;
declare const comic_id: any;
declare const chapter_id: any;
declare const uid: any;
declare const nickname: any;
declare const zcHtml: any;
declare const zcClick: any;

(async () => {
  // TODO:
  // window.addEventListener('load', () => {
  //   if (
  //     typeof ___json___ !== 'undefined' &&
  //     options[
  //       '优化网页右上角用户信息栏的加载'
  //     ] &&
  //     ___json___.result !== true
  //   ) {
  //     GM_xmlhttpRequest({
  //       method: 'GET',
  //       url: 'https://user.dmzj.com/passport/message',
  //       onload(xhr) {
  //         eval(xhr.responseText.slice(4));
  //         document
  //           .querySelector(
  //             'script[src="https://user.dmzj.com/passport/message"]',
  //           )
  //           .onreadystatechange();
  //       },
  //     });
  //   }
  // });

  if (document.title === '页面找不到') {
    const [, comicName, g_current_id] = window.location.pathname.split('/');
    GM_xmlhttpRequest({
      method: 'GET',
      url: `https://manhua.dmzj.com/${comicName}`,
      onload: (xhr) => {
        if (xhr.status === 200) {
          window.location.href = `https://m.dmzj.com/view/${
            /g_current_id = "(\\d+)/.exec(xhr.responseText)![1]
          }/${g_current_id.split('.')[0]}.html`;
        }
      },
    });
    return;
  }

  // 判断进入作者页
  if (window.location.pathname.includes('/tags/')) {
    GM_xmlhttpRequest({
      method: 'GET',
      url: querySelector<HTMLAreaElement>('a.rss')!.href,
      onload: (xhr) => {
        if (xhr.status === 200) {
          const raw = xhr.responseText;
          // 页面上原有的漫画标题
          const titleList = querySelectorAll('#hothit p.t').map((e) =>
            e.innerText.replace('[完]', ''),
          );
          insertNode(
            document.getElementById('hothit')!,
            raw
              .split('item')
              .filter((a, i) => i % 2)
              .map((item) => {
                const newComicUrl =
                  /manhua.dmzj.com\/(.+?)\?from=rssReader/.exec(item)![1];
                return {
                  newComicUrl,
                  comicUrl: newComicUrl.split('/')[0],
                  title: /title><!\[CDATA\[(.+?)]]/.exec(item)![1],
                  imgUrl: /<img src='(.+?)'/.exec(item)![1],
                  newComicTitle: /title='(.+?)'/.exec(item)![1],
                };
              })
              .filter(({ title }) => !titleList.includes(title))
              .map(
                (data) => `
                  <div class="pic">
                    <a href="/${data.comicUrl}/" target="_blank">
                    <img src="${data.imgUrl}" alt="${data.title}" title="" style="">
                    <p class="t">* ${data.title}</p></a>
                    <p class="d">最新：<a href="/${data.newComicUrl}" target="_blank">${data.newComicTitle}</a></p>
                  </div>
                `,
              )
              .join(''),
          );
        }
      },
    });
    return;
  }

  const { options, showFab, setManga, createShowComic } = await useInit(
    'dmzj',
    {
      在新页面中打开链接: true,
      解除吐槽的字数限制: true,
      优化网页右上角用户信息栏的加载: true,
      自动进入漫画阅读模式: true,
    },
  );

  // 判断当前页是漫画详情页
  if (typeof g_chapter_name === 'undefined') {
    GM_addStyle(
      '#floatCode,.toppic_content+div:not(.wrap),#type_comics+a,icorss_acg{display: none !important;}.cartoon_online_border>img{transform: rotate(180deg);}',
    );

    // 判断当前页是漫画页
    if (typeof g_comic_name !== 'undefined') {
      // 判断漫画被禁
      if (document.querySelector('.cartoon_online_border>img')) {
        querySelectorAll('.odd_anim_title ~ div').forEach((e) =>
          e.parentNode?.removeChild(e),
        );

        GM_xmlhttpRequest({
          method: 'GET',
          url: `https://api.dmzj.com/dynamic/comicinfo/${g_comic_id}.json`,
          onload: (xhr) => {
            if (xhr.status === 200) {
              let temp = '';
              const Info = JSON.parse(xhr.responseText).data;
              const { last_updatetime } = Info.info;
              // for (let i = 0; i < chapters.length; i++) {
              temp = `${temp}<div class="photo_part"><div class="h2_title2"><span class="h2_icon h2_icon22"></span><h2>${Info.info.title}</h2></div></div><div class="cartoon_online_border" style="border-top: 1px dashed #0187c5;"><ul>`;
              const chaptersList = Info.list;
              {
                let i = chaptersList.length;
                while (i--)
                  temp = `${temp}<li><a target="_blank" title="${
                    chaptersList[i].chapter_name
                  }" href="https://manhua.dmzj.com/${g_comic_url}${
                    chaptersList[i].id
                  }.shtml" ${
                    chaptersList[i].updatetime === last_updatetime
                      ? 'class="color_red"'
                      : ''
                  }>${chaptersList[i].chapter_name}</a></li>`;
              }
              temp = `${temp}</ul><div class="clearfix"></div></div>`;
              // }
              insertNode(
                document.getElementsByClassName(
                  'middleright_mr',
                )[0] as HTMLElement,
                temp,
              );
            }
          },
        });
      } else if (options.在新页面中打开链接)
        querySelectorAll('a:not([href^="javascript:"])').forEach((e) =>
          e.setAttribute('target', '_blank'),
        );
    }
  }

  // 修改发表吐槽的函数，删去字数判断。只是删去了原函数的一个判断条件而已，所以将这段压缩了一下
  if (options['解除吐槽的字数限制']) {
    const intervalID = setInterval(() => {
      if (!unsafeWindow.addpoint) return;
      clearInterval(intervalID);
      // eslint-disable-next-line
      unsafeWindow.addpoint = function () { const e = $('#gdInput').val(); const c = $('input[name=length]').val(); if (e == '') { alert('沉默是你的个性，但还是吐个槽吧！'); return false; } else { if ($.trim(e) == '') { alert('空寂是你的个性，但还是吐个槽吧！'); return false; } } const d = $('#suBtn'); const b = d.attr('onclick'); const a = d.html(); d.attr('onclick', '').html('发表中..').css({ 'background': '#eee', 'color': '#999', 'cursor': 'not-allowed' }); if (is_login) { $.ajax({ type: 'get', url: `${comicUrl}/api/viewpoint/add`, dataType: 'jsonp', jsonp: 'callback', jsonpCallback: 'success_jsonpCallback_201508281119', data: `type=${type}&type_id=${comic_id}&chapter_id=${chapter_id}&uid=${uid}&nickname=${nickname}&title=${encodeURIComponent(e)}`, success: function (f) { if (f.result == 1000) { $('#gdInput').val(''); if ($('#moreLi').length > 0) { $('#moreLi').before(`<li><a href="javascript:;"  class="c9 said" onclick="clickZ($(this));clickY($(this))"  vote_id="${f.data.id}"  >${e}</a></li>`); } else { $('#tc').hide(); if (c == undefined) { $('.comic_gd_li').append(`<li><a href="javascript:;"  class="c0 said" onclick="clickZ($(this));clickY($(this))"  vote_id="${f.data.id}" >${e}</a></li>`); } else { if (c > 9) { $('.comic_gd_li').append(`<li><a href="javascript:;"  class="c9 said" onclick="clickZ($(this));clickY($(this))"  vote_id="${f.data.id}" >${e}</a></li>`); } else { $('.comic_gd_li').append(`<li><a href="javascript:;"  onclick="clickZ($(this));clickY($(this))" class="c${c} said"    vote_id="${f.data.id}">${e}</a></li>`); } } } alert('吐槽成功'); } else { if (f.result == 2001) { $('body').append(zcHtml); zcClick(); } else { alert(f.msg); } } d.attr({ 'onclick': b, 'style': '' }).html(a); } }); } };
    }, 2000);
  }

  // TODO: 进入阅读模式
  // GM_addStyle(
  //   `${
  //     JSON.parse(GM_getResourceText('DMZJcss')).sections[0].code
  //   }@@DMZJScriptRaw.css@@`,
  // );
  // if (!ScriptMenu.UserSetting['漫画阅读']['夜间模式'])
  //   document.body.className = 'day';

  // // 切换至上下翻页阅读
  // if ($.cookie('display_mode') === '0') qiehuan();

  // const List = document.querySelectorAll('.inner_img img');
  // let i = List.length;
  // while (i--)
  //   if (List[i].getAttribute('data-original'))
  //     List[i].setAttribute(
  //       'src',
  //       List[i].getAttribute('data-original'),
  //     );

  // const comicReadMode = document.querySelector('.btns a:last-of-type');
  // comicReadMode.innerHTML = '阅读模式';
  // comicReadMode.setAttribute('href', 'javascript:;');
  // comicReadMode.removeAttribute('target');
  // comicReadMode.onclick = () => {
  //   if (typeof ComicReadWindow === 'undefined') {
  //     loadComicReadWindow({
  //       comicImgList: List,
  //       readSetting: ScriptMenu.UserSetting['漫画阅读'],
  //       EndExit: () => {
  //         huPoint();
  //         scrollTo(0, getTop(document.getElementById('hd')));
  //       },
  //       comicName: `${g_comic_name} ${g_chapter_name}`,
  //       nextChapter: document.getElementById('next_chapter')
  //         ? `${document.getElementById('next_chapter').href}`
  //         : null,
  //       prevChapter: document.getElementById('prev_chapter')
  //         ? `${document.getElementById('prev_chapter').href}`
  //         : null,
  //     });
  //   }
  //   ComicReadWindow.start();
  // };
  // if (options['自动进入漫画阅读模式'])
  //   document.addEventListener(
  //     'DOMContentLoaded',
  //     setTimeout(comicReadMode.onclick, 0),
  //   );
})();
