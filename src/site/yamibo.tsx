/* eslint-disable i18next/no-literal-string */
import { createMemo, createSignal, Show } from 'solid-js';
import { render } from 'solid-js/web';

import {
  createEffectOn,
  hijackFn,
  log,
  querySelector,
  querySelectorAll,
  scrollIntoView,
  useCache,
  useStyle,
} from 'helper';
import { request, toast, useInit } from 'main';

// 多页
// https://bbs.yamibo.com/thread-43598-2-694.html
// 目录页
// https://bbs.yamibo.com/thread-496210-1-1.html

type History = {
  tid: string;
  lastPageNum: number;
  lastReplies: number;
  lastAnchor: string;
};

(async () => {
  const { setState, options, showComic, loadComic } = await useInit('yamibo', {
    记录阅读进度: true,
    关闭快捷导航的跳转: true,
    修正点击页数时的跳转判定: true,
    固定导航条: true,
    自动签到: true,
  });

  useStyle(
    `#fab { --fab: #6E2B19; }

    ${
      options.固定导航条 ? '.header-stackup { position: fixed !important }' : ''
    }

    .historyTag {
      white-space: nowrap;

      border: 2px solid #6e2b19;
    }

    a.historyTag {
      font-weight: bold;

      margin-left: 1em;
      padding: 1px 4px;

      color: #6e2b19;
      border-radius: 4px 0 0 4px;
    }
    a.historyTag:last-child {
      border-radius: 4px;
    }

    div.historyTag {
      display: initial;

      margin-left: -.4em;
      padding: 1px;

      color: RGB(255, 237, 187);
      border-radius: 0 4px 4px 0;
      background-color: #6e2b19;
    }

    #threadlisttableid tbody:nth-child(2n) div.historyTag {
      color: RGB(255, 246, 215);
    }

    /* 将「回复/查看」列加宽一点 */
    .tl .num {
      width: 80px !important;
    }
    `,
  );

  // 自动签到
  if (
    unsafeWindow.discuz_uid &&
    unsafeWindow.discuz_uid !== '0' &&
    options.自动签到
  )
    (async () => {
      const todayString = new Date().toLocaleDateString('zh-CN');
      // 判断当前日期与上次成功签到日期是否相同
      if (todayString === localStorage.getItem('signDate')) return;
      const sign = querySelector<HTMLInputElement>(
        '#scbar_form > input[name="formhash"]',
      )?.value;
      if (!sign) return;
      try {
        const res = await fetch(`plugin.php?id=zqlj_sign&sign=${sign}`);
        const body = await res.text();
        if (!/成功！|打过卡/.test(body)) throw new Error('自动签到失败');
        toast.success('自动签到成功');
        localStorage.setItem('signDate', todayString);
      } catch {
        toast.error('自动签到失败');
      }
    })();

  if (options.关闭快捷导航的跳转)
    querySelector('#qmenu a')?.setAttribute('href', 'javascript:;');

  // 判断当前页是帖子
  if (/thread(?:-\d+){3}|mod=viewthread/.test(document.URL)) {
    // 修复微博图床的链接
    for (const e of querySelectorAll('img[file*="sinaimg.cn"]'))
      e.setAttribute('referrerpolicy', 'no-referrer');

    const readMode = () => {
      const isFirstPage = !querySelector('.pg > .prev');
      // 第一页以外不自动加载
      if (!isFirstPage) setState('flag', 'needAutoShow', false);

      let imgList = querySelectorAll<HTMLImageElement>(
        ':is(.t_fsz, .message) img',
      );

      const getImgList = () => {
        let i = imgList.length;
        while (i--) {
          const img = imgList[i];

          // 触发懒加载
          const file = img.getAttribute('file');
          if (file && img.src !== file) {
            img.setAttribute('src', file);
            img.setAttribute('lazyloaded', 'true');
          }

          // 测试例子：https://bbs.yamibo.com/thread-502399-1-1.html

          // 删掉表情和小图
          if (
            img.src.includes('static/image') ||
            (img.complete &&
              img.naturalHeight &&
              img.naturalWidth &&
              img.naturalHeight < 500 &&
              img.naturalWidth < 500)
          )
            imgList.splice(i, 1);
        }

        return imgList.map((img) => img.src);
      };
      setState('comicMap', '', { getImgList });

      setState('manga', {
        // 在图片加载完成后再检查一遍有没有小图，有就删掉
        onLoading(_imgList, img) {
          if (img && img.width! < 500 && img.height! < 500) return loadComic();
        },
        onExit(isEnd) {
          if (isEnd)
            scrollIntoView('.psth, .rate, #postlist > div:nth-of-type(2)');

          setState('manga', 'show', false);
        },
      });

      if (querySelector('div.pti > div.authi')) {
        querySelector('div.pti > div.authi')!.insertAdjacentHTML(
          'beforeend',
          '<span class="pipe show">|</span><a id="comicReadMode" class="show" href="javascript:;">漫画阅读</a>',
        );
        document
          .getElementById('comicReadMode')
          ?.addEventListener('click', () => showComic());
      }

      // 如果帖子内有设置目录
      if (querySelector('#threadindex')) {
        // 在网页通过 ajax 更新对应内容后重新获取漫画图片
        hijackFn('ajaxinnerhtml', () => {
          imgList = querySelectorAll<HTMLImageElement>('.t_fsz img');
          if (imgList.length === 0 || getImgList().length === 0) return;
          if (options.autoShow) showComic();
        });
      }

      const tagDom = querySelector<HTMLAnchorElement>('.ptg.mbm.mtn > a');
      // 通过标签确定上/下一话
      if (tagDom) {
        const [, tagId] = tagDom.href.split('id=');
        const reg = /(?<=<th>\s<a href="thread-)\d+(?=-)/g;
        let threadList: number[] = [];

        // 先获取包含当前帖后一话在内的同一标签下的帖子id列表，再根据结果设定上/下一话
        const setPrevNext = async (pageNum = 1): Promise<void> => {
          const res = await request(
            `/misc.php?mod=tag&id=${tagId}&type=thread&page=${pageNum}`,
          );

          const newList = [...res.responseText.matchAll(reg)].map(([tid]) =>
            Number(tid),
          );
          threadList = [...threadList, ...newList];

          const index = threadList.indexOf(unsafeWindow.tid);
          if (newList.length > 0 && (index === -1 || !threadList[index + 1]))
            return setPrevNext(pageNum + 1);

          return setState('manga', {
            onPrev: threadList[index - 1]
              ? () =>
                  location.assign(`thread-${threadList[index - 1]}-1-1.html`)
              : undefined,
            onNext: threadList[index + 1]
              ? () =>
                  location.assign(`thread-${threadList[index + 1]}-1-1.html`)
              : undefined,
          });
        };

        setTimeout(setPrevNext);
      }
    };

    const fid: number =
      unsafeWindow.fid ??
      Number(
        new URLSearchParams(
          querySelector<HTMLAnchorElement>('h2 > a')?.href,
        ).get('fid') ?? '-1',
      );

    // 限定板块启用
    if (fid === 30 || fid === 37) readMode();
    else {
      querySelector('div.pti > div.authi')!.insertAdjacentHTML(
        'beforeend',
        '<span class="pipe show">|</span><a id="comicReadMode" class="show" href="javascript:;">漫画阅读</a>',
      );
      const button = document.getElementById('comicReadMode');
      button?.addEventListener('click', () => {
        button.previousElementSibling?.remove();
        button.remove();
        readMode();
        showComic();
      });
    }

    if (options.记录阅读进度) {
      const tid =
        unsafeWindow.tid ??
        new URLSearchParams(location.search).get('tid') ??
        /\/thread-(\d+)-\d+-\d+.html/.exec(location.pathname)?.[1];
      if (!tid) return;

      /** 回复数 */
      let allReplies: number | undefined;
      try {
        const res = await request(
          `/api/mobile/index.php?module=viewthread&tid=${tid}`,
          {
            responseType: 'json',
            errorText: '获取帖子回复数时出错',
            noTip: true,
          },
        );
        allReplies = Number.parseInt(
          res.response?.Variables?.thread?.allreplies,
          10,
        );
      } catch {}

      /** 当前所在页数 */
      const currentPageNum = Number.parseInt(
        querySelector('#pgt strong')?.textContent ??
          querySelector<HTMLSelectElement>('#dumppage')?.value ??
          '1',
        10,
      );

      const cache = await useCache<{ history: History }>({ history: 'tid' });
      const data = await cache.get('history', `${tid}`);
      // 如果是在翻阅之前页数的内容，则跳过不处理
      if (data && currentPageNum < data.lastPageNum) return;

      // 如果有上次阅读进度的数据，则监视上次的进度之后的楼层，否则监视所有
      /** 监视楼层列表 */
      const watchFloorList = querySelectorAll(
        data?.lastAnchor && currentPageNum === data.lastPageNum
          ? `#${data.lastAnchor} ~ div`
          : '#postlist > div, .plc.cl',
      );
      if (watchFloorList.length === 0) return;

      let id = 0;
      /** 储存数据，但是防抖 */
      const debounceSave = (saveData: History) => {
        if (id) window.clearTimeout(id);
        id = window.setTimeout(async () => {
          id = 0;
          await cache.set('history', saveData);
        }, 200);
      };

      // 在指定楼层被显示出来后重新存储进度数据
      const observer = new IntersectionObserver(
        (entries) => {
          // 找到触发楼层
          const trigger = entries.find((e) => e.isIntersecting);
          if (!trigger) return;

          // 取消触发楼层上面楼层的监视
          const triggerIndex = watchFloorList.indexOf(
            trigger.target as HTMLElement,
          );
          if (triggerIndex === -1) return;
          for (const e of watchFloorList.splice(0, triggerIndex + 1))
            observer.unobserve(e);

          // 储存数据
          debounceSave({
            tid: `${tid}`,
            lastPageNum: currentPageNum,
            lastReplies: allReplies || data?.lastReplies || 0,
            lastAnchor: trigger.target.id,
          });
        },
        { rootMargin: '-160px' },
      );
      for (const e of watchFloorList) observer.observe(e);
    }

    return;
  }

  // 判断当前页是板块
  if (/forum(?:-\d+){2}|mod=forumdisplay/.test(document.URL)) {
    if (options.修正点击页数时的跳转判定) {
      const List = querySelectorAll('.tps>a');
      let i = List.length;
      while (i--) List[i].setAttribute('onClick', 'atarget(this)');
    }

    if (options.记录阅读进度) {
      const cache = await useCache<{ history: History }>({ history: 'tid' });

      const isMobile = !document.querySelector('#flk');

      const [updateFlag, setUpdateFlag] = createSignal(false);
      const updateHistoryTag = () => setUpdateFlag((val) => !val);

      let listSelector = 'tbody[id^=normalthread]';
      let getTid = (e: HTMLElement) => e.id.split('_')[1];
      let getUrl = (data: History, tid: string) =>
        `thread-${tid}-${data.lastPageNum}-1.html#${data.lastAnchor}`;

      if (isMobile) {
        listSelector = '.threadlist li.list';
        getTid = (e: HTMLElement) =>
          new URLSearchParams(e.children[1].getAttribute('href')!).get('tid')!;
        getUrl = (data, tid) =>
          `forum.php?mod=viewthread&tid=${tid}&extra=page%3D1&mobile=2&page=${data.lastPageNum}#${data.lastAnchor}`;
      }

      for (const e of querySelectorAll(listSelector)) {
        const tid = getTid(e);

        render(
          () => {
            const [data, setData] = createSignal<History | undefined>();

            createEffectOn(updateFlag, () =>
              cache.get('history', tid).then(setData),
            );

            const url = createMemo(() => (data() ? getUrl(data()!, tid) : ''));

            const lastReplies = createMemo(() =>
              !isMobile && data()
                ? Number(e.querySelector('.num a')!.innerHTML) -
                  data()!.lastReplies
                : 0,
            );

            const pc = () => (
              <>
                <a
                  class="historyTag"
                  onClick={unsafeWindow.atarget}
                  href={url()}
                >
                  回第{data()?.lastPageNum}页{' '}
                </a>
                <Show when={lastReplies() > 0}>
                  <div class="historyTag">+{lastReplies()}</div>
                </Show>
              </>
            );

            const mobile = () => (
              <li>
                <a
                  onClick={unsafeWindow.atarget}
                  href={url()}
                  style={{ color: 'unset' }}
                >
                  回第{data()?.lastPageNum}页
                </a>
                {/* 因为移动版的回复数貌似有延迟，显示不准，所以移动版上不提示 lastReplies */}
              </li>
            );

            return (
              <Show when={Boolean(data())}>
                <Show when={isMobile} children={mobile()} fallback={pc()} />
              </Show>
            );
          },
          isMobile ? e.children[3] : e.getElementsByTagName('th')[0],
        );
      }

      // 切换回当前页时更新提示
      document.addEventListener('visibilitychange', updateHistoryTag);
      // 点击下一页后更新提示
      querySelector('#autopbn')?.addEventListener('click', updateHistoryTag);
    }
  }
})().catch((error) => log.error(error));
