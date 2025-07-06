import type { SetStoreFunction } from 'solid-js/store';
import type { FabProps } from 'components/Fab';
import type { MangaProps } from 'components/Manga';
import type { Accessor } from 'solid-js';

export { ReactiveSet } from '@solid-primitives/set';

export * from './universal';
export * from './useInit';
export * from './useSpeedDial';
export * from './version';

export { request } from 'request';
export { toast } from 'components/Toast';

export interface SiteOptions {
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
}

export interface MainStore<T extends Record<string, any>> {
  fab: FabProps & { otherSpeedDial?: string[] };
  manga: MangaProps;
  hotkeys: Record<string, string[]>;

  comicMap: Record<
    string | number,
    {
      /** undefined 表示还未开始加载，空数组表示刚开始加载 */
      imgList?: string[];
      getImgList: (mainContext: MainContext<T>) => Promise<string[]> | string[];
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
}

export type LoadImgFn = (setImg: (i: number, url: string) => void) => unknown;

export interface MainContext<
  T extends Record<string, any> = Record<string, any>,
> {
  store: MainStore<T>;
  setState: (fn: (state: MainStore<T>) => void) => void;
  _setState: SetStoreFunction<MainStore<T>>;

  options: MainStore<T>['options'];
  // TODO: 不知道为啥，这里必须使用 K = T 来中转一下，不然就会报错，应该是 bug 吧
  setOptions: <K = T>(newOptions: Partial<K & SiteOptions>) => Promise<void>;
  showComic: (id?: string | number) => Promise<void>;
  loadComic: (id?: string | number) => Promise<void>;
  dynamicLoad: (
    loadImgFn: LoadImgFn,
    length: number | Accessor<number>,
    id?: string | number,
  ) => Promise<string[]>;
  init: () => void;
}
