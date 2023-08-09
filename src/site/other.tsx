import { loop, useInit } from 'main';

(async () => {
  /** 执行脚本操作。如果中途中断，将返回 true */
  const start = async () => {
    const { setManga, setFab, init, options } = await useInit(
      window.location.hostname,
      { 记住当前站点: true },
    );

    // 通过 options 来迂回的实现禁止记住当前站点
    if (!options['记住当前站点']) {
      await GM.deleteValue(window.location.hostname);
      return true;
    }

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

    const getAllImg = () =>
      [...document.getElementsByTagName('img')]
        // 根据位置从小到大排序
        .sort((a, b) => a.offsetTop - b.offsetTop);

    /** 已经被触发过懒加载的图片 */
    const triggedImgList: Set<HTMLImageElement> = new Set();

    /** 触发懒加载 */
    const triggerLazyLoad = () => {
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

        // 通过瞬间滚动到图片位置、触发滚动事件、再瞬间滚回来，来触发图片的懒加载
        const nowScroll = window.scrollY;
        window.scroll({ top: e.offsetTop, behavior: 'auto' });
        e.dispatchEvent(new Event('scroll', { bubbles: true }));
        window.scroll({ top: nowScroll, behavior: 'auto' });

        lastTriggedImg = e;
      }
    };

    const getImgList = () => {
      triggerLazyLoad();
      return getAllImg()
        .filter((e) => e.naturalHeight > 500 && e.naturalWidth > 500)
        .map((e) => e.src);
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
