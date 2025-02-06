import { sleep, wait } from 'helper';
import { isAdImg } from 'userscript/detectAd';

import { store } from '../components/Manga/store';
import { activePage, getImgEle } from '../components/Manga';

import MangaMeta, { type PartialProps } from './Manga.stories';
import { imgList, waitImgLoaded } from './helper';

export default {
  ...MangaMeta,
  title: '图像识别功能',
};

const setDataUrl = (img: HTMLImageElement) => {
  const canvas = document.createElement('canvas');
  canvas.width = img.naturalWidth;
  canvas.height = img.naturalHeight;
  const ctx = canvas.getContext('2d')!;
  ctx.drawImage(img, 0, 0);
  img.src = canvas.toDataURL();
};

/** 为了 percy 能正确显示，将当前显示的图片转成 Data url */
const handlePercy = async (waitFn?: (url: string) => boolean) => {
  let doneNum = 0;

  for (const i of activePage()) {
    if (i === -1) {
      doneNum += 1;
    } else if (getImgEle(store.imgList[i])!.src.startsWith('data:')) {
      doneNum += 1;
    } else {
      const url = store.imgList[i];
      if (waitFn) await wait(() => waitFn(url));
      setDataUrl(getImgEle(url)!);
    }
  }

  if (doneNum !== activePage().length) return handlePercy(waitFn);
};

export const 识别背景色 = {
  args: {
    图源: undefined,
    imgList: [
      '/饮茶之时、女仆之梦/00.webp',
      '/饮茶之时、女仆之梦/01.webp',
      '/饮茶之时、女仆之梦/02.webp',
      '/饮茶之时、女仆之梦/03.webp',
      '/饮茶之时、女仆之梦/04.webp',
      '/饮茶之时、女仆之梦/05.webp',
      '/饮茶之时、女仆之梦/06.webp',
      '/饮茶之时、女仆之梦/29.webp',
      '/饮茶之时、女仆之梦/30.webp',
      '/杂/复杂纹路背景.webp',
      '/杂/纯黑背景.webp',
      '/杂/渐变背景.webp',
    ],
    option: { imgRecognition: { enabled: true } },
  } satisfies PartialProps,
  async play() {
    await waitImgLoaded();
    await handlePercy((url) => store.imgMap[url].background !== undefined);
  },
};

export const 自动调整页面填充 = {
  args: {
    图源: undefined,
    imgList: imgList['饮茶之时、女仆之梦（彩图）'].slice(2),
    option: { imgRecognition: { enabled: true, background: false } },
  } satisfies PartialProps,
  async play() {
    await waitImgLoaded();
    await handlePercy();
  },
};

export const 识别广告 = {
  args: {
    图源: undefined,
    imgList: [
      '/杂/二维码/广告1.webp',
      '/杂/二维码/广告2.webp',
      '/杂/二维码/广告3.webp',
      '/杂/二维码/广告4.webp',
      '/杂/二维码/1.webp',
      '/杂/二维码/2.webp',
      '/杂/二维码/3.webp',
      '/杂/二维码/4.webp',
    ],
    option: { firstPageFill: false },
  } satisfies PartialProps,
  async play() {
    await sleep(1000);

    for (const url of store.imgList) {
      await wait(() => store.imgMap[url].loadType === 'loaded');

      const img = getImgEle(url)!;
      if (await isAdImg(await createImageBitmap(img)))
        img.classList.add('blur');
    }

    await handlePercy();
  },
};
