/* eslint-disable i18next/no-literal-string */
import { render } from 'solid-js/web';
import { For, type Component, Show } from 'solid-js';
import { request, toast, useInit } from 'main';
import {
  querySelectorClick,
  wait,
  querySelector,
  querySelectorAll,
  log,
} from 'helper';

// API 参考：https://github.com/fumiama/copymanga/blob/279e08b06a70307bf20162900103ec1fdcb97751/app/src/main/res/values/strings.xml

const mobileApi = new (class {
  headers = {
    webp: '1',
    region: '1',
    'User-Agent': 'COPY/2.0.7|',
    version: '2.0.7',
    source: 'copyApp',
    referer: 'com.copymanga.app-2.0.7',
  };

  get: typeof request = async (url, details, ...args) =>
    request(
      url,
      { responseType: 'json', headers: this.headers, ...details },
      ...args,
    );
})();

const pcApi = new (class {
  headers = { 'User-Agent': navigator.userAgent, referer: location.href };

  get: typeof request = async (url, details, ...args) =>
    request(
      `https://mapi.copy20.com${url}`,
      { responseType: 'json', headers: this.headers, fetch: false, ...details },
      ...args,
    );
})();

// 在目录页显示上次阅读记录
const handleLastChapter = (comicName: string) => {
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
    const res = await pcApi.get(`/api/v3/comic2/${comicName}/query?platform=3`);

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
};

type HiddenType = 'web' | 'mobile' | '404';

// 拷贝有些漫画虽然可以通过 api 获取到数据，但网页上的目录被隐藏了
//  web - https://www.mangacopy.com/comic/lianyuqingchang
//  mobile - https://www.mangacopy.com/h5/details/comic/lianyuqingchang
// 还有些漫画连网页端介绍都被删了
//  404 - https://www.mangacopy.com/comic/Hyakkasou

