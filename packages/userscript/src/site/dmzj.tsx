/* eslint-disable camelcase */
import { useToast } from '../components';
import {
  insertNode,
  querySelector,
  querySelectorAll,
  querySelectorClick,
} from '../helper';
import { useInit } from '../helper/useInit';

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
  // 某些隐藏漫画虽然被删掉了 PC 端页面，但其实手机版的网页依然还在
  // 所以当跳转至某部漫画的 PC 端页面被提示「页面找不到」时，就先跳转至手机版的页面去
  if (document.title === '页面找不到') {
    // 测试例子：https://manhua.dmzj.com/yanquan/48713.shtml
    const [, comicName, _chapter_id] = window.location.pathname.split(/[./]/);
    const res = await GM.xmlHttpRequest({
      method: 'GET',
      url: `https://manhua.dmzj.com/${comicName}`,
    });

    const _comic_id = /g_comic_id = "(\d+)/.exec(res.responseText)?.[1];
    if (!_comic_id) {
      console.error('无法跳转至手机版页面', res);
      // eslint-disable-next-line no-alert
      alert('无法跳转至手机版页面');
      return;
    }

    window.location.href = `https://m.dmzj.com/view/${_comic_id}/${_chapter_id}.html`;
    return;
  }

  // 通过 rss 链接，在作者作品页里添加上隐藏漫画的链接
  if (window.location.pathname.includes('/tags/')) {
    const res = await GM.xmlHttpRequest({
      method: 'GET',
      url: querySelector<HTMLAreaElement>('a.rss')!.href,
    });
    if (res.status !== 200) {
      console.error('获取作者作品失败', res);
      const toast = useToast();
      toast.error('获取作者作品失败');
      return;
    }

    // 页面上原有的漫画标题
    const titleList = querySelectorAll('#hothit p.t').map((e) =>
      e.innerText.replace('[完]', ''),
    );
    insertNode(
      document.getElementById('hothit')!,
      res.responseText
        .split('item')
        .filter((_, i) => i % 2)
        .map((item) => {
          const newComicUrl = /manhua.dmzj.com\/(.+?)\?from=rssReader/.exec(
            item,
          )![1];
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
              <p class="t">【*隐藏*】${data.title}</p></a>
              <p class="d">最新：<a href="/${data.newComicUrl}" target="_blank">${data.newComicTitle}</a></p>
            </div>
          `,
        )
        .join(''),
    );
    return;
  }

  // 跳过漫画目录、漫画页外的其他页面
  if (!Reflect.has(unsafeWindow, 'g_comic_name')) return;

  if (!Reflect.has(unsafeWindow, 'g_chapter_name')) {
    // 判断当前页是漫画详情页

    // 判断漫画被禁
    if (querySelector('.cartoon_online_border > img')) {
      document.querySelector('.cartoon_online_border')!.innerHTML =
        '正在加载中，请坐和放宽，若长时间无反应请刷新页面';

      // XXX: 使用旧 api 只能获取到主版本的章节，其他版本的章节无法取得，改用 v4api 应该就能拿到了
      const res = await GM.xmlHttpRequest({
        method: 'GET',
        url: `https://api.dmzj.com/dynamic/comicinfo/${g_comic_id}.json`,
      });

      if (res.status !== 200 || !res.responseText) {
        console.error('漫画加载出错', res);
        const toast = useToast();
        toast.error('漫画加载出错');
        return;
      }

      // 删掉原有的章节 dom
      querySelectorAll('.odd_anim_title ~ div').forEach((e) =>
        e.parentNode?.removeChild(e),
      );

      const {
        info: { last_updatetime, title },
        list: chaptersList,
      } = JSON.parse(res.responseText).data as {
        info: {
          last_updatetime: string;
          title: string;
        };
        list: Array<{
          id: string;
          chapter_name: string;
          updatetime: string;
        }>;
      };

      // 手动构建添加章节 dom
      let temp = `<div class="photo_part"><div class="h2_title2"><span class="h2_icon h2_icon22"></span><h2>${title}</h2></div></div><div class="cartoon_online_border" style="border-top: 1px dashed #0187c5;"><ul>`;
      let i = chaptersList.length;
      while (i--) {
        temp += `<li><a target="_blank" title="${
          chaptersList[i].chapter_name
        }" href="https://manhua.dmzj.com/${g_comic_url}${
          chaptersList[i].id
        }.shtml" ${
          chaptersList[i].updatetime === last_updatetime
            ? 'class="color_red"'
            : ''
        }>${chaptersList[i].chapter_name}</a></li>`;
      }
      insertNode(
        querySelector('.middleright_mr')!,
        `${temp}</ul><div class="clearfix"></div></div>`,
      );
    }
    return;
  }

  // 处理当前页是漫画页的情况
  const { options, setFab, setManga, createShowComic, onOptionChange } =
    await useInit('dmzj', { 解除吐槽的字数限制: true });

  // 切换至上下翻页阅读
  if ($.cookie('display_mode') === '0') unsafeWindow.qiehuan();

  // 根据漫画模式下的夜间模式切换样式
  if (options.option?.darkMode === false) {
    document.body.classList.add('day');
  }

  onOptionChange((option) => {
    // 监听漫画模式下的夜间模式切换，进行实时切换
    if (option.option?.darkMode) document.body.classList.remove('day');
    else document.body.classList.add('day');
  });

  // 添加自定义样式修改
  await GM.addStyle(`
    ${JSON.parse(await GM.getResourceText('dmzj_style')).sections[0].code}

    /* 修复和 dmzj_style 的冲突 */
    .mainNav {
      display: none !important
    }

    /* 增加日间模式的样式 */
    body.day {
      background-color: white !important
    }
    body.day .header-box {
      background-color: #DDD !important;
      box-shadow: 0 1px 2px white
    }
    body.day .comic_gd_fb .gd_input {
      color: #666;
      background: white
    }
  `);

  setManga({
    onNext: querySelectorClick('#next_chapter'),
    onPrev: querySelectorClick('#prev_chapter'),
  });

  const showComic = createShowComic(
    () =>
      querySelectorAll('.inner_img img')
        .map((e) => e.getAttribute('data-original'))
        .filter((src) => src) as string[],
  );
  setFab({ onClick: () => showComic() });

  if (options.autoLoad) await showComic();

  // 修改发表吐槽的函数，删去字数判断。只是删去了原函数的一个判断条件而已，所以将这段压缩了一下
  if (options['解除吐槽的字数限制']) {
    const intervalID = setInterval(() => {
      if (!unsafeWindow.addpoint) return;
      clearInterval(intervalID);
      // eslint-disable-next-line
      unsafeWindow.addpoint = function () { const e = $('#gdInput').val(); const c = $('input[name=length]').val(); if (e == '') { alert('沉默是你的个性，但还是吐个槽吧！'); return false; } else { if ($.trim(e) == '') { alert('空寂是你的个性，但还是吐个槽吧！'); return false; } } const d = $('#suBtn'); const b = d.attr('onclick'); const a = d.html(); d.attr('onclick', '').html('发表中..').css({ 'background': '#eee', 'color': '#999', 'cursor': 'not-allowed' }); if (is_login) { $.ajax({ type: 'get', url: `${comicUrl}/api/viewpoint/add`, dataType: 'jsonp', jsonp: 'callback', jsonpCallback: 'success_jsonpCallback_201508281119', data: `type=${type}&type_id=${comic_id}&chapter_id=${chapter_id}&uid=${uid}&nickname=${nickname}&title=${encodeURIComponent(e)}`, success: function (f) { if (f.result == 1000) { $('#gdInput').val(''); if ($('#moreLi').length > 0) { $('#moreLi').before(`<li><a href="javascript:;"  class="c9 said" onclick="clickZ($(this));clickY($(this))"  vote_id="${f.data.id}"  >${e}</a></li>`); } else { $('#tc').hide(); if (c == undefined) { $('.comic_gd_li').append(`<li><a href="javascript:;"  class="c0 said" onclick="clickZ($(this));clickY($(this))"  vote_id="${f.data.id}" >${e}</a></li>`); } else { if (c > 9) { $('.comic_gd_li').append(`<li><a href="javascript:;"  class="c9 said" onclick="clickZ($(this));clickY($(this))"  vote_id="${f.data.id}" >${e}</a></li>`); } else { $('.comic_gd_li').append(`<li><a href="javascript:;"  onclick="clickZ($(this));clickY($(this))" class="c${c} said"    vote_id="${f.data.id}">${e}</a></li>`); } } } alert('吐槽成功'); } else { if (f.result == 2001) { $('body').append(zcHtml); zcClick(); } else { alert(f.msg); } } d.attr({ 'onclick': b, 'style': '' }).html(a); } }); } };
    }, 2000);
  }
})();
