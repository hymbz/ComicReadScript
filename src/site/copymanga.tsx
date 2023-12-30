import type { InitOptions, RequestDetails } from 'main';
import { eachApi, querySelectorClick, wait, querySelector } from 'main';

const apiList = [
  'https://api.copymanga.info',
  'https://api.copymanga.net',
  'https://api.copymanga.org',
  'https://api.copymanga.tv',
  'https://api.xsskc.com',
  'https://api.mangacopy.com',
  'https://api.copymanga.site',
];

// API 参考：https://github.com/fumiama/copymanga/blob/279e08b06a70307bf20162900103ec1fdcb97751/app/src/res/values/strings.xml

// eslint-disable-next-line @typescript-eslint/no-unused-vars
declare let options: InitOptions | undefined;

const api = (url: string, details?: RequestDetails) =>
  eachApi(url, apiList, details);

(() => {
  if (window.location.href.includes('/chapter/')) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    options = {
      name: 'copymanga',
      getImgList: async () => {
        const res = await api(
          window.location.href.replace(/.*?(?=\/comic\/)/, '/api/v3'),
        );
        return (
          JSON.parse(res.responseText).results.chapter.contents as {
            url: string;
          }[]
        ).map(({ url }) => url);
      },
      onNext: querySelectorClick('.comicContent-next a:not(.prev-null)'),
      onPrev: querySelectorClick(
        '.comicContent-prev:not(.index,.list) a:not(.prev-null)',
      ),
      getCommentList: async () => {
        const chapter_id = window.location.pathname.split('/').at(-1);
        const res = await api(
          `/api/v3/roasts?chapter_id=${chapter_id}&limit=100&offset=0&_update=true`,
          { errorText: '获取漫画评论失败' },
        );
        return JSON.parse(res.responseText).results.list.map(
          ({ comment }) => comment as string,
        ) as string[];
      },
    };
    return;
  }

  // 在目录页显示上次阅读记录
  if (window.location.href.includes('/comic/')) {
    const comicName = window.location.href.split('/comic/')[1];

    const token = document.cookie
      .split('; ')
      .find((cookie) => cookie.startsWith('token='))
      ?.replace('token=', '');

    if (!comicName || !token) return;

    let a: HTMLAnchorElement;
    let style: HTMLStyleElement;

    const updateLastChapter = async () => {
      // 因为拷贝漫画的目录是动态加载的，所以要等目录加载出来再往上添加
      if (!a)
        (async () => {
          a = document.createElement('a');
          const tableRight = await wait(() =>
            querySelector('.table-default-right'),
          );
          a.target = '_blank';
          tableRight.insertBefore(a, tableRight.firstElementChild);
          const span = document.createElement('span');
          span.textContent = '最後閱讀：';
          tableRight.insertBefore(span, tableRight.firstElementChild);
        })();

      a.textContent = '獲取中';
      a.removeAttribute('href');
      const res = await api(`/api/v3/comic2/${comicName}/query?platform=3`, {
        headers: { Authorization: `Token ${token}` },
      });
      const data = JSON.parse(res.response);
      if (data?.results?.browse === null) {
        a.textContent = '無';
        return;
      }

      const lastChapterId = data?.results?.browse?.chapter_id as string;
      if (!lastChapterId) {
        a.textContent = '接口異常';
        return;
      }

      const css = `ul a[href*="${lastChapterId}"] {
        color: #fff !important;
        background: #1790E6;
      }`;
      if (style) style.textContent = css;
      else style = await GM.addStyle(css);

      a.href = `${window.location.pathname}/chapter/${lastChapterId}`;
      a.textContent = data?.results?.browse?.chapter_name as string;
    };

    updateLastChapter();
    document.addEventListener('visibilitychange', updateLastChapter);
  }
})();
