import { dataToParams, querySelectorClick, useInit } from '../main';

declare const img_data_arr: { img: string }[];
declare const img_host: string;
declare const img_pre: string;
declare const p_ccid: number;
declare const p_id: number;
declare const p_d: number;
declare const vg_r_data: any;
declare const $: any;

(async () => {
  // 只在漫画页内运行
  if (!Reflect.has(unsafeWindow, 'img_data_arr')) return;

  const { setManga, init } = await useInit('manhuaDB');

  /**
   * 检查是否有上/下一话
   */
  const checkTurnPage = async (type: 'pre' | 'next') => {
    const res = await $.ajax({
      method: 'POST',
      url: '/book/goNumPage',
      dataType: 'json',
      data: dataToParams({
        ccid: p_ccid,
        id: p_id,
        num: (vg_r_data.data('num') as number) + (type === 'next' ? 1 : -1),
        d: p_d,
        type,
      }),
    });

    if (res.state)
      return querySelectorClick(
        `a[title="${type === 'next' ? '下集' : '上集'}"]`,
      );

    return undefined;
  };
  setManga({
    onNext: await checkTurnPage('next'),
    onPrev: await checkTurnPage('pre'),
  });

  init(() => img_data_arr.map((data) => `${img_host}/${img_pre}/${data.img}`));
})();
