import { wait } from 'helper';

import { refs } from '../components/Manga/store';
import classes from '../components/Manga/index.module.css';

import MangaMeta, { type Props } from './Manga.stories';
import { imgList, waitImgLoaded } from './helper';

export default {
  ...MangaMeta,
  title: '图像识别功能',
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
  async play() {
    await wait(
      () =>
        refs.mangaFlow.querySelector<HTMLElement>(`.${classes.img}`)?.style
          .backgroundColor !== 'var(--bg)',
      1000 * 5,
    );

    // 将 blobURL 转换为 dataURL，以便 percy 能正确显示
    const imgElement = refs.mangaFlow.querySelector<HTMLImageElement>(
      `.${classes.img} img`,
    )!;
    const canvas = document.createElement('canvas');
    canvas.width = imgElement.naturalWidth;
    canvas.height = imgElement.naturalHeight;
    const ctx = canvas.getContext('2d')!;
    ctx.drawImage(imgElement, 0, 0);
    const dataURL = canvas.toDataURL();
    imgElement.src = dataURL;

    await waitImgLoaded();
  },
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
  async play() {
    await wait(
      () =>
        refs.mangaFlow.querySelector<HTMLElement>(`.${classes.img}`)?.style
          .backgroundColor !== 'var(--bg)',
      1000 * 5,
    );

    // 将 blobURL 转换为 dataURL，以便 percy 能正确显示
    const imgElement = refs.mangaFlow.querySelector<HTMLImageElement>(
      `.${classes.img} img`,
    )!;
    const canvas = document.createElement('canvas');
    canvas.width = imgElement.naturalWidth;
    canvas.height = imgElement.naturalHeight;
    const ctx = canvas.getContext('2d')!;
    ctx.drawImage(imgElement, 0, 0);
    const dataURL = canvas.toDataURL();
    imgElement.src = dataURL;

    await waitImgLoaded();
  },
};
