/* eslint-disable camelcase */
import { useInit } from '../helper/useInit';

declare const img_data_arr: string[];
declare const img_pre: string;
declare const asset_domain: string;
declare const asset_key: string;
declare const chapter_num: number;
declare const chapter_type: number;
declare const cdnImage: (a: string, b: string, c: string) => string;
declare const goNumPage: (a: string) => void;
declare const $: any;

(async () => {
  // 只在漫画页内运行
  if (!Reflect.has(unsafeWindow, 'cdnImage')) return;

  const { options, setFab, setManga, createShowComic } = await useInit(
    'manhuacat',
  );

  /**
   * 检查是否有上/下一页
   */
  const checkTurnPage = async (type: 'pre' | 'next') => {
    const res = await $.ajax({
      type: 'get',
      url: `/chapter_num?chapter_id=${chapter_num}&ctype=${
        type === 'next' ? 1 : 2
      }&type=${chapter_type}`,
      dataType: 'json',
    });

    if (res.code === '0000') return () => goNumPage(type);

    return null;
  };
  setManga({
    onNext: await checkTurnPage('next'),
    onPrev: await checkTurnPage('pre'),
  });

  const showComic = createShowComic(() =>
    img_data_arr.map((img) => cdnImage(img_pre + img, asset_domain, asset_key)),
  );
  setFab({ onClick: showComic });

  if (options.autoShow) await showComic();
})();
