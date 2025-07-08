/* eslint-disable i18next/no-literal-string */
import { For } from 'solid-js';
import { render } from 'solid-js/web';

import {
  log,
  querySelector,
  querySelectorAll,
  scrollIntoView,
  wait,
  waitDom,
} from 'helper';
import { toast, universal } from 'main';
import { getComicId, getViewpoint, useComicDetail } from 'userscript/dmzjApi';

(async () => {
  const getId = async () => {
    const [, comicPy, chapterId] = location.pathname.split(/\/|\./);
    if (!comicPy) {
      toast.error('漫画数据获取失败', {
        duration: Number.POSITIVE_INFINITY,
        throw: new Error('获取漫画拼音简称失败'),
      });
    }

    const comicId = await getComicId(comicPy);
    return { comicId, chapterId };
  };

  const handleListPage = async () => {
    await waitDom('.commentBox');

    // 判断漫画被禁
    // 测试例子：https://manhua.dmzj.com/yanquan/
    if (!querySelector('.cartoon_online_border > img')) return false;

    querySelector('.cartoon_online_border')!.innerHTML = '获取漫画数据中';

    // 删掉原有的章节 dom
    for (const e of querySelectorAll('.odd_anim_title ~ *')) e.remove();

    const { comicId } = await getId();

    render(() => {
      const comicDetail = useComicDetail(comicId);

      return (
        <For each={comicDetail.chapters}>
          {({ name, list }) => (
            <>
              <div class="photo_part">
                <div class="h2_title2">
                  <span class="h2_icon h2_icon22" />
                  <h2>
                    {comicDetail.title}{' '}
                    {name === '连载' ? '在线漫画全集' : `漫画其它版本：${name}`}
                  </h2>
                </div>
              </div>
              <div
                class="cartoon_online_border_other"
                style={{ 'margin-top': '-8px' }}
              >
                <ul>
                  <For each={list}>
                    {({ title, id, updatetime }) => (
                      <li>
                        <a
                          target="_blank"
                          title={title}
                          href={`https://m.dmzj.com/view/${comicId}/${id}.html`}
                          classList={{
                            color_red:
                              updatetime === comicDetail.last_updatetime,
                          }}
                        >
                          {title}
                        </a>
                      </li>
                    )}
                  </For>
                </ul>
                <div class="clearfix" />
              </div>
            </>
          )}
        </For>
      );
    }, querySelector('.middleright_mr')!);

    return false;
  };

  /** 切换至上下滚动阅读 */
  const waitSwitchScroll = async (): Promise<void> => {
    await waitDom('#qiehuan_txt');
    await wait(() => {
      const dom = querySelector('#qiehuan_txt');
      if (!dom) return;
      if (dom.textContent !== '切换到上下滚动阅读') return true;
      dom.click();
    });
  };

  const getImgList = async () => {
    await waitSwitchScroll();
    await waitDom('.comic_wraCon img');
    return querySelectorAll<HTMLImageElement>('.comic_wraCon img').map(
      (e) => e.src,
    );
  };

  const checkButton = (selector: string) => {
    const dom = querySelector(selector);
    if (dom?.textContent) return () => dom.click();
  };

  const isMangaPage = () => {
    if (/^\/[^/]*\/?$/.test(location.pathname)) return handleListPage();
    return /^\/.*?\/\d+\.shtml$/.test(location.pathname);
  };

  await universal({
    name: 'dmzj',
    getImgList,
    onExit: (isEnd) => isEnd && scrollIntoView('#hd'),
    async getCommentList() {
      const { comicId, chapterId } = await getId();
      return getViewpoint(comicId, chapterId);
    },
    SPA: {
      isMangaPage,
      getOnPrev: () => checkButton('.display_left #prev_chapter'),
      getOnNext: () => checkButton('.display_right #next_chapter'),
    },
  });
})().catch((error) => log.error(error));
