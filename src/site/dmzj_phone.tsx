import {
  insertNode,
  querySelector,
  querySelectorAll,
  querySelectorClick,
  request,
  useInit,
} from '../main';

// 接口参考
// https://github.com/xiaoyaocz/flutter_dmzj/blob/ecbe73eb435624022ae5a77156c5d3e0c06809cc/lib/requests/api.dart
// https://github.com/erinacio/tachiyomi-extensions/blob/548be91cccb8f248342e2e7762c2c3d4b2d02036/src/zh/dmzj/src/eu/kanade/tachiyomi/extension/zh/dmzj/Dmzj.kt

(async () => {
  const { options, setManga, init } = await useInit('dmzj', {
    解除吐槽的字数限制: true,
  });

  // 分别处理目录页和漫画页
  switch (window.location.pathname.split('/')[1]) {
    case 'info': {
      // 跳过正常漫画
      if (Reflect.has(unsafeWindow, 'obj_id')) return;

      const comicId = parseInt(window.location.pathname.split('/')[2], 10);
      if (Number.isNaN(comicId)) {
        document.body.removeChild(document.body.childNodes[0]);
        insertNode(
          document.body,
          `
          请手动输入漫画名进行搜索 <br />
          <input type="search"> <button>搜索</button> <br />
          <div id="list" />
        `,
        );

        querySelector('button')!.addEventListener('click', async () => {
          const comicName = querySelector<HTMLInputElement>('input')?.value;
          if (!comicName) return;

          const res = await request(
            `https://s.acg.dmzj.com/comicsum/search.php?s=${comicName}`,
            { errorText: '搜索漫画时出错' },
          );

          const comicList = JSON.parse(
            res.responseText.slice(20, -1),
          ) as Array<{
            id: number;
            comic_name: string;
            comic_author: string;
            comic_url: string;
          }>;

          querySelector('#list')!.innerHTML = comicList
            .map(
              ({ id, comic_name, comic_author, comic_url }) => `
                <b>《${comic_name}》<b/>——${comic_author}
                <a href="${comic_url}">Web端</a>
                <a href="https://m.dmzj.com/info/${id}.html">移动端</a>
              `,
            )
            .join('<br />');
        });

        return;
      }

      // XXX: 使用旧 api 只能获取到主版本的章节，其他版本的章节无法取得，改用 v4api 应该就能拿到了
      const res = await request(
        `http://api.dmzj.com/dynamic/comicinfo/${comicId}.json`,
        { errorText: '获取漫画数据失败' },
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

      document.title = title;

      let temp = `<h1 style="text-align:center">${title}</h1>`;
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

        const showComic = init(
          () =>
            querySelectorAll('#commicBox img')
              .map((e) => e.getAttribute('data-original'))
              .filter((src) => src) as string[],
        );
        if (!options.autoShow) await showComic();
        return;
      }

      document.body.removeChild(document.body.childNodes[0]);
      const tipDom = document.createElement('p');
      tipDom.innerText = '正在加载中，请坐和放宽，若长时间无反应请刷新页面';
      document.body.appendChild(tipDom);

      let res: Tampermonkey.Response<any>;

      try {
        res = await request(
          `https://m.dmzj.com/chapinfo/${
            /\d+\/\d+/.exec(document.URL)![0]
          }.html`,
          { errorText: '获取漫画数据失败' },
        );
      } catch (error) {
        tipDom.innerText = (error as Error).message;
        throw error;
      }

      tipDom.innerText = `加载完成，即将进入阅读模式`;

      const { folder, page_url } = JSON.parse(res.responseText) as {
        folder: string;
        page_url: string[];
      };
      document.title = folder.split('/').at(-2) ?? folder;

      // 进入阅读模式后禁止退出，防止返回空白页面
      setManga({ onExit: () => {}, editButtonList: (list) => list });

      const showComic = init(() => {
        if (page_url.length) return page_url;

        tipDom.innerHTML = `无法获得漫画数据，请通过 <a href="https://github.com/hymbz/ComicReadScript/issues">Github</a> 或 <a href="https://greasyfork.org/zh-CN/scripts/374903-comicread/feedback#post-discussion">Greasy Fork</a> 进行反馈`;
        return [];
      });
      if (!options.autoShow) await showComic();
      break;
    }
  }
})();
