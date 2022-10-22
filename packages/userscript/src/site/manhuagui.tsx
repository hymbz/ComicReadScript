import { querySelectorClick } from '../helper';
import { useInit } from '../helper/useInit';

declare const pVars: { manga: { filePath: string } };
declare const cInfo: { nextId: number; prevId: number };

(async () => {
  // 只在漫画页内运行
  if (!Reflect.has(unsafeWindow, 'cInfo')) return;

  const { options, showFab, toast, showManga, setManga } = await useInit(
    'manhuagui',
  );
  setManga((draftProps) => {
    draftProps.onNext =
      cInfo.nextId !== 0 ? querySelectorClick('a.nextC') : null;
    draftProps.onPrev =
      cInfo.prevId !== 0 ? querySelectorClick('a.prevC') : null;
  });

  let imgList: string[] = [];
  const showComic = () => {
    if (imgList.length === 0) {
      try {
        const comicInfo = JSON.parse(
          // 只能通过 eval 获得数据
          // eslint-disable-next-line no-eval
          eval(
            document.querySelectorAll('body > script')[1].innerHTML.slice(26),
          ).slice(12, -12),
        );
        const sl = Object.entries(comicInfo.sl)
          .map((attr) => `${attr[0]}=${attr[1]}`)
          .join('&');
        imgList = comicInfo.files.map(
          (file) => `${pVars.manga.filePath}${file}?${sl}`,
        );
        if (imgList.length === 0) throw new Error('获取漫画图片失败');
        setManga((draftProps) => {
          draftProps.imgList = imgList;
        });
      } catch (e) {
        console.error(e);
        toast('获取漫画图片失败', { type: 'error' });
      }
    }

    showManga();
  };

  showFab((draftProps) => {
    draftProps.onClick = showComic;
  });

  if (options.autoLoad) showComic();
})();