// 生成目录
const buildChapters = async (comicName: string, hiddenType: HiddenType) => {
  const {
    response: { results },
  } = await mobileApi.get<{ results: string }>(
    `/comicdetail/${comicName}/chapters`,
    { errorText: '加載漫畫目錄失敗' },
  );

  interface ChaptersGroup {
    name: string;
    path_word: string;
    chapters: Array<{ type: number; name: string; id: string }>;
    last_chapter: {
      comic_id: string;
      name: string;
      datetime_created: string;
      uuid: string;
    };
  }
  interface Chapters {
    build: { type: Array<{ id: number; name: string }> };
    groups: Record<string, ChaptersGroup>;
  }

  // 解码 api 返回的数据
  const decryptData = async (cipher: string, key: string, iv: string) => {
    const decryptedBuffer = await crypto.subtle.decrypt(
      { name: 'AES-CBC', iv: new TextEncoder().encode(iv) },
      await crypto.subtle.importKey(
        'raw',
        new TextEncoder().encode(key),
        { name: 'AES-CBC' },
        false,
        ['decrypt'],
      ),
      new Uint8Array(
        cipher.match(/.{1,2}/g)!.map((byte) => Number.parseInt(byte, 16)),
      ).buffer,
    );
    return JSON.parse(new TextDecoder().decode(decryptedBuffer)) as Chapters;
  };

  const data = await decryptData(
    results.slice(16),
    unsafeWindow.dio || 'xxymanga.zzl.key',
    results.slice(0, 16),
  );
  log(data);
  const {
    build: { type },
    groups,
  } = data;

  const Group: Component<ChaptersGroup> = (props) => {
    const chapters: Record<number, ChaptersGroup['chapters']> =
      Object.fromEntries(type.map(({ id }) => [id, []]));
    for (const chapter of props.chapters) chapters[chapter.type].push(chapter);

    switch (hiddenType) {
      case 'mobile': {
        // 删掉占位置的分隔线
        for (const dom of querySelectorAll('.van-divider')) dom.remove();

        return (
          <div class="detailsTextContentTabs van-tabs van-tabs--line">
            <For each={type}>
              {({ id, name }) => (
                <Show when={chapters[id].length}>
                  <div class="van-tabs__wrap">
                    <div
                      role="tablist"
                      class="van-tabs__nav van-tabs__nav--line"
                      style={{ background: 'transparent' }}
                    >
                      <div role="tab" class="van-tab van-tab--active">
                        <span class="van-tab__text van-tab__text--ellipsis">
                          <span>{name}</span>
                        </span>
                      </div>
                      <div
                        class="van-tabs__line"
                        style={{
                          width: '0.24rem',
                          transform: 'translateX(187.5px) translateX(-50%)',
                          'transition-duration': '0.3s',
                        }}
                      />
                    </div>
                  </div>
                  <div class="van-tab__pane">
                    <div
                      class="chapterList van-grid"
                      style={{ 'padding-left': '0.24rem' }}
                    >
                      <For each={chapters[id]}>
                        {(chapter) => (
                          <div
                            class="chapterItem oneLines van-grid-item"
                            classList={{
                              red: props.last_chapter.uuid === chapter.id,
                            }}
                            style={{
                              'flex-basis': '25%',
                              'padding-right': '0.24rem',
                              'margin-top': '0.24rem',
                            }}
                          >
                            <a
                              class="van-grid-item__content van-grid-item__content--center"
                              href={`/comic/${comicName}/chapter/${chapter.id}`}
                            >
                              <span
                                class="van-grid-item__text"
                                children={chapter.name}
                              />
                            </a>
                          </div>
                        )}
                      </For>
                    </div>
                  </div>
                </Show>
              )}
            </For>
          </div>
        );
      }

      case 'web': {
        return (
          <>
            <span>{props.name}</span>
            <div class="table-default">
              <div class="table-default-title">
                <ul class="nav nav-tabs" role="tablist">
                  <For each={type}>
                    {({ id, name }) => (
                      <li class="nav-item">
                        <a
                          class="nav-link"
                          classList={{ disabled: chapters[id].length === 0 }}
                          data-toggle="tab"
                          href={`#${props.path_word}${name}`}
                          role="tab"
                          aria-selected="false"
                          children={name}
                        />
                      </li>
                    )}
                  </For>
                </ul>
                <div class="table-default-right">
                  <span>更新內容：</span>
                  <a
                    href={`/comic/${comicName}/chapter/${props.last_chapter.comic_id}`}
                    target="_blank"
                    children={props.last_chapter.name}
                  />
                  <span>更新時間：</span>
                  <span>{props.last_chapter.datetime_created}</span>
                </div>
              </div>

              <div class="table-default-box">
                <div class="tab-content">
                  <For each={type}>
                    {({ id, name }) => (
                      <div
                        id={`${props.path_word}${name}`}
                        role="tabpanel"
                        class="tab-pane fade"
                      >
                        <ul>
                          <For each={chapters[id]}>
                            {(chapter) => (
                              <a
                                href={`/comic/${comicName}/chapter/${chapter.id}`}
                                target="_blank"
                                title={chapter.name}
                                style={{ display: 'block' }}
                              >
                                <li>{chapter.name}</li>
                              </a>
                            )}
                          </For>
                        </ul>
                      </div>
                    )}
                  </For>
                </div>
              </div>
            </div>
          </>
        );
      }

      default: {
        return (
          <For each={type}>
            {({ id, name }) => (
              <Show when={chapters[id].length}>
                <div
                  class="card"
                  style={{ 'max-width': '100em', margin: '1em auto' }}
                >
                  <div class="card-body">
                    <h2 class="card-title">{name}</h2>

                    <ul>
                      <For each={chapters[id]}>
                        {(chapter) => (
                          <a
                            class="btn btn-outline-primary"
                            classList={{
                              active: props.last_chapter.uuid === chapter.id,
                            }}
                            href={`/comic/${comicName}/chapter/${chapter.id}`}
                            children={chapter.name}
                          />
                        )}
                      </For>
                    </ul>
                  </div>
                </div>
              </Show>
            )}
          </For>
        );
      }
    }
  };

  let root: HTMLElement;
  switch (hiddenType) {
    case 'mobile':
      root = querySelector('.detailsTextContent')!;
      // 自动点掉隐藏漫画的提示
      for (const element of querySelectorAll('button.van-dialog__confirm'))
        element.click();
      break;
    case 'web':
      root = querySelector('.upLoop')!;
      break;
    default:
      root = querySelector('main')!;
      root.textContent = '';

      GM_addStyle(
        `ul .btn { height: fit-content; width: fit-content; margin: 1em; }`,
      );
      break;
  }

  render(() => <For each={Object.values(groups)} children={Group} />, root);

  // 点击每个分组下第一个激活的标签
  for (const group of querySelectorAll('.upLoop .table-default-title'))
    group.querySelector<HTMLElement>('.nav-link:not(.disabled)')?.click();
};

