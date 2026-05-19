import { type FabProps } from 'components/Fab';
import { type ComicImgData, type MangaProps } from 'components/Manga';
import { type SetStateFunction } from 'helper';
import { type Accessor, type JSX } from 'solid-js';
import { type Promisable } from 'type-fest';

import { type MultiSelectExternalController } from '../multiSelect/useMultiSelectLoad';

export type SpeedDialButton = {
  /** 按钮名称/提示文本 */
  name: string;
  /** 点击回调 */
  onClick: () => void;
  /** 图标 */
  icon: JSX.Element;
};

export type SiteOptions = {
  option: MangaProps['option'];
  defaultOption: MangaProps['defaultOption'];

  /** 自动进入阅读模式 */
  autoShow: boolean;
  /** 锁定站点配置 */
  lockOption: boolean;
  /** 隐藏 FAB */
  hiddenFab: boolean;
  /** FAB 位置偏移 */
  fabPosition: { top: number; left: number };
};

export type CoreStore<T extends Record<string, any>> = {
  fab: FabProps & {
    optionsSpeedDial?: string[];
    extraSpeedDial?: SpeedDialButton[];
    /** 覆盖默认的 speedDial，有值时将直接使用它 */
    overrideSpeedDial?: SpeedDialButton[];
  };
  manga: MangaProps;
  hotkeys: Record<string, string[]>;

  comicMap: Record<
    string | number,
    {
      /** undefined 表示还未开始加载，空数组表示刚开始加载 */
      imgList?: MangaProps['imgList'];
      getImgList: (
        coreCtx: CoreContext<T>,
      ) => Promisable<MangaProps['imgList']>;
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
    /** 当前是否有对应的页面处理逻辑 */
    hasPageHandler: boolean;
  };
};

export type CoreContext<T extends Record<string, any> = Record<string, any>> = {
  store: CoreStore<T>;
  setState: SetStateFunction<CoreStore<T>>;

  options: CoreStore<T>['options'];
  // TODO: 不知道为啥，这里必须使用 K = T 来中转一下，不然就会报错，应该是 bug 吧
  setOptions: <K = T>(newOptions: Partial<K & SiteOptions>) => Promisable<void>;
  showComic: (id?: string | number) => Promise<void>;
  loadComic: (id?: string | number) => Promise<void>;
  init: (autoShow?: boolean) => void;

  canLoadComic: Accessor<boolean>;
  canMultiSelect: Accessor<boolean>;

  /** 多选管理器，由 getMultiSelectLoadController 注入 */
  multiSelect?: MultiSelectExternalController;

  /** 动态加载图片列表 */
  dynamicLoad: (
    loadImg: (
      setImg: (i: number, url: string | ComicImgData) => void,
    ) => Promisable<void>,
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
    /** 加载完成一个后触发的回调 */
    onLoad?: (
      img: string | ComicImgData,
      index: number,
      imgList: (string | ComicImgData)[],
    ) => void;
  }) => Promise<MangaProps['imgList']>;
};
