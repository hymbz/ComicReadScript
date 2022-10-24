/* eslint-disable camelcase */
import { querySelectorClick, sleep } from '../helper';
import { useInit } from '../helper/useInit';

// 页面自带的变量
declare const DM5_CID: number;
declare const DM5_MID: number;
declare const DM5_VIEWSIGN_DT: string;
declare const DM5_VIEWSIGN: string;
/** 漫画页数 */
declare const DM5_IMAGE_COUNT: number;
declare const $: any;

(async () => {
  // 只在漫画页内运行
  if (!Reflect.has(unsafeWindow, 'DM5_CID')) return;

  const { options, showFab, toast, setManga, createShowComic } = await useInit(
    'dm5',
  );
  setManga({
    onNext: querySelectorClick('.logo_2'),
    onPrev: querySelectorClick('.logo_1'),
  });

  const getImgList = async (
    imgList: string[] = [],
    errorNum = 0,
  ): Promise<string[]> => {
    try {
      const res = await $.ajax({
        type: 'GET',
        url: 'chapterfun.ashx',
        data: {
          cid: DM5_CID,
          page: imgList.length + 1,
          key: $('#dm5_key').length ? $('#dm5_key').val() : '',
          language: 1,
          gtk: 6,
          _cid: DM5_CID,
          _mid: DM5_MID,
          _dt: DM5_VIEWSIGN_DT,
          _sign: DM5_VIEWSIGN,
        },
      });

      // 返回的数据只能通过 eval 获得
      // eslint-disable-next-line no-eval
      const newImgList = [...imgList, ...(eval(res) as string[])];

      if (newImgList.length !== DM5_IMAGE_COUNT) {
        showFab({
          progress: newImgList.length / DM5_IMAGE_COUNT,
          tip: `加载中 - ${newImgList.length}/${DM5_IMAGE_COUNT}`,
        });
        return getImgList(newImgList);
      }

      showFab({ progress: 1, tip: '阅读模式' });

      return newImgList;
    } catch (error) {
      if (errorNum > 3) throw new Error('漫画图片加载出错');
      console.error('漫画图片加载出错');
      toast('漫画图片加载出错', { type: 'error' });
      await sleep(1000 * 3);
      return getImgList(imgList, errorNum + 1);
    }
  };

  const showComic = createShowComic(getImgList);

  showFab({ onClick: showComic });

  if (options.autoLoad) await showComic();
})();