(async () => {
  const token = document.cookie
    .split('; ')
    .find((cookie) => cookie.startsWith('token='))
    ?.replace('token=', '');
  if (token) {
    Reflect.set(mobileApi.headers, 'Authorization', `Token ${token}`);
    Reflect.set(pcApi.headers, 'Authorization', `Token ${token}`);
  }

  let comicName = '';
  let id = '';
  if (window.location.href.includes('/chapter/'))
    [, , comicName, , id] = window.location.pathname.split('/');
  else if (window.location.href.includes('/comicContent/'))
    [, , , comicName, id] = window.location.pathname.split('/');

  if (comicName && id) {
    const { _setState } = await useInit('copymanga');

    /** 漫画不存在时才会出现的提示 */
    const titleDom = querySelector('main .img+.title');
    if (titleDom)
      titleDom.textContent =
        'ComicRead 提示您：你訪問的內容暫不存在，請點選右下角按鈕嘗試加載漫畫';

    _setState('comicMap', '', {
      async getImgList() {
        if (titleDom) titleDom.textContent = '漫畫加載中，請坐和放寬';

        type ResData = {
          message: string;
          results: {
            chapter: {
              contents: Array<{ url: string }>;
              words: number[];
              name: string;
              next: string | null;
              prev: string | null;
            };
            comic: { name: string };
          };
        };
        const res = await pcApi.get<ResData>(
          `/api/v3/comic/${comicName}/chapter2/${id}?platform=3`,
          { noCheckCode: true },
        );

        if (res.status !== 200) {
          const message = `漫畫加載失敗：${res.response.message || res.status}`;
          if (titleDom) titleDom.textContent = message;
          throw new Error(message);
        }
        if (titleDom) {
          titleDom.textContent = '漫畫加載成功🥳';
          const {
            chapter: { name: chapterName },
            comic: { name },
          } = res.response.results;
          document.title = `${name} - ${chapterName} - 拷貝漫畫 拷贝漫画`;
        }

        if (titleDom ?? !querySelector('.comicContent-next')) {
          const {
            chapter: { next, prev },
          } = res.response.results;

          _setState('manga', {
            onNext: next
              ? () =>
                  window.location.assign(`/comic/${comicName}/chapter/${next}`)
              : undefined,
            onPrev: prev
              ? () =>
                  window.location.assign(`/comic/${comicName}/chapter/${prev}`)
              : undefined,
          });
        } else
          _setState('manga', {
            onNext: querySelectorClick('.comicContent-next a:not(.prev-null)'),
            onPrev: querySelectorClick(
              '.comicContent-prev:not(.index,.list) a:not(.prev-null)',
            ),
          });

        const imgList: string[] = [];
        const { words, contents } = res.response.results.chapter;
        for (let i = 0; i < contents.length; i++)
          imgList[words[i]] = contents[i].url.replace(
            /(?<=.*(\/|\.))c800x/,
            'c1500x',
          );
        return imgList;
      },
    });

    const getCommentList = async () => {
      const chapter_id = window.location.pathname.split('/').at(-1);
      const res = await pcApi.get(
        `/api/v3/roasts?chapter_id=${chapter_id}&limit=100&offset=0&_update=true`,
        { errorText: '获取漫画评论失败' },
      );
      return res.response.results.list.map(
        ({ comment }) => comment as string,
      ) as string[];
    };
    _setState('manga', 'commentList', await getCommentList());

    return;
  }

  // 目录页
  if (!id && window.location.href.includes('/comic/')) {
    comicName = window.location.href.split('/comic/')[1];
    if (!comicName) return;

    let hiddenType: HiddenType | undefined;
    const isMobile = window.location.href.includes('/h5/');

    if (document.title === '404 - 拷貝漫畫') {
      // 移动端可以直接复用代码来实现相同的样式
      hiddenType = isMobile ? 'mobile' : '404';
    } else if (isMobile) {
      // 等到加载提示框消失
      await wait(
        () =>
          querySelector('.van-toast__text')?.parentElement?.style.display ===
          'none',
      );
      // 再等一会看有没有屏蔽提示
      hiddenType = await wait<HiddenType | undefined>(() => {
        // 正常隐藏
        if (querySelector('.isBan')?.textContent?.includes('不提供閱覽'))
          return 'mobile';
        // 连介绍都没有的隐藏
        const dialog = querySelector('.van-dialog__message');
        if (dialog?.textContent?.includes('漫畫未找到')) {
          dialog.textContent = '漫畫未找到!\n請坐和放寬，等待目錄生成';
          // 删掉空白占位的原目录元素
          for (const element of querySelectorAll('.detailsTextContentTabs'))
            element.remove();
          // 虽然实际是应该算是 404 类型，但因为网页的 css 还在
          // 所以可以直接使用 mobile 的元素复用样式
          return 'mobile';
        }
      }, 1000);
    } else if (
      // 先检查有没有屏蔽提示
      Boolean(querySelector('.wargin')?.textContent?.includes('不提供閱覽')) ||
      // 再等一秒看目录有没有加载出来
      !(await wait(() => querySelector('.upLoop .table-default-title'), 1000))
    ) {
      // 检查漫画介绍是否正常显示
      hiddenType = querySelector('.comicParticulars-title') ? 'web' : '404';
    }

    // 如果漫画被隐藏了，就自己生成目录
    if (hiddenType) {
      // 给屏蔽提示加个删除线
      const tip = querySelector('.isBan, .wargin');
      if (tip) tip.style.textDecoration = 'line-through';
      // 修改 404 提示
      const titleDom = querySelector('main .img+.title');
      if (titleDom) {
        titleDom.textContent =
          'ComicRead 提示您：你訪問的內容暫不存在，請坐和放寬，等待目錄生成';
      }

      try {
        await buildChapters(comicName, hiddenType);
      } catch {
        if (titleDom) titleDom.textContent = 'ComicRead 提示您：目錄生成失敗😢';
        toast.error('目錄生成失敗😢', { duration: Number.POSITIVE_INFINITY });
      }
    }

    if (!isMobile && token) handleLastChapter(comicName);
  }
})();
