import {
  type InitOptions,
  type RequestDetails,
  eachApi,
  querySelectorClick,
  wait,
  querySelector,
  createStyle,
} from 'main';

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

declare let options: InitOptions | undefined;

function api<T = any>(url: string, details?: RequestDetails) {
  return eachApi<T>(url, apiList, details);
}

(() => {
  const token = document.cookie
    .split('; ')
    .find((cookie) => cookie.startsWith('token='))
    ?.replace('token=', '');

  if (window.location.href.includes('/chapter/')) {
    const [, , name, , id] = window.location.pathname.split('/');

    const headers = {
      webp: '1',
      region: '1',
      'User-Agent': 'COPY/2.0.7|',
      version: '2.0.7',
      source: 'copyApp',
      referer: 'com.copymanga.app-2.0.7',
    };
    if (token) Reflect.set(headers, 'Authorization', `Token ${token}`);

    const getImgList = async () => {
      type ResData = {
        message: string;
        results: {
          chapter: {
            contents: Array<{ url: string }>;
            words: number[];
          };
        };
      };
      const res = await api<ResData>(
        `/api/v3/comic/${name}/chapter2/${id}?platform=3`,
        { responseType: 'json', headers },
      );
      const data = res.response;

      const imgList: string[] = [];
      const { words, contents } = data.results.chapter;
      for (let i = 0; i < contents.length; i++)
        imgList[words[i]] = contents[i].url.replace('.c800x.', '.c1500x.');
      return imgList;
    };

    options = {
      name: 'copymanga',
      getImgList,
      onNext: querySelectorClick('.comicContent-next a:not(.prev-null)'),
      onPrev: querySelectorClick(
        '.comicContent-prev:not(.index,.list) a:not(.prev-null)',
      ),
      async getCommentList() {
        const chapter_id = window.location.pathname.split('/').at(-1);
        const res = await api(
          `/api/v3/roasts?chapter_id=${chapter_id}&limit=100&offset=0&_update=true`,
          { responseType: 'json', errorText: '获取漫画评论失败' },
        );
        return res.response.results.list.map(
          ({ comment }) => comment as string,
        ) as string[];
      },
    };
    return;
  }

  // 在目录页显示上次阅读记录
  if (window.location.href.includes('/comic/')) {
    const comicName = window.location.href.split('/comic/')[1];
    if (!comicName || !token) return;

    let a: HTMLAnchorElement;

    const setStyle = createStyle();

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

      await setStyle(`ul a[href*="${lastChapterId}"] {
        color: #fff !important;
        background: #1790E6;
      }`);

      a.href = `${window.location.pathname}/chapter/${lastChapterId}`;
      a.textContent = data?.results?.browse?.chapter_name as string;
    };

    setTimeout(updateLastChapter);
    document.addEventListener('visibilitychange', updateLastChapter);
  }
})();
