// 这个文件里不能含有 jsx 代码，否则会在打包时自动加入 import solidjs 的代码

import { getInitLang } from 'helper/languages';
import {
  t,
  getMostItem,
  loop,
  querySelector,
  querySelectorAll,
  useInit,
  wait,
  toast,
  triggerEleLazyLoad,
  autoReadModeMessage,
  testImgUrl,
  canvasToBlob,
  plimit,
} from 'main';
import { debounce } from 'throttle-debounce';

// 测试案例
// https://www.177picyy.com/html/2023/03/5505307.html
//  需要配合其他翻页脚本使用
// https://www.colamanga.com/manga-za76213/1/5.html
//  直接跳转到图片元素不会立刻触发，还需要停留20ms
// https://www.colamanga.com/manga-kg45140/1/2.html
//  使用 URL.createObjectURL 后马上 URL.revokeObjectURL 的 URL

(async () => {
  /** 执行脚本操作。如果中途中断，将返回 true */
  const start = async () => {
    const {
      setManga,
      setFab,
      init,
      options,
      setOptions,
      isStored,
      mangaProps,
      _setManga,
    } = await useInit(window.location.hostname, {
      remember_current_site: true,
      selector: '',
    });

    // 通过 options 来迂回的实现禁止记住当前站点
    if (!options.remember_current_site) {
      await GM.deleteValue(window.location.hostname);
      return true;
    }

    if (!isStored)
      toast(autoReadModeMessage(setOptions), { duration: 1000 * 7 });

    // 为避免卡死，提供一个删除 selector 的菜单项
    const menuId = await GM.registerMenuCommand(
      t('site.simple.simple_read_mode'),
      () => setOptions({ selector: '' }),
    );

    // 等待 selector 匹配到目标后再继续执行，避免在漫画页外的其他地方运行
    await wait(() => !options.selector || querySelector(options.selector));

    await GM.unregisterMenuCommand(menuId);

    /** 获取元素仅记录了层级结构关系的 selector */
    const getEleSelector = (ele: HTMLElement) => {
      const parents: string[] = [ele.nodeName];
      const root = ele.getRootNode();
      let e = ele;
      while (e.parentNode && e.parentNode !== root) {
        e = e.parentNode as HTMLElement;
        parents.push(e.nodeName);
      }
      return parents.reverse().join('>');
    };

    /** 记录传入的图片元素中最常见的那个 selector */
    const saveImgEleSelector = (imgEleList: HTMLElement[]) => {
      if (imgEleList.length < 7) return;
      const selector = getMostItem(imgEleList.map(getEleSelector));
      if (selector !== options.selector) setOptions({ selector });
    };

    /** 用于判断是否是图片 url 的正则 */
    const isImgUrlRe =
      /^(((https?|ftp|file):)?\/)?\/[-A-Za-z0-9+&@#/%?=~_|!:,.;]+[-A-Za-z0-9+&@#%=~_|]$/;

    /** 检查元素属性，将格式为图片 url 的属性值作为 src */
    const tryCorrectUrl = (e: HTMLImageElement) => {
      e.getAttributeNames().some((key) => {
        // 跳过白名单
        switch (key) {
          case 'src':
          case 'alt':
          case 'class':
          case 'style':
          case 'id':
          case 'title':
          case 'onload':
          case 'onerror':
            return false;
        }

        const val = e.getAttribute(key)!.trim();
        if (!isImgUrlRe.test(val)) return false;
        e.setAttribute('src', val);
        return true;
      });
    };

    const blobUrlMap: Map<string, string> = new Map();
    // 处理那些 URL.createObjectURL 后马上 URL.revokeObjectURL 的图片
    const handleBlobImg = async (e: HTMLImageElement): Promise<string> => {
      if (blobUrlMap.has(e.src)) return blobUrlMap.get(e.src)!;
      if (!e.src.startsWith('blob:')) return e.src;
      if (await testImgUrl(e.src)) return e.src;

      const canvas = document.createElement('canvas');
      const canvasCtx = canvas.getContext('2d')!;

      canvas.width = e.naturalWidth;
      canvas.height = e.naturalHeight;
      canvasCtx.drawImage(e, 0, 0);

      const url = URL.createObjectURL(await canvasToBlob(canvas));
      blobUrlMap.set(e.src, url);
      return url;
    };

    const imgBlackList = [
      // 东方永夜机的预加载图片
      '#pagetual-preload',
      // 177picyy 上会在图片下加一个 noscript
      // 本来只是图片元素的 html 代码，但经过东方永夜机加载后就会变成真的图片元素，导致重复
      'noscript',
    ];
    const getAllImg = () =>
      querySelectorAll<HTMLImageElement>(
        `:not(${imgBlackList.join(',')}) > img`,
      )
        // 根据位置从小到大排序
        .sort((a, b) => a.offsetTop - b.offsetTop);

    // 使用 triggerEleLazyLoad 会导致正常的滚动在滚到一半时被打断，所以加个锁限制一下
    let scrollLock = false;
    const closeScrollLock = debounce(1000, () => {
      scrollLock = false;
    });
    window.addEventListener('scroll', () => {
      if (scrollLock || mangaProps.show) return;
      scrollLock = true;
      closeScrollLock();
    });
    const getScrollLock = () => !scrollLock;

    /** 已经被触发过懒加载的图片 */
    const triggedImgList: Set<HTMLImageElement> = new Set();

    /** 触发懒加载 */
    const triggerLazyLoad = async () => {
      const nowScroll = window.scrollY;
      // 滚到底部再滚回来，触发可能存在的自动翻页脚本
      window.scroll({
        top: document.body.scrollHeight,
        behavior: 'auto',
      });
      document.body.dispatchEvent(new Event('scroll', { bubbles: true }));
      window.scroll({ top: nowScroll, behavior: 'auto' });

      // 过滤掉已经被触发过懒加载的图片
      const targetImgList = getAllImg().filter((e) => !triggedImgList.has(e));

      const oldSrcList = targetImgList.map((e) => e.src);

      for (let i = 0; i < targetImgList.length; i++) {
        await wait(getScrollLock);
        const e = targetImgList[i];
        tryCorrectUrl(e);

        // 只在`开启了阅读模式所以用户看不到网页滚动`和`当前可显示图片数量不足`时，
        // 才在触发懒加载时停留一段时间，避免用户看着页面跳来跳去操作不了
        const lazyLoadWaitTime =
          mangaProps.show || mangaProps.imgList.length < 2 ? 300 : 0;

        await triggerEleLazyLoad(e, lazyLoadWaitTime, oldSrcList[i]);

        if (
          // src 发生改变的肯定是成功触发了的
          oldSrcList[i] !== e.src ||
          // 停留过一段时间还没触发的大概率是没有懒加载的
          // 虽然也有概率误判，但到时再加长等待时间就是了
          // 不把停留过的图片忽略掉的话，遇上图片元素多的站点要等很久才能触发完一遍
          lazyLoadWaitTime
        )
          triggedImgList.add(e);
      }
    };

    let imgEleList: HTMLImageElement[];
    const updateImgList = async () => {
      imgEleList = await wait(() => {
        const newImgList = getAllImg().filter(
          (e) => e.naturalHeight > 500 && e.naturalWidth > 500,
        );
        return newImgList.length > 2 && newImgList;
      });

      if (imgEleList.length === 0) {
        setFab({ show: false });
        setManga({ show: false });
        return;
      }

      let isEdited = false;
      await plimit(
        imgEleList.map((e, i) => async () => {
          const newUrl = await handleBlobImg(e);
          if (newUrl === mangaProps.imgList[i]) return;

          if (!isEdited) isEdited = true;
          _setManga('imgList', i, newUrl);
        }),
      );
      if (isEdited) saveImgEleSelector(imgEleList);
    };

    init(async () => {
      if (!imgEleList) {
        imgEleList = [];
        // 为保证兼容，只能简单粗暴的不断检查
        loop(triggerLazyLoad, 500);
        loop(updateImgList, 1000);
      }
      await wait(() => mangaProps.imgList.some(Boolean));
      return mangaProps.imgList;
    });
  };

  if ((await GM.getValue(window.location.hostname)) !== undefined)
    return start();

  const menuId = await GM.registerMenuCommand(
    extractI18n('site.simple.simple_read_mode')(await getInitLang()),
    () => !start() && GM.unregisterMenuCommand(menuId),
  );
})();
