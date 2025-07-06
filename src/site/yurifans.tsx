import { request, toast, useInit } from 'main';
import { querySelector, querySelectorAll, wait } from 'helper';

declare const b2token: string;

// 单篇
// https://yuri.website/162404/
// 连载折叠
// https://yuri.website/148990/
// 需要购买
// https://yuri.website/147642/
// https://yuri.website/122684/
// 在线区
// https://yuri.website/40064/

(async () => {
  const { store, _setState, showComic, init } = await useInit('yurifans', {
    自动签到: true,
  });

  // 自动签到
  if (store.options.自动签到)
    (async () => {
      // 跳过未登录的情况
      if (!globalThis.b2token) return;

      const todayString = new Date().toLocaleDateString('zh-CN');
      // 判断当前日期与上次成功签到日期是否相同
      if (todayString === localStorage.getItem('signDate')) return;

      try {
        const res = await request('/wp-json/b2/v1/userMission', {
          method: 'POST',
          noTip: true,
          headers: { Authorization: `Bearer ${b2token}` },
        });
        const data = JSON.parse(res.responseText);

        // 首次成功签到 或 重复签到
        if (!(data?.mission?.date || !Number.isNaN(Number(data))))
          throw new Error('签到失败');

        toast('自动签到成功');
        localStorage.setItem('signDate', todayString);
      } catch {
        toast.error('自动签到失败');
      }
    })();

  // 跳过漫画区外的页面
  if (!querySelector('a.post-list-cat-item[title="在线区-漫画"]')) return;

  // 需要购买的漫画
  if (querySelector('.content-hidden')) {
    const imgBody = querySelector('.content-hidden')!;
    const imgList = imgBody.getElementsByTagName('img');
    if (await wait(() => imgList.length, 1000)) {
      const getImgList = () => [...imgList].map((e) => e.src);
      _setState('comicMap', '', { getImgList });
    }
    return;
  }

  // 有折叠内容的漫画
  if (querySelector('.xControl')) {
    _setState('flag', 'needAutoShow', false);

    const switchChapter = async (i: number) => {
      showComic(i);

      _setState('manga', {
        onPrev: Reflect.has(store.comicMap, i - 1)
          ? () => switchChapter(i - 1)
          : undefined,
        onNext: Reflect.has(store.comicMap, i + 1)
          ? () => switchChapter(i + 1)
          : undefined,
      });
    };

    for (const [i, a] of querySelectorAll('.xControl > a').entries()) {
      const item = a.parentElement!.nextElementSibling! as HTMLElement;
      const getImgList = () =>
        [...item.querySelectorAll('img')].map((e) => e.dataset.src ?? e.src);
      _setState('comicMap', i, { getImgList });

      // 只在打开折叠内容时进入阅读模式
      a.addEventListener('click', () => item.style.display && switchChapter(i));
    }
    init();

    return;
  }

  // 没有折叠的单篇漫画
  await wait(() => querySelectorAll('.entry-content img').length);
  const getImgList = () =>
    querySelectorAll<HTMLImageElement>('.entry-content img').map(
      (e) => e.dataset.src || e.src,
    );
  _setState('comicMap', '', { getImgList });
})();
