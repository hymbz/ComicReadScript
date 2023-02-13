import { insertNode, querySelector, querySelectorAll } from '../helper';
import { useInit } from '../helper/useInit';

declare const fid: number;

(async () => {
  const { options, setFab, setManga } = await useInit('yamibo', {
    记录阅读历史: {
      Enable: true,
      上次阅读进度标签颜色: '#6e2b19',
      保留天数: -1,
    },
    关闭快捷导航按钮的跳转: true,
    修正点击页数时的跳转判定: true,
    固定导航条: true,
  });

  await GM.addStyle(
    `#fab { --fab: #6E2B19; --fab_hover: #A15640; };
    ${
      options.固定导航条 ? '.header-stackup { position: fixed !important};' : ''
    }`,
  );

  if (options.关闭快捷导航按钮的跳转)
    // eslint-disable-next-line no-script-url
    querySelector('#qmenu a')?.setAttribute('href', 'javascript:;');

  // 判断当前页是帖子
  if (/thread(-\d+){3}|mod=viewthread/.test(document.URL)) {
    // 修复微博图床的链接
    [...document.querySelectorAll('img[file*="sinaimg.cn"]')].map((e) =>
      e.setAttribute('referrerpolicy', 'no-referrer'),
    );

    // 限定板块启用
    if (fid === 30 || fid === 37) {
      let imgList = querySelectorAll<HTMLImageElement>('.t_fsz img');

      const updateImgList = () => {
        let i = imgList.length;
        while (i--) {
          const img = imgList[i];

          const file = img.getAttribute('file');
          if (file && img.src !== file) img.setAttribute('src', file);

          // 测试例子：https://bbs.yamibo.com/thread-502399-1-1.html
          // TODO: 需要找个正经的例子
          // XXX: 目前调用 updateImgList 会导致闪烁，虽然实际使用中应该很少出现，但还是优化下好

          // 删掉表情和小图
          if (
            img.src.includes('static/image') ||
            (img.complete &&
              img.naturalHeight &&
              img.naturalWidth &&
              img.naturalHeight < 500 &&
              img.naturalWidth < 500)
          )
            imgList.splice(i, 1);
        }
        return imgList.map((img) => img.src);
      };

      setManga({
        // 在图片加载完成后再检查一遍有没有小图，有就删掉
        onLoading: (img) => {
          // 跳过符合标准的
          if (img.height && img.width && img.height > 500 && img.width > 500)
            return;

          const delImgIndex = imgList.findIndex(
            (image) => image.src === img.src,
          );
          if (delImgIndex !== -1) imgList.splice(delImgIndex, 1);

          setManga({ imgList: imgList.map((image) => image.src) });
        },
      });

      updateImgList();
      const showComic = () => {
        if (imgList.length)
          setManga({ imgList: imgList.map((img) => img.src), show: true });
      };
      if (options.autoShow) showComic();

      setFab({ progress: 1, tip: '阅读模式', onClick: showComic });

      // 虽然有 Fab 了不需要这个按钮，但都点习惯了没有还挺别扭的（
      insertNode(
        querySelector('div.pti > div.authi')!,
        '<span class="pipe show">|</span><a id="comicReadMode" class="show" href="javascript:;">漫画阅读</a>',
      );
      document
        .getElementById('comicReadMode')
        ?.addEventListener('click', showComic);

      // 如果帖子内有设置目录
      if (querySelector('#threadindex')) {
        querySelectorAll('#threadindex li').forEach((dom) => {
          dom.addEventListener('click', () => {
            setTimeout(() => {
              imgList = querySelectorAll<HTMLImageElement>('.t_fsz img');
              setManga({
                imgList: updateImgList(),
                show: options.autoShow ?? undefined,
              });
            }, 1000);
          });
        });
      }
    }

    return;
  }
  console.log();
})();
