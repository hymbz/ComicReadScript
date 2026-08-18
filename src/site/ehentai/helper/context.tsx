import { type CoreContext, type PageHandler, request } from 'core';
import { querySelector, range } from 'helper';

export const featureOptions = {
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
  // 默认开启图像识别，避免图片 url 过期后还要刷新
  defaultOption: { imgRecognition: { enabled: true } },
};

export type EhOptions = typeof featureOptions;

export type ListPageType =
  | 'm' // 最小化
  | 'p' // 最小化 + 关注标签
  | 'l' // 紧凑 + 标签
  | 'e' // 扩展
  | 't'; // 缩略图

export type PageType = 'gallery' | 'mytags' | 'mpv' | ListPageType;

export const getPageContext = async () => {
  if (location.pathname === '/mytags') return { type: 'mytags' } as const;
  if (Reflect.has(unsafeWindow, 'mpvkey')) return { type: 'mpv' } as const;

  // 目录页
  if (!Reflect.has(unsafeWindow, 'display_comment_field')) {
    const type = (
      querySelector('option[value="t"]')?.parentElement as HTMLSelectElement
    )?.value as Exclude<PageType, 'gallery'> | undefined;
    if (type) return { type } as const;
    return;
  }

  // 以上都不是的话，就只会是画廊页了
  let imgNum = 0;
  imgNum = Number(
    querySelector('.gtb .gpc')
      ?.textContent?.replaceAll(',', '')
      .match(/\d+/gu)
      ?.at(-1),
  );
  // 有些脚本或插件会修改到相关 dom，此时就只能通过请求源码来获取页数了
  if (Number.isNaN(imgNum)) {
    const { responseText: html } = await request(location.href);
    imgNum = Number(/(?<=class="gdt2">)\d+(?= pages<\/td>)/u.exec(html)?.[0]);
  }

  const pageCtx: GalleryPageContext = {
    type: 'gallery',
    galleryId: location.pathname.split('/')[2],
    galleryTitle: querySelector('#gn')?.textContent || undefined,
    japanTitle: querySelector('#gj')?.textContent || undefined,
    imgNum,
    imagesPerPage: 0,

    imgList: range(imgNum, ''),
    pageList: [],
    fileNameList: [],

    dom: {
      newTagField: querySelector<HTMLInputElement>('#newtagfield')!,
      sidebar: querySelector('#gd5')!,
    },
  };
  return pageCtx;
};

export type GalleryPageContext = {
  type: 'gallery';
  galleryId: string;
  galleryTitle?: string;
  japanTitle?: string;
  imgNum: number;
  imagesPerPage: number;

  imgList: string[];
  pageList: string[];
  fileNameList: string[];

  dom: { newTagField: HTMLInputElement; sidebar: HTMLElement };
  mpvkey?: string;
  showkey?: string;
};

export type EhPageContext = NonNullable<
  Awaited<ReturnType<typeof getPageContext>>
>;

export type EhFeatureHandler = PageHandler<EhPageContext, EhOptions>;

export type GalleryHandler<T = unknown> = (
  coreCtx: CoreContext<EhOptions>,
  pageCtx: GalleryPageContext,
) => T;
