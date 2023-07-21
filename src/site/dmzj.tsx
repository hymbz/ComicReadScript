import { For } from 'solid-js';
import { render } from 'solid-js/web';
import {
  insertNode,
  querySelector,
  querySelectorAll,
  request,
  scrollIntoView,
  useInit,
  waitDom,
  autoUpdate,
  isEqualArray,
  wait,
  toast,
} from 'main';
import {
  getChapterInfo,
  getComicId,
  getViewpoint,
  useComicDetail,
} from '../helper/dmzjApi';

(async () => {
  // 通过 rss 链接，在作者作品页里添加上隐藏漫画的链接
  if (window.location.pathname.includes('/tags/')) {
    const res = await request(querySelector<HTMLAreaElement>('a.rss')!.href, {
      errorText: '获取作者作品失败',
    });

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

  // eslint-disable-next-line prefer-const
  let [, comicPy, chapterId] = window.location.pathname.split(/\/|\./);
  if (!comicPy) {
    toast.error('漫画数据获取失败', { duration: Infinity });
    throw new Error('获取漫画拼音简称失败');
  }
  const comicId = await getComicId(comicPy);

  // 判断当前页是漫画详情页
  if (/^\/[^/]*?\/?$/.test(window.location.pathname)) {
    await waitDom('.newpl_ans');
    // 判断漫画被禁
    // 测试例子：https://manhua.dmzj.com/yanquan/
    if (querySelector('.cartoon_online_border > img')) {
      querySelector('.cartoon_online_border')!.innerHTML = '获取漫画数据中';

      // 删掉原有的章节 dom
      querySelectorAll('.odd_anim_title ~ *').forEach(
        (e) => e.parentNode?.removeChild(e),
      );

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
                      {name === '连载'
                        ? '在线漫画全集'
                        : `漫画其它版本：${name}`}
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
    }
    return;
  }

  // 跳过漫画页外的其他页面
  if (!/^\/.*?\/\d+\.shtml$/.test(window.location.pathname)) return;

  // 处理当前页是漫画页的情况
  const { setManga, init } = await useInit('dmzj');

  setManga({
    onExit: (isEnd) => {
      if (isEnd) setTimeout(() => scrollIntoView('#hd'));
      setManga({ show: false });
    },
  });

  /** 切换至上下滚动阅读 */
  const waitSwitchScroll = async (): Promise<void> => {
    await waitDom('#qiehuan_txt');
    await wait(() => {
      const dom = querySelector('#qiehuan_txt');
      if (!dom) return;
      if (dom.innerText !== '切换到上下滚动阅读') return true;
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

  /** 当前是否跳到了上/下一话 */
  let isJumped: '' | 'next' | 'prev' = '';
  // 通过监听点击上/下一话的按钮来判断当前是否切换了章节
  // 直接绑定在点击按钮上会失效，所以只能全局监听
  window.addEventListener('click', (e) => {
    if (!e.target) return;
    const target = e.target as HTMLElement;
    if (
      target.id === 'prev_chapter' ||
      target.className === 'btm_chapter_btn fl'
    ) {
      isJumped = 'prev';
    } else if (
      target.id === 'next_chapter' ||
      target.className === 'btm_chapter_btn fr'
    ) {
      isJumped = 'next';
    }
  });

  const checkButton = (selector: string) => {
    const dom = querySelector(selector);
    if (dom && dom.innerText) return () => dom.click();
  };
  const updateChapterJump = (num = 0) => {
    if (num >= 10) return;
    setManga({
      onNext: checkButton('#next_chapter'),
      onPrev: checkButton('#prev_chapter'),
    });
    // 因为上/下一话的按钮不会立即出现，所以加一个延时
    window.setTimeout(updateChapterJump, num * 200, num + 1);
  };

  /** 章节信息 */
  let chapterInfo = await getChapterInfo(comicId, chapterId);

  let imgList: string[] = [];

  autoUpdate(async () => {
    let newImgList = await getImgList();

    if (isJumped) {
      // 如果当前跳到了上/下一话，就不断循环等待检测到新的图片列表
      while (isJumped && isEqualArray(newImgList, imgList))
        newImgList = await getImgList();

      // 更新切换章节后的 chapterId
      // TODO: 当前刚改版后的 dmzj 切换章节时 url 不会跟着改变，导致必须这样变扭的获取新章节 id
      // 但是，这样会导致切换章节后刷新会跳回最开始的页面，之后肯定会改
      // 等 dmzj 改完后这里要改成直接通过 url 来获取 id
      //
      // 包括判断当前是否跳到了上/下一话，也要改成通过监听 url 的改变来实现
      if (isJumped === 'next' && chapterInfo.next_chap_id)
        chapterId = `${chapterInfo.next_chap_id}`;
      else if (isJumped === 'prev' && chapterInfo.prev_chap_id)
        chapterId = `${chapterInfo.prev_chap_id}`;
      chapterInfo = await getChapterInfo(comicId, chapterId);
      isJumped = '';
    } else if (isEqualArray(newImgList, imgList)) return;

    imgList = newImgList;
    // 先将 imgList 清空以便 activePageIndex 归零
    setManga({ imgList: [] });
    init(() => imgList);

    updateChapterJump();
    const commentList: string[] = await getViewpoint(comicId, chapterId);
    setManga({ commentList });
  });
})();
