import { isEqualArray } from '../helper';
import { showComicReadWindow } from '../helper/components';

setTimeout(async () => {
  /** 开启了自动加载的网站列表 */
  const autoLoadList = await GM.getValue<string[]>('autoLoadList', []);
  /** 是否开启了自动加载 */
  const isAutoLoad = autoLoadList.includes(window.location.hostname);
  /** 图片列表 */
  let imgList: string[] = [];
  /** 是否在等待自动加载完毕后进入阅读模式 */
  let waitAutoLoad = isAutoLoad;
  /** 是否正在后台不断检查图片 */
  let running = 0;

  /**
   * 检查搜索页面上符合标准的图片
   *
   * @returns 返回是否成功找到图片
   */
  const checkFindImg = () => {
    const newImgList = [...document.getElementsByTagName('img')]
      .filter((e) => e.naturalHeight > 500 && e.naturalWidth > 500)
      .map((e) => e.src);

    if (newImgList.length === 0) {
      if (!isAutoLoad) {
        clearInterval(running);
        // eslint-disable-next-line no-alert
        alert('没有找到图片');
      }
      return false;
    }

    // 在发现新图片后重新渲染
    if (!isEqualArray(imgList, newImgList)) imgList = newImgList;

    if (waitAutoLoad) {
      waitAutoLoad = false;
      showComicReadWindow(imgList);
    }

    return true;
  };

  if (isAutoLoad) {
    // 为了保证兼容，只能简单粗暴的不断检查网页的图片来更新数据
    running = window.setInterval(checkFindImg, 2000);

    await GM.registerMenuCommand('不再自动开启阅读模式', async () => {
      // debugger;
      autoLoadList.splice(autoLoadList.indexOf(''), 1);
      await GM.setValue('autoLoadList', autoLoadList);
    });
  }

  await GM.registerMenuCommand('进入简易漫画阅读模式', async () => {
    if (!running) running = window.setInterval(checkFindImg, 2000);

    if (checkFindImg()) {
      showComicReadWindow(imgList);
      // 成功进入阅读模式后不再自动进入
      if (waitAutoLoad) waitAutoLoad = false;
    }

    if (!isAutoLoad)
      await GM.registerMenuCommand('为此站点自动开启阅读模式', async () => {
        await GM.setValue('autoLoadList', [
          ...autoLoadList,
          window.location.hostname,
        ]);
      });
  });
});
