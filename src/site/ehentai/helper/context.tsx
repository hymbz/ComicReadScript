import type { Component } from 'solid-js';

import { createMemo } from 'solid-js';

import { querySelector } from 'helper';
import { request, useInit } from 'main';

const defaultOptions = {
  /** 关联外站 */
  cross_site_link: true,
  /** 增加快捷键操作 */
  add_hotkeys_actions: true,
  /** 识别广告页 */
  detect_ad: true,
  /** 快捷收藏 */
  quick_favorite: true,
  /** 标签染色 */
  colorize_tag: false,
  /** 快捷评分 */
  quick_rating: true,
  /** 快捷查看标签定义 */
  quick_tag_define: true,
  /** 悬浮标签列表 */
  float_tag_list: false,
  /** 自动调整配置 */
  auto_adjust_option: false,
  /** 标签检查 */
  tag_lint: false,
  /** 展开标签列表 */
  expand_tag_list: true,
  autoShow: false,
};

export const listPageTypes = [
  'm', // 最小化
  'p', // 最小化 + 关注标签
  'l', // 紧凑 + 标签
  'e', // 扩展
  't', // 缩略图;
] as const;

type ListPageType = (typeof listPageTypes)[number];

export type PageType = 'gallery' | 'mytags' | 'mpv' | ListPageType;

export type GalleryContext = {
  type: 'gallery';
  galleryId: number;
  galleryTitle: string | undefined;
  japanTitle: string | undefined;
  imgNum: number;

  showkey?: string;
  mpvkey?: string;

  imgList: string[];
  pageList: string[];
  fileNameList: string[];

  /** 放在原生右侧工具栏和标签选项里的漫画加载按钮 */
  LoadButton: Component<{
    id: string;
    onClick?: (e: MouseEvent) => unknown;
  }>;
  dom: {
    /** 标签输入框 */
    newTagField: HTMLInputElement;
  };
} & AsyncReturnType<typeof useInit<typeof defaultOptions>>;

type OtherContext = { type: Exclude<PageType, 'gallery'> } & AsyncReturnType<
  typeof useInit<typeof defaultOptions>
>;

export type EhContext = OtherContext | GalleryContext;

export const createEhContext = async (): Promise<EhContext | undefined> => {
  let type: PageType | undefined;
  if (Reflect.has(unsafeWindow, 'display_comment_field')) type = 'gallery';
  else if (location.pathname === '/mytags') type = 'mytags';
  else if (Reflect.has(unsafeWindow, 'mpvkey')) type = 'mpv';
  else
    type = (
      querySelector('option[value="t"]')?.parentElement as HTMLSelectElement
    )?.value as Exclude<PageType, 'gallery'> | undefined;

  if (!type) return;
  const mainContext = await useInit('ehentai', defaultOptions);

  if (type !== 'gallery') return { type, ...mainContext };

  let imgNum = 0;
  imgNum = Number(
    querySelector('.gtb .gpc')
      ?.textContent?.replaceAll(',', '')
      .match(/\d+/g)
      ?.at(-1),
  );
  if (Number.isNaN(imgNum)) {
    const { responseText: html } = await request(location.href);
    imgNum = Number(/(?<=class="gdt2">)\d+(?= pages<\/td>)/.exec(html)?.[0]);
  }

  const newTagField = querySelector<HTMLInputElement>('#newtagfield')!;
  // esc 取消焦点
  newTagField?.addEventListener(
    'keydown',
    (e) => e.key === 'Escape' && newTagField.blur(),
  );

  return {
    type: 'gallery',
    ...mainContext,
    galleryId: Number(location.pathname.split('/')[2]),
    galleryTitle: querySelector('#gn')?.textContent || undefined,
    japanTitle: querySelector('#gj')?.textContent || undefined,
    imgNum,

    imgList: [],
    pageList: [],
    fileNameList: [],

    LoadButton(props) {
      const tip = createMemo(() => {
        const _imgList = mainContext.store.comicMap[props.id]?.imgList;
        const progress = _imgList?.filter(Boolean).length;

        switch (_imgList?.length) {
          case undefined:
            return ' Load comic';
          case progress:
            return ' Read';
          default:
            return ` loading - ${progress}/${_imgList!.length}`;
        }
      });
      return (
        <a
          href="javascript:;"
          onClick={async (e) => {
            await props.onClick?.(e);
            mainContext.showComic(props.id);
          }}
          children={tip()}
        />
      );
    },
    dom: { newTagField },
  };
};
