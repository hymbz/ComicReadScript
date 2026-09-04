import MdDelete from '@material-design-icons/svg/round/delete.svg';
import { toast, useInit } from 'core';
import {
  createEffectOn,
  exposeToGlobal,
  onUrlChange,
  t,
  throttle,
  waitDom,
} from 'helper';
import { AutoImageScanner } from 'userscript/autoImageScanner';

// 测试案例
// https://www.177picyy.com/html/2023/03/5505307.html
// 需要配合其他翻页脚本使用
// https://www.yoyomanga.com/manga-wb620593/1/2.html
// 直接跳转到图片元素不会立刻触发，还需要停留20ms
// https://www.yoyomanga.com/manga-me955535/1/1.html
// 使用 URL.createObjectURL 后马上 URL.revokeObjectURL 的 URL

/** 执行脚本操作。如果中途中断，将返回 true */
export const otherSite = async () => {
  let laseScroll = window.scrollY;

  const { store, setState, options, setOptions } = await useInit(
    location.hostname,
    { remember_current_site: true, selector: '' },
  );

  // 将「不再记住当前站点」作为一次性动作按钮加入菜单，使用显眼的图标标识
  setState('fab', {
    optionsSpeedDial: [],
    extraSpeedDial: [
      {
        name: t('site.add_feature.remember_current_site'),
        onClick: () => setOptions({ remember_current_site: false }),
        icon: MdDelete,
      },
    ],
  });

  // 点击按钮后立刻删掉记住当前站点的配置
  createEffectOn(
    () => options.remember_current_site,
    async (remember) => {
      if (remember) return;
      await GM.deleteValue(location.hostname);
      location.reload();
    },
  );

  if (!store.flag.isStored)
    toast(
      () => (
        <div>
          {t('site.simple.auto_read_mode_message')}
          <button on:click={() => setOptions({ autoShow: false })}>
            {t('other.disable')}
          </button>
        </div>
      ),
      { duration: 1000 * 7 },
    );

  // 为避免卡死，提供一个删除 selector 的菜单项
  const menuId = await GM.registerMenuCommand(
    t('site.simple.simple_read_mode'),
    () => setOptions({ selector: '' }),
  );
  await GM.unregisterMenuCommand(menuId);

  let timeout = 0;

  const scanner = new AutoImageScanner({
    selector: options.selector,
    onImgListChange: (imgList) => setState('comicMap', '', 'imgList', imgList),
    onEmpty: () =>
      setState((state) => {
        state.fab.show = false;
        state.manga.show = false;
      }),
    onChapterSwitchChange: ({ next, prev }) =>
      setState('manga', { onPrev: prev, onNext: next }),
    onSelectorSuggest: (selector) => setOptions({ selector }),
    // 只在`开启了阅读模式`和`当前可显示图片数量不足`时通过滚动触发懒加载
    shouldTriggerLazyLoad: () =>
      store.manga.show || (!timeout && store.manga.imgList.length === 0),
    sortImageByTop: true,
  });
  exposeToGlobal({ scanner });

  setState('comicMap', '', {
    async getImgList() {
      // 在有 selector 的初次扫描时如果没有匹配的图片就判定为非漫画页
      if (
        options.selector &&
        scanner.imgList.length === 0 &&
        !(await waitDom(options.selector, 2, 1000))
      )
        return [];

      if (scanner.imgList.length === 0) {
        scanner.start();
        void scanner.triggerLazyLoad();

        timeout = window.setTimeout(() => {
          if (store.manga.imgList.length > 0) return;
          toast.warn(t('site.simple.no_img'), {
            id: 'no_img',
            duration: Infinity,
            onClick() {
              setOptions({ remember_current_site: false });
              location.reload();
            },
          });
        }, 3000);
      }

      await scanner.waitFirstImage(Infinity);
      toast.dismiss('no_img');
      return scanner.imgList;
    },
  });

  // 同步滚动显示网页上的图片，用于以防万一保底触发漏网之鱼
  setState('manga', {
    onShowImgsChange: throttle((showImgs) => {
      if (!store.manga.show) return;
      scanner.slotElements[[...showImgs].at(-1)!]?.scrollIntoView({
        behavior: 'instant',
        block: 'end',
      });
    }, 1000),
  });

  // 在进入阅读模式时触发懒加载，退出时跳回之前的滚动位置
  createEffectOn(
    () => store.manga.show,
    (show) => {
      if (show) {
        laseScroll = window.scrollY;
        void scanner.triggerLazyLoad();
      } else window.scroll({ top: laseScroll, behavior: 'instant' });
    },
  );

  // 针对 SPA 网站，在网址改变后清空图片
  onUrlChange((lastUrl, nowUrl) => {
    if (!lastUrl || lastUrl.split('/').length === nowUrl.split('/').length)
      return;
    setState('comicMap', '', 'imgList', undefined);
  });
};
