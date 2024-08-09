import { type ChapterInfo, getChapterInfo, getViewpoint } from 'helper/dmzjApi';
import dmzjDecrypt from 'dmzjDecrypt';
import {
  insertNode,
  querySelector,
  querySelectorAll,
  querySelectorClick,
  request,
  toast,
  useInit,
  log,
  universalInit,
} from 'main';

(async () => {
  // 分别处理目录页和漫画页
  switch (window.location.pathname.split('/')[1]) {
    case 'info': {
      // 跳过正常漫画
      if (Reflect.has(unsafeWindow, 'obj_id')) return;

      const comicId = Number.parseInt(
        window.location.pathname.split('/')[2],
        10,
      );
      if (Number.isNaN(comicId)) {
        document.body.childNodes[0].remove();
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

      const res = await request(
        `https://v4api.idmzj.com/comic/detail/${comicId}?uid=2665531&disable_level=1`,
        { errorText: '获取漫画数据失败' },
      );

      const {
        comicInfo: { last_updatetime, title, chapters },
      } = dmzjDecrypt(res.responseText);

      document.title = title;
      insertNode(document.body, `<h1>${title}</h1>`);

      for (const chapter of Object.values(chapters)) {
        // 手动构建添加章节 dom
        let temp = `<h2>${chapter.title}</h2>`;
        let i = chapter.data.length;
        while (i--)
          temp += `<a target="_blank" title="${
            chapter.data[i].chapter_title
          }" href="https://m.dmzj.com/view/${comicId}/${
            chapter.data[i].chapter_id
          }.html" ${
            chapter.data[i].updatetime === last_updatetime
              ? 'style="color:red"'
              : ''
          }>${chapter.data[i].chapter_title}</a>`;
        insertNode(document.body, temp);
      }

      document.body.childNodes[0].remove();
      GM_addStyle(
        `
          h1 {
            margin: 0 -20vw;
          }

          h1,
          h2 {
            text-align: center;
          }

          body {
            padding: 0 20vw;
          }

          a {
            display: inline-block;

            min-width: 4em;
            margin: 0 1em;

            line-height: 2em;
            white-space: nowrap;
          }
        `,
      );
      break;
    }

    case 'view': {
      // 如果不是隐藏漫画，直接进入阅读模式
      if (unsafeWindow.comic_id) {
        GM_addStyle('.subHeader{display:none !important}');

        await universalInit({
          name: 'dmzj',
          getImgList: () =>
            querySelectorAll('#commicBox img')
              .map((e) => e.dataset.original)
              .filter(Boolean) as string[],
          getCommentList: () =>
            getViewpoint(unsafeWindow.subId, unsafeWindow.chapterId),
          onNext: querySelectorClick('#loadNextChapter'),
          onPrev: querySelectorClick('#loadPrevChapter'),
        });
        return;
      }

      const tipDom = document.createElement('p');
      tipDom.textContent = '正在加载中，请坐和放宽，若长时间无反应请刷新页面';
      document.body.append(tipDom);

      let data: ChapterInfo | undefined;

      let comicId: string;
      let chapterId: string;
      try {
        [, comicId, chapterId] = /(\d+)\/(\d+)/.exec(window.location.pathname)!;
        data = await getChapterInfo(comicId, chapterId);
      } catch (error) {
        toast.error('获取漫画数据失败', { duration: Number.POSITIVE_INFINITY });
        tipDom.textContent = (error as Error).message;
        throw error;
      }

      tipDom.textContent = `加载完成，即将进入阅读模式`;

      const {
        folder,
        chapter_name,
        next_chap_id,
        prev_chap_id,
        comic_id,
        page_url,
      } = data;

      document.title = `${chapter_name} ${folder.split('/').at(1)}`;

      const { setManga, init } = await useInit('dmzj');

      setManga({
        // 进入阅读模式后禁止退出，防止返回空白页面
        onExit: undefined,
        onNext: next_chap_id
          ? () => {
              window.location.href = `https://m.dmzj.com/view/${comic_id}/${next_chap_id}.html`;
            }
          : undefined,
        onPrev: prev_chap_id
          ? () => {
              window.location.href = `https://m.dmzj.com/view/${comic_id}/${prev_chap_id}.html`;
            }
          : undefined,
        editButtonList: (e) => e,
      });

      init(() => {
        if (page_url.length > 0) return page_url;

        tipDom.innerHTML = `无法获得漫画数据，请通过 <a href="https://github.com/hymbz/ComicReadScript/issues" target="_blank">Github</a> 或 <a href="https://greasyfork.org/zh-CN/scripts/374903-comicread/feedback#post-discussion" target="_blank">Greasy Fork</a> 进行反馈`;
        return [];
      });

      setManga('commentList', await getViewpoint(comicId, chapterId));
      break;
    }
  }
})().catch((error) => log.error(error));
