import { isEqualArray } from './helper';
import { showComicReadWindow } from './helper/components';

// 匹配站点
switch (window.location.hostname) {
  case 'i.dmzj.com':
  case 'm.dmzj.com':
  case 'manhua.dmzj.com': {
    // '@@DMZJScript.@@';
    break;
  }
  default: {
    setTimeout(async () => {
      const autoLoadList = await GM.getValue<string[]>('autoLoadList', []);
      /** 是否开启了自动加载 */
      const isAutoLoad = autoLoadList.includes(window.location.hostname);
      let imgList: string[] = [];

      /**
       * 检查并加载图片
       *
       * @returns 返回是否成功加载
       */
      const checkAndLoad = () => {
        const newImgList = [...document.getElementsByTagName('img')]
          .filter((e) => e.naturalHeight > 500 && e.naturalWidth > 500)
          .map((e) => e.src);

        if (newImgList.length === 0) {
          // eslint-disable-next-line no-alert
          if (!isAutoLoad) alert('没有找到图片');
          return false;
        }

        // 在发现新图片后重新渲染
        if (!isEqualArray(imgList, newImgList)) showComicReadWindow(newImgList);
        imgList = newImgList;

        return true;
      };

      let running = false;

      // 为了保证兼容，只能简单粗暴的不断检查网页的图片来更新数据
      if (isAutoLoad && !running) running = !!setInterval(checkAndLoad, 2000);

      await GM.registerMenuCommand('进入简易漫画阅读模式', async () => {
        if (checkAndLoad() && !isAutoLoad) {
          if (!running) running = !!setInterval(checkAndLoad, 2000);

          await GM.registerMenuCommand('为此站点自动开启阅读模式', async () => {
            await GM.setValue('autoLoadList', [
              ...autoLoadList,
              window.location.hostname,
            ]);
          });
        }
      });
      if (isAutoLoad) {
        await GM.registerMenuCommand('不再自动开启阅读模式', async () => {
          debugger;
          autoLoadList.splice(autoLoadList.indexOf(''), 1);
          await GM.setValue('autoLoadList', autoLoadList);
        });
        checkAndLoad();
      }
    });
  }
}
