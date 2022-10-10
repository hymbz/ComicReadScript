import { showComicReadWindow } from '../components/ComicReadWindow';
import { showFab } from '../components/Fab';

// 页面自带的变量
declare const MANGABZ_CID: number;
declare const MANGABZ_MID: number;
declare const MANGABZ_VIEWSIGN_DT: string;
declare const MANGABZ_VIEWSIGN: string;
declare const MANGABZ_COOKIEDOMAIN: string;
declare const MANGABZ_CURL: string;
/** 总页数 */
declare const MANGABZ_IMAGE_COUNT: number;

const getImgList = async (imgList: string[] = []): Promise<string[]> => {
  const urlParams = Object.entries({
    cid: MANGABZ_CID,
    page: imgList.length + 1,
    key: '',
    _cid: MANGABZ_CID,
    _mid: MANGABZ_MID,
    _dt: MANGABZ_VIEWSIGN_DT.replace(' ', '+').replace(':', '%3A'),
    _sign: MANGABZ_VIEWSIGN,
  })
    .map(([key, val]) => `${key}=${val}`)
    .join('&');

  console.log(imgList.length);

  const res = await GM.xmlHttpRequest({
    method: 'GET',
    url: `http://${MANGABZ_COOKIEDOMAIN}${MANGABZ_CURL}chapterimage.ashx?${urlParams}`,
  });

  if (res.status !== 200 || !res.responseText) {
    console.error('漫画图片加载出错', res);
    throw new Error('漫画图片加载出错');
  }

  // 返回的数据只能通过 eval 获得
  // eslint-disable-next-line no-eval
  const newImgList = [...imgList, ...(eval(res.responseText) as string[])];

  if (imgList.length !== MANGABZ_IMAGE_COUNT) {
    // TODO: 通过 fab 显示进度
    // comicReadMode.innerText = `漫画加载中 - ${imgList.length}/${MANGABZ_IMAGE_COUNT}`;
    return getImgList(newImgList);
  }

  return newImgList;
};

let imgList: string[] = [];
showFab({
  onClick: () => {
    (async () => {
      if (!imgList.length) imgList = await getImgList();

      // TODO: 显示后需要将 #comicRead dom 的 display 改为 none 再改回来才能正常显示
      setTimeout(() => {
        showComicReadWindow(imgList);
      }, 1000 * 3);
    })();
  },
});
