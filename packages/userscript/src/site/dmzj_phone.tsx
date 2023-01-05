import fflate from 'fflate';
import { useToast } from '../components';

import { insertNode, querySelectorAll, querySelectorClick } from '../helper';
import { useInit } from '../helper/useInit';

/* eslint-disable camelcase */
declare const obj_id: string;

(async () => {
  const { showFab, setManga, createShowComic, toast } = await useInit('dmzj', {
    解除吐槽的字数限制: true,
    自动进入漫画阅读模式: true,
  });

  // 分别处理目录页和漫画页
  switch (window.location.pathname.split('/')[1]) {
    case 'info': {
      // 判断是否是隐藏漫画，是的话就手动构建目录
      if (typeof obj_id === 'undefined') {
        const comicId = parseInt(window.location.pathname.split('/')[2], 10);
        if (Number.isNaN(comicId)) {
          document.body.innerHTML =
            // FIXME: 已失效，改成 https://dark-dmzj.hloli.net/
            '请从 <a href="https://dmzj.nsapps.cn/">https://dmzj.nsapps.cn/</a> 搜索漫画进入';
          return;
        }

        // XXX: 使用旧 api 只能获取到主版本的章节，其他版本的章节无法取得，改用 v4api 应该就能拿到了
        const res = await GM.xmlHttpRequest({
          method: 'GET',
          url: `http://api.dmzj.com/dynamic/comicinfo/${comicId}.json`,
        });

        if (res.status !== 200) {
          console.error('获取漫画数据失败', res);
          toast.error('获取漫画数据失败');
          return;
        }

        const {
          info: { last_updatetime },
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

        let temp = '';
        let i = chaptersList.length;
        while (i--)
          temp += `<a target="_blank" title="${
            chaptersList[i].chapter_name
          }" href="https://m.dmzj.com/view/${comicId}/${
            chaptersList[i].id
          }.html" ${
            chaptersList[i].updatetime === last_updatetime
              ? 'style="color:red"'
              : ''
          }>${chaptersList[i].chapter_name}</a>`;
        insertNode(document.body, temp);

        document.body.removeChild(document.body.childNodes[0]);
        await GM.addStyle(
          'body{padding:0 20vw;} a{margin:0 1em;line-height:2em;white-space:nowrap;display:inline-block;min-width:4em;}',
        );
      }
      break;
    }
    case 'view': {
      // 如果不是隐藏漫画，直接进入阅读模式
      if (unsafeWindow.comic_id) {
        await GM.addStyle('.subHeader{display:none !important}');
        setManga({
          onNext: querySelectorClick('#loadNextChapter'),
          onPrev: querySelectorClick('#loadPrevChapter'),
        });

        const showComic = createShowComic(
          () =>
            querySelectorAll('#commicBox img')
              .map((e) => e.getAttribute('data-original'))
              .filter((src) => src) as string[],
        );
        showFab({ onClick: () => showComic(false) });

        await showComic(false);
        return;
      }

      document.body.removeChild(document.body.childNodes[0]);
      const tipDom = document.createElement('p');
      tipDom.innerText = '正在加载中，请坐和放宽，若长时间无反应请刷新页面';
      document.body.appendChild(tipDom);

      const res = await GM.xmlHttpRequest({
        method: 'GET',
        url: `https://m.dmzj.com/chapinfo/${
          /\d+\/\d+/.exec(document.URL)![0]
        }.html`,
      });

      if (res.status !== 200) {
        tipDom.innerText = res.responseText;
        return;
      }

      const { folder, page_url } = JSON.parse(res.responseText) as {
        folder: string;
        page_url: string[];
      };
      document.title = folder.split('/').at(-2) ?? folder;

      // TODO: 这里进入阅读模式后应该禁止退出，防止返回空白页面
      // setManga({
      //   onExit
      // })

      const showComic = createShowComic(async () => {
        if (page_url.length) return page_url;

        tipDom.innerText =
          '正常接口未返回具体图片数据，开始通过下载接口获取数据';

        // TODO: 通过下载接口获取数据

        const zipRes = await GM.xmlHttpRequest({
          method: 'GET',
          responseType: 'blob',
          url: `https://imgzip.dmzj.com/s/${
            /\d+\/\d+/.exec(document.URL)![0]
          }.zip`,
        });
        debugger;

        if (zipRes.status !== 200) {
          tipDom.innerText = `无法获得漫画数据，请通过 <a href="https://github.com/hymbz/ComicReadScript/issues">Github</a> 或 <a href="https://greasyfork.org/zh-CN/scripts/374903-comicread/feedback#post-discussion">Greasy Fork</a> 进行反馈`;
          return [];
        }

        const decompressed = fflate.unzipSync(
          new Uint8Array(await (zipRes.response as Blob).arrayBuffer()),
        );
        console.log(decompressed);

        return [];
      });
      showFab({ onClick: () => showComic(false) });

      await showComic(false);
      break;
    }
  }
})();
