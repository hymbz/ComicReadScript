import type { Accessor } from 'solid-js';

import type { FabProps } from 'components/Fab';
import type { ComicImgData, MangaProps } from 'components/Manga';
import type { SetStateFunction } from 'helper';

export * from './universal';

export * from './useInit';
export * from './useSpeedDial';
export * from './version';
export { ReactiveSet } from '@solid-primitives/set';

export { toast } from 'components/Toast';
export { request } from 'request';

export type SiteOptions = {
  option: MangaProps['option'];
  defaultOption: MangaProps['defaultOption'];

  /** 自动进入阅读模式 */
  autoShow: boolean;
  /** 锁定站点配置 */
  lockOption: boolean;
  /** 隐藏 FAB */
  hiddenFAB: boolean;
  /** FAB 位置偏移 */
  fabPosition: { top: number; left: number };
};

export type MainStore<T extends Record<string, any>> = {
  fab: FabProps & { otherSpeedDial?: string[] };
  manga: MangaProps;
  hotkeys: Record<string, string[]>;

  comicMap: Record<
    string | number,
    {
      /** undefined 表示还未开始加载，空数组表示刚开始加载 */
      imgList?: MangaProps['imgList'];
      getImgList: (
        mainContext: MainContext<T>,
      ) => Promise<MangaProps['imgList']> | MangaProps['imgList'];
      adList?: Set<number>;
    }
  >;
  nowComic: string | number;

  /** 站点名 */
  name: string;
  /** 站点配置 */
  options: T & SiteOptions;

  flag: {
    /** 是否存过配置 */
    isStored: boolean;
    /** 当前是否还需要判断 autoShow */
    needAutoShow: boolean;
  };
};

export type DynamicLoadFn = (
  setImg: (i: number, url: string | ComicImgData) => void,
) => unknown;

export type MainContext<T extends Record<string, any> = Record<string, any>> = {
  store: MainStore<T>;
  setState: SetStateFunction<MainStore<T>>;

  options: MainStore<T>['options'];
  // TODO: 不知道为啥，这里必须使用 K = T 来中转一下，不然就会报错，应该是 bug 吧
  setOptions: <K = T>(newOptions: Partial<K & SiteOptions>) => void;
  showComic: (id?: string | number) => Promise<void>;
  loadComic: (id?: string | number) => Promise<void>;
  init: () => void;

  /** 动态加载图片列表 */
  dynamicLoad: (
    loadImg: DynamicLoadFn,
    length: number | Accessor<number>,
    id?: string | number,
  ) => Promise<MangaProps['imgList']>;

  /** 动态加载图片列表，但只在加载到对应页面时才加载 */
  dynamicLazyLoad: (config: {
    loadImg: (i: number) => Promise<string | ComicImgData>;
    length: number | Accessor<number>;
    id?: string | number;
    /** 并发数 */
    concurrency?: number;
    /** 加载完成后触发的回调 */
    onEnd?: () => void;
  }) => Promise<MangaProps['imgList']>;
};
