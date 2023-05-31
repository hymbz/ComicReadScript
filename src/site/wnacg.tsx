import { useInit } from '../main';

declare const imglist: { url: string; caption: string }[];

(async () => {
  // 只在漫画页内运行
  if (!Reflect.has(unsafeWindow, 'imglist')) return;

  const { init } = await useInit('wnacg');

  init(() =>
    imglist
      .filter(({ caption }) => caption !== '喜歡紳士漫畫的同學請加入收藏哦！')
      .map(({ url }) => url),
  );
})();
