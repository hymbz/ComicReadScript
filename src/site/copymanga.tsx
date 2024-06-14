import {
  type InitOptions,
  querySelectorClick,
  wait,
  querySelector,
  request,
} from 'main';

// API 参考：https://github.com/fumiama/copymanga/blob/279e08b06a70307bf20162900103ec1fdcb97751/app/src/main/res/values/strings.xml

declare let options: InitOptions; // eslint-disable-line @typescript-eslint/no-unused-vars

(() => {
  const headers = {
    webp: '1',
    region: '1',
    'User-Agent': 'COPY/2.0.7|',
    version: '2.0.7',
    source: 'copyApp',
    referer: 'com.copymanga.app-2.0.7',
  };
  const token = document.cookie
    .split('; ')
    .find((cookie) => cookie.startsWith('token='))
    ?.replace('token=', '');
  if (token) Reflect.set(headers, 'Authorization', `Token ${token}`);

  let name = '';
  let id = '';
  if (window.location.href.includes('/chapter/'))
    [, , name, , id] = window.location.pathname.split('/');
  else if (window.location.href.includes('/comicContent/'))
    [, , , name, id] = window.location.pathname.split('/');

  if (name && id) {
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
      const res = await request<ResData>(
        `/api/v3/comic/${name}/chapter2/${id}?platform=3`,
        { responseType: 'json', headers },
      );

      const imgList: string[] = [];
      const { words, contents } = res.response.results.chapter;
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
        const res = await request(
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

    const stylesheet = new CSSStyleSheet();
    document.adoptedStyleSheets.push(stylesheet);

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
      const res = await request(
        `${window.location.origin}/api/v3/comic2/${comicName}/query?platform=3`,
        { responseType: 'json', fetch: false, headers },
      );

      const data = res.response?.results?.browse;
      if (!data) {
        a.textContent = data === null ? '無' : '未返回數據';
        return;
      }

      const lastChapterId = data.chapter_id as string;
      if (!lastChapterId) {
        a.textContent = '接口異常';
        return;
      }

      await stylesheet.replace(`ul a[href*="${lastChapterId}"] {
        color: #fff !important;
        background: #1790E6;
      }`);

      a.href = `${window.location.pathname}/chapter/${lastChapterId}`;
      a.textContent = data.chapter_name as string;
    };

    setTimeout(updateLastChapter);
    document.addEventListener('visibilitychange', updateLastChapter);
  }
})();
