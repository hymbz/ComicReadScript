import { querySelector, querySelectorAll } from '../helper';
import { useInit } from '../helper/useInit';

declare const fid: number;

(async () => {
  const { options, showFab, setManga, showManga, createShowComic } =
    await useInit('yamibo', {
      记录阅读历史: {
        Enable: true,
        上次阅读进度标签颜色: '#6e2b19',
        保留天数: -1,
      },
      关闭快捷导航按钮的跳转: true,
      修正点击页数时的跳转判定: true,
      固定导航条: true,
    });

  if (options.关闭快捷导航按钮的跳转)
    // eslint-disable-next-line no-script-url
    querySelector('#qmenu a')?.setAttribute('href', 'javascript:;');
  if (options.固定导航条)
    await GM.addStyle('.header-stackup { position: fixed !important }');

  // 判断当前页是帖子
  if (/thread(-\d+){3}|mod=viewthread/.test(document.URL)) {
    // 修复微博图床的链接
    [...document.querySelectorAll('img[file*="sinaimg.cn"]')].map((e) =>
      e.setAttribute('referrerpolicy', 'no-referrer'),
    );

    // 限定板块启用
    if (fid === 30 || fid === 37) {
      let imgList = querySelectorAll<HTMLImageElement>('.t_fsz img');

      const isValidImg = (img: HTMLImageElement) =>
        !img.src.includes('static/image') &&
        img.naturalHeight &&
        img.naturalWidth &&
        img.naturalHeight > 500 &&
        img.naturalWidth > 500;

      const updateImgList = () => {
        let i = imgList.length;
        while (i--) {
          const img = imgList[i];

          const file = img.getAttribute('file');
          if (file && img.src !== file) img.setAttribute('src', file);

          // 删掉表情和小图
          // TODO: 待测试删除小图的功能，找不到例子了
          if (img.complete) {
            if (!isValidImg(img)) {
              imgList.splice(i, 1);
              imgList = [...imgList];
            }
          } else {
            const index = i;
            // eslint-disable-next-line no-loop-func
            img.addEventListener('load', () => {
              if (!isValidImg(img)) {
                imgList.splice(index, 1);
                imgList = [...imgList];
                setManga({ imgList: imgList.map((image) => image.src) });
              }
            });
          }
        }
        return imgList.map((img) => img.src);
      };

      const showComic = createShowComic(updateImgList);

      showFab({ onClick: showComic });

      if (options.autoLoad) await showComic();

      // 如果帖子内有设置目录
      if (querySelector('#threadindex')) {
        querySelectorAll('#threadindex li').forEach((e) => {
          e.addEventListener('click', () => {
            imgList = querySelectorAll<HTMLImageElement>('.t_fsz img');
            if (options.autoLoad) showManga({ imgList: updateImgList() });
            else setManga({ imgList: updateImgList() });
            // if (options.autoLoad) await showComic();
            // eslint-disable-next-line no-param-reassign
            // e.onclick = null;
            // ajaxget(
            //   ...e
            //     .getAttribute('onclick')
            //     .match(/'.+?'/g)
            //     .map((e) => e.slice(1, -1)),
            //   '',
            //   'block',
            //   setTimeout(() => {
            //     adaptationMenu();
            //     procImg();
            //   }, 1000),
            // );
          });
        });
      }
    }

    return;
  }
  debugger;
})();
