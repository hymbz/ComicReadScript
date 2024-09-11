// import { plimit, waitImgLoad } from 'helper';
// import { request, toast } from 'main';
// import ssim from 'ssim.js';

// import { refs } from '../store';

// /** 获取图片差异像素百分比 */
// const getImgDiff = (img1: ImageData, img2: ImageData) => {
//   if (img1.width !== img2.width || img1.height !== img2.height)
//     return Number.POSITIVE_INFINITY;

//   return (ssim(img1, img2).mssim * 100).toFixed(2);
// };

// // 通过检查图片之间的相似度，可以做到
// // - 识别本子中的变体图片，将变体图片单独一页显示
// // - 识别重复的开头封面页，并据此调整首页填充
// //   不过同时也需要识别空白页
// //   https://exhentai.org/g/3041320/bba04dfd03/
// //   https://exhentai.org/g/1582816/62662286d3/
// //   https://exhentai.org/g/3030900/f24c13885d/
// //   https://exhentai.org/g/3034432/47e890be54/ (空白页较多)

// // 目前问题
// // - 网页图片收到 CORS 影响无法直接获取图片数据
// //   改用油猴扩展来下载图片的话又没办法：缓存图片、在加载图片时实时显示进度
// //   （解决图片 CORS 问题后还能参考 mihon 实现自动背景色
// //   （https://github.com/mihonapp/mihon/blob/9c1905ede750f0229fad1a01431058b1cc9fb32d/core/common/src/main/kotlin/tachiyomi/core/common/util/system/ImageUtil.kt#L312-L528
// // - ssim 略笨重改成其他库或用 https://juejin.cn/post/6844904018830065671 比较好
// // - 目前大部分图像对比都不支持不同尺寸的图片对比，因此无法识别一些本子的封面
// //   https://exhentai.org/g/3043159/b865dcdb05/
// // - 通过检测图片的空白边，判断图片的左右位置
// // - 通过检测两张图片拼接在一起后的边缘像素的灰度值是否相同，来判断两张图片是否可以合并

// const getImageData = async (imgEle: HTMLImageElement) => {
//   const url = imgEle.src;

//   const { naturalWidth: width, naturalHeight: height } = imgEle;

//   const img = new Image();
//   img.crossOrigin = 'anonymous';

//   try {
//     await new Promise((resolve, reject) => {
//       img.onload = resolve;
//       img.onerror = reject;
//       img.src = url;
//     });
//   } catch {
//     const res = await request<Blob>(
//       url,
//       { responseType: 'blob', fetch: false },
//       3,
//     );
//     img.src = URL.createObjectURL(res.response);
//     await waitImgLoad(img);
//   }

//   const canvas = new OffscreenCanvas(width, height);
//   const ctx = canvas.getContext('2d')!;
//   ctx.drawImage(img, 0, 0, width, height);
//   return ctx.getImageData(0, 0, width, height);
// };

// // 测试用
// /** 显示所有图片的差异比 */
// export const showAllImgDiff = async () => {
//   const imgList = [...refs.root.querySelectorAll('img')];

//   const imgDataList = await plimit(
//     imgList.map((img) => () => getImageData(img)),
//     (doneNum, totalNum) => toast(`${doneNum}/${totalNum}`),
//     2,
//   );

//   console.log(1);
//   for (let i = 1; i < imgList.length; i++) {
//     console.log('---', getImgDiff(imgDataList[i], imgDataList[i - 1]));
//     console.log(i + 1);
//   }
// };

// if (isDevMode)
//   Object.assign((window as any).unsafeWindow ?? window, {
//     test: showAllImgDiff,
//   });
