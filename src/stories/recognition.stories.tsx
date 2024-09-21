import { wait } from 'helper';
import { isAdImg } from 'userscript/detectAd';

import { refs } from '../components/Manga/store';
import classes from '../components/Manga/index.module.css';

import MangaMeta, { type Props } from './Manga.stories';
import { imgList } from './helper';

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

const allImg = () =>
  refs.mangaFlow.querySelectorAll<HTMLImageElement>(`.${classes.img} img`);

const waitAllImg = () =>
  wait(
    () =>
      allImg().length > 0 && [...allImg()].every((img) => img.naturalWidth > 0),
    1000 * 5,
  );

const play = async () => {
  await waitAllImg();
  for (const img of allImg()) setDataUrl(img);
};

export const 识别背景色 = {
  args: {
    图源: undefined,
    imgList: [
      '/饮茶之时、女仆之梦/00.webp',
      '/饮茶之时、女仆之梦/01.webp',
      '/饮茶之时、女仆之梦/02.webp',
      '/饮茶之时、女仆之梦/03.jpeg',
      '/饮茶之时、女仆之梦/04.webp',
      '/饮茶之时、女仆之梦/05.jpeg',
      '/饮茶之时、女仆之梦/06.webp',
      '/饮茶之时、女仆之梦/29.webp',
      '/饮茶之时、女仆之梦/30.webp',
      '/杂/复杂纹路背景.jpg',
      '/杂/纯黑背景.jpg',
      '/杂/渐变背景.jpg',
    ],
    option: { imgRecognition: { enabled: true } },
  } satisfies Props,
  play,
};

export const 自动调整页面填充 = {
  args: {
    图源: undefined,
    imgList: imgList['饮茶之时、女仆之梦（彩图）'].slice(2),
    // imgList: [
    //   '/饮茶之时、女仆之梦/08.jpeg',
    //   // '/杂/纯黑背景.jpg',
    // ],
    option: { imgRecognition: { enabled: true, background: false } },
  } satisfies Props,
  play,
};

export const 识别广告 = {
  args: {
    图源: undefined,
    imgList: [
      '/杂/二维码/广告1.jpg',
      '/杂/二维码/广告2.png',
      '/杂/二维码/广告3.jpg',
      '/杂/二维码/广告4.jpg',
      '/杂/二维码/1.jpg',
      '/杂/二维码/2.jpg',
      '/杂/二维码/3.jpg',
      '/杂/二维码/4.jpg',
    ],
    option: { firstPageFill: false },
  } satisfies Props,
  async play() {
    await play();

    for (const img of allImg())
      if (await isAdImg(await createImageBitmap(img)))
        img.classList.add('blur');
  },
};
