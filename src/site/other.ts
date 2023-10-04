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
  isEqualArray,
} from 'main';

// 测试案例
// https://www.colamanga.com/manga-za76213/1/5.html
//  直接跳转到图片元素不会立刻触发，还需要停留20ms
// https://www.177picyy.com/html/2023/03/5505307.html
//  需要配合其他翻页脚本使用

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
        const e = targetImgList[i];
        tryCorrectUrl(e);
        await triggerEleLazyLoad(
          e,
          // 只在`开启了阅读模式所以用户看不到网页滚动`和`当前可显示图片数量不足`时，
          // 才在触发懒加载时停留一段时间，避免用户看着页面跳来跳去操作不了
          mangaProps.show || mangaProps.imgList.length < 2 ? 300 : 0,
          oldSrcList[i],
        );
        if (oldSrcList[i] !== e.src) triggedImgList.add(e);
      }
    };

    let imgEleList: HTMLImageElement[];
    const getImgList = async () => {
      imgEleList = await wait(() => {
        const newImgList = getAllImg().filter(
          (e) => e.naturalHeight > 500 && e.naturalWidth > 500,
        );
        return newImgList.length > 2 && newImgList;
      });
      return imgEleList.map((e) => e.src);
    };

    let loadImgList: ReturnType<typeof init>['loadImgList'];
    /** 重新检查 imgList，并在发生变化时更新相关组件 */
    const checkImgList = async () => {
      const newImgList = await getImgList();
      if (newImgList.length === 0) {
        setFab({ show: false });
        setManga({ show: false });
        return;
      }
      if (!isEqualArray(newImgList, mangaProps.imgList)) {
        saveImgEleSelector(imgEleList);
        return loadImgList(newImgList);
      }
    };

    loadImgList = init(() => {
      if (!imgEleList) {
        imgEleList = [];
        // 为保证兼容，只能简单粗暴的不断检查
        loop(triggerLazyLoad);
        loop(checkImgList, 1000);
      }
      return getImgList();
    }).loadImgList;
  };

  if ((await GM.getValue(window.location.hostname)) !== undefined)
    return start();

  const menuId = await GM.registerMenuCommand(
    extractI18n('site.simple.simple_read_mode')(await getInitLang()),
    () => !start() && GM.unregisterMenuCommand(menuId),
  );
})();
