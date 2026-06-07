import {
  imgList as MangaImgList,
  type MangaProps,
  SettingBlockSubtitle,
  SettingHotkeys,
  SettingsItemSwitch,
} from 'components/Manga';
import { setEscPriority, setupSiteAdapter, toast } from 'core';
import {
  assign,
  scrollIntoView,
  singleThreaded,
  sleep,
  t,
  testImgUrl,
  wait,
} from 'helper';
import { type Component, For, Show } from 'solid-js';
import { render } from 'solid-js/web';

import { colorizeTag } from './colorizeTag';
import { crossSiteLink } from './crossSiteLink';
import { expandTagList } from './expandTagList';
import { floatTagList } from './floatTagList';
import {
  type EhOptions,
  type EhPageContext,
  LoadButton,
  featureOptions,
  getPageContext,
  isInCategories,
} from './helper';
import { getImgUrl, updatePageUrl } from './helper/api';
import { addHotkeysActions } from './hotkeys';
import { multiSelectLoad } from './multiSelectLoad';
import { quickFavorite } from './quickFavorite';
import { quickRating } from './quickRating';
import { quickTagDefine } from './quickTagDefine';
import { sidebarOverflow } from './sidebarOverflow';
import { tagLint } from './tagLint';

// [ehentai 图像限额](https://github.com/ccloli/E-Hentai-Downloader/wiki/E−Hentai-Image-Viewing-Limits-(Chinese))

setupSiteAdapter<EhPageContext, EhOptions>({
  name: 'ehentai',
  options: featureOptions,
  getPageContext,
  handlers: {
    all: ({ setState, setOptions, options }) => {
      // 将一些设置项移到阅读模式的设置面板里去，FAB 只保留部分选项
      const SiteSettings: Component = () => (
        <>
          <For
            each={[
              'colorize_tag', // 标签染色
              'float_tag_list', // 悬浮标签列表
              'expand_tag_list', // 展开标签列表
              'tag_lint', // 标签检查
              '',
              'quick_favorite', // 快捷收藏
              'quick_rating', // 快捷评分
              'quick_tag_define', // 快捷查看标签定义
              '',
              'cross_site_link', // 关联外站
              'detect_ad', // 识别广告页
              'add_hotkeys_actions', // 增加快捷键操作
              'auto_adjust_option', // 自动调整配置
            ]}
          >
            {(name) => (
              <Show when={name} fallback={<hr />}>
                <SettingsItemSwitch
                  name={t(`site.add_feature.${name}`)}
                  value={options[name]}
                  onChange={(v) => setOptions({ [name]: v })}
                />
              </Show>
            )}
          </For>
          <hr />
          <SettingBlockSubtitle>{t('other.hotkeys')}</SettingBlockSubtitle>
          <SettingHotkeys keys={['float_tag_list']} />
        </>
      );

      setState((state) => {
        state.manga.editSettingList = (list) => [
          ...list,
          ['E-Hentai', SiteSettings],
        ];
        state.fab.optionsSpeedDial = [
          'tag_lint',
          'colorize_tag',
          'cross_site_link',
          'detect_ad',
        ];
      });

      // 按顺序处理 esc 按键
      setEscPriority([
        '关闭显示标签定义',
        '取消选中当前标签',
        '关闭浮动标签栏',
      ]);
    },

    mpv: ({ setState }) => {
      setState('comicMap', '', {
        getImgList({ dynamicLazyLoad }) {
          type ImageList = { i: string; xhr: XMLHttpRequest }[];
          const imagelist = unsafeWindow.imagelist as ImageList;
          const loadImg = async (i: number) => {
            const url = () => imagelist[i].i;
            while (!url()) {
              if (!Reflect.has(imagelist[i], 'xhr')) {
                // oxlint-disable-next-line typescript/no-unsafe-call
                unsafeWindow.load_image(i + 1);
                unsafeWindow.next_possible_request = 0;
              }
              await wait(url);
            }
            return url();
          };
          return dynamicLazyLoad({ loadImg, length: imagelist.length });
        },
      });
    },

    gallery: async (coreCtx, pageCtx) => {
      if (Number.isNaN(pageCtx.imgNum))
        return toast.error(t('site.changed_load_failed'));

      // esc 取消标签输入框焦点
      const { newTagField, sidebar } = pageCtx.dom;
      newTagField.addEventListener(
        'keydown',
        (e) => e.key === 'Escape' && newTagField.blur(),
      );

      const { setState, options } = coreCtx;

      // 处理侧边栏溢出
      sidebarOverflow(coreCtx, pageCtx);

      const { handleClick } = await multiSelectLoad(coreCtx, pageCtx);

      render(() => {
        const hasMultiPage = sidebar.children[6]?.classList.contains('gsp');

        return (
          <p
            class="g2 gsp"
            style={{
              'padding-bottom': 0,
              // 表站开启了 Multi-Page Viewer 的话会将点击按钮挤出去，得缩一下位置
              'padding-top': hasMultiPage ? 0 : undefined,
            }}
            oncapture:click={handleClick}
          >
            <img src="https://ehgt.org/g/mr.gif" />
            <LoadButton id="" context={coreCtx} imgNum={pageCtx.imgNum} />
          </p>
        );
      }, sidebar);
      /** 刷新指定图片 */
      const reloadImg = singleThreaded(
        async (_, url: string): Promise<void> => {
          const i = pageCtx.imgList.indexOf(url);
          if (i === -1) return;
          pageCtx.imgList[i] = await getImgUrl(pageCtx, i);
          if (!(await testImgUrl(pageCtx.imgList[i]))) {
            await updatePageUrl(pageCtx, i);
            pageCtx.imgList[i] = await getImgUrl(pageCtx, i);
            toast.warn(t('alert.retry_get_img_url', { i }));
            if (!(await testImgUrl(pageCtx.imgList[i]))) {
              await sleep(500);
              return reloadImg(url);
            }
          }
          setState('comicMap', '', 'imgList', i, pageCtx.imgList[i]);
          for (const img of MangaImgList())
            if (img.loadType === 'error') return reloadImg(img.src);
        },
      );

      setState((state) => {
        state.manga.title = pageCtx.japanTitle || pageCtx.galleryTitle;
        state.manga.onExit = (isEnd) => {
          if (isEnd) scrollIntoView('#cdiv');
          setState('manga', 'show', false);
        };
        state.manga.onImgError = reloadImg;

        state.fab.initialShow = options.autoShow;
      });
    },
  },
  features: {
    // 标签染色
    colorize_tag: colorizeTag,
    // 快捷收藏
    quick_favorite: quickFavorite,
    // 快捷评分
    quick_rating: quickRating,
    // 展开标签列表
    expand_tag_list: expandTagList,
    // 增加快捷键操作
    add_hotkeys_actions: addHotkeysActions,

    // 悬浮标签列表
    float_tag_list: floatTagList,
    // 快捷查看标签定义
    quick_tag_define: quickTagDefine,
    // 标签检查
    tag_lint: tagLint,
    // 关联外站
    cross_site_link: crossSiteLink,
    // 自动调整阅读配置
    auto_adjust_option: ({ setState }, pageCtx) => {
      if (pageCtx.type !== 'gallery') return;
      if (isInCategories('Doujinshi', 'Manga', 'Non-H')) return;
      setState((state) => {
        const option: MangaProps['defaultOption'] = { pageNum: 1 };
        state.manga.defaultOption = assign(
          state.manga.defaultOption ?? {},
          option,
        );
        state.manga.option = assign(state.manga.option ?? {}, option);
      });
    },
  },
});
