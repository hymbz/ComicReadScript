import MangaMeta, { type Props } from './Manga.stories';

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
    ],
    option: { imgRecognition: { enabled: true } },
  } satisfies Props,
};
