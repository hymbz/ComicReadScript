import {
  getMostItem,
  loop,
  querySelector,
  querySelectorAll,
  useInit,
  wait,
} from 'main';

(async () => {
  /** 执行脚本操作。如果中途中断，将返回 true */
  const start = async () => {
    const { setManga, setFab, init, options, setOptions } = await useInit(
      window.location.hostname,
      { 记住当前站点: true, selector: '' },
    );

    // 通过 options 来迂回的实现禁止记住当前站点
    if (!options['记住当前站点']) {
      await GM.deleteValue(window.location.hostname);
      return true;
    }

    // 为避免卡死，提供一个删除 selector 的菜单项
    const menuId = await GM.registerMenuCommand('使用简易阅读模式', () => {
      setOptions({ selector: '' });
    });

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
      // 本来只是图片元素的 innerHTML，但经过东方永夜机加载后就会变成真的图片元素，导致重复
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
    const triggerLazyLoad = () => {
      let nowScroll = window.scrollY;
      // 滚到底部再滚回来，触发可能存在的自动翻页脚本
      window.scroll({
        top: document.body.scrollHeight,
        behavior: 'auto',
      });
      document.body.dispatchEvent(new Event('scroll', { bubbles: true }));
      window.scroll({ top: nowScroll, behavior: 'auto' });

      // 过滤掉已经被触发过懒加载的图片
      const targetImgList = getAllImg().filter((e) => !triggedImgList.has(e));

      /** 上次触发的图片 */
      let lastTriggedImg: HTMLImageElement | undefined;

      for (let i = 0; i < targetImgList.length; i++) {
        const e = targetImgList[i];
        triggedImgList.add(e);
        tryCorrectUrl(e);

        // 过滤掉位置相近，在触发上一张图片时已经顺带被触发了的
        if (
          e.offsetTop >=
          (lastTriggedImg?.offsetTop ?? 0) + window.innerHeight
        )
          return;

        // 通过滚动到图片位置、触发滚动事件、再滚回来，来触发图片的懒加载
        // 因为速度很快所以应该是无感的
        nowScroll = window.scrollY;
        window.scroll({ top: e.offsetTop, behavior: 'auto' });
        e.dispatchEvent(new Event('scroll', { bubbles: true }));
        window.scroll({ top: nowScroll, behavior: 'auto' });

        lastTriggedImg = e;
      }
    };

    const getImgList = () => {
      triggerLazyLoad();

      const imgEleList = getAllImg().filter(
        (e) => e.naturalHeight > 500 && e.naturalWidth > 500,
      );
      saveImgEleSelector(imgEleList);
      return imgEleList.map((e) => e.src);
    };

    const { loadImgList } = init(getImgList);

    /** 重新检查 imgList，并在发生变化时更新相关组件 */
    const checkImgList = () => {
      const newImgList = getImgList();

      if (newImgList.length === 0) {
        setFab({ show: false });
        setManga({ show: false });
        return;
      }

      return loadImgList(newImgList);
    };

    // 为保证兼容，只能简单粗暴的不断检查
    loop(checkImgList, 1000);
  };

  if ((await GM.getValue(window.location.hostname)) !== undefined) start();
  else {
    const menuId = await GM.registerMenuCommand('使用简易阅读模式', () => {
      if (!start()) GM.unregisterMenuCommand(menuId);
    });
  }
})();
