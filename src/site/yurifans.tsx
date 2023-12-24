import {
  querySelector,
  querySelectorAll,
  request,
  toast,
  useInit,
  wait,
} from '../main';

declare const b2token: string;

(async () => {
  const { options, setManga, init, needAutoShow } = await useInit('yurifans', {
    自动签到: true,
  });

  // 自动签到
  if (options.自动签到)
    (async () => {
      // 跳过未登录的情况
      if (typeof b2token === 'undefined' || !b2token) return;

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
        if (!(data?.mission?.credit === '10' || data === '10'))
          throw new Error('签到失败');

        toast('自动签到成功');
        localStorage.setItem('signDate', todayString);
      } catch (e) {
        toast.error('自动签到失败');
      }
    })();

  // 跳过漫画区外的页面
  if (!querySelector('a.post-list-cat-item[title="在线区-漫画"]')) return;

  // 需要购买的漫画
  if (querySelector('.content-hidden')) {
    const imgBody = querySelector('.content-hidden')!;
    const imgList = imgBody.getElementsByTagName('img');
    if (await wait(() => imgList.length, 1000))
      init(() => [...imgList].map((e) => e.src));
    return;
  }

  // 有折叠内容的漫画
  if (querySelector('.xControl')) {
    needAutoShow.val = false;
    const { loadImgList } = init(() => []);

    const imgListMap: HTMLCollectionOf<HTMLImageElement>[] = [];

    const loadChapterImg = (i: number) => {
      const imgList = imgListMap[i];
      loadImgList(
        [...imgList].map((e) => e.getAttribute('data-src')!),
        true,
      );

      setManga({
        onPrev: i === 0 ? undefined : () => loadChapterImg(i - 1),
        onNext:
          i === imgListMap.length - 1 ? undefined : () => loadChapterImg(i + 1),
      });
    };

    querySelectorAll('.xControl > a').forEach((a, i) => {
      const imgRoot = a.parentElement!.nextElementSibling! as HTMLElement;
      imgListMap.push(imgRoot.getElementsByTagName('img'));

      a.addEventListener('click', () => {
        // 只在打开折叠内容时进入阅读模式
        if (
          imgRoot.style.display === 'none' ||
          (imgRoot.style.height &&
            imgRoot.style.height.split('.')[0].length <= 2)
        )
          loadChapterImg(i);
      });
    });
    return;
  }

  // 没有折叠的单篇漫画
  await wait(() => querySelectorAll('.entry-content img').length);
  return init(() =>
    querySelectorAll<HTMLImageElement>('.entry-content img').map((e) => e.src),
  );
})();
