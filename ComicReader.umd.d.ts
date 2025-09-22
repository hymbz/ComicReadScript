import { Component } from 'solid-js';
import * as components_Manga from 'components/Manga';
import * as helper from 'helper';
import { PartialDeep } from 'type-fest';

type ComicImg = {
    loadType: 'loading' | 'loaded' | 'error' | 'wait';
    type?: 'long' | 'wide' | 'vertical' | '';
    src: string;
    width?: number;
    height?: number;
    name?: string;
    size: {
        height: number;
        width: number;
    };
    blobUrl?: string;
    progress?: number;
    background?: string;
    blankMargin?: {
        left: number;
        right: number;
    } | null;
    translationUrl?: string;
    translationMessage?: string;
    translationType?: 'wait' | 'show' | 'hide' | 'error';
    upscaleUrl?: string;
};
type PageList = ([number] | [number, number])[];
/** 值为 boolean 表示是自动修改的，值为 number 表示是手动修改 */
type FillEffect = Record<number, boolean | 1 | 0>;
declare const imgState: {
    imgMap: Record<string, ComicImg>;
    imgList: string[];
    pageList: PageList;
    fillEffect: FillEffect;
    showRange: [number, number];
    renderRange: [number, number];
    loadingRange: [number, number];
    defaultImgType: ComicImg["type"];
};

type SettingList = ([string, Component] | [
    string,
    Component,
    {
        initShow?: boolean | (() => boolean);
        hidden?: () => boolean;
    }
])[];

type ToolbarButtonList = Component[];

type Area = 'prev' | 'menu' | 'next' | 'PREV' | 'MENU' | 'NEXT';
type Rows = [Area, Area, Area];
type ArrayConfig = [Rows, Rows, Rows];
declare const areaArrayMap: {
    left_right: ArrayConfig;
    up_down: ArrayConfig;
    edge: ArrayConfig;
    l: ArrayConfig;
};

type Option = {
    /** 漫画方向 */
    dir: 'ltr' | 'rtl';
    /** 默认启用首页填充 */
    firstPageFill: boolean;
    /** 自定义背景色 */
    customBackground?: string;
    /** 禁止自动放大图片 */
    disableZoom: boolean;
    /** 黑暗模式 */
    darkMode: boolean;
    /** 黑暗模式跟随系统 */
    autoDarkMode: boolean;
    /** 左右翻页键交换 */
    swapPageTurnKey: boolean;
    /** 始终加载所有图片 */
    alwaysLoadAllImg: boolean;
    /** 在结束页显示评论 */
    showComment: boolean;
    /** 预加载页数 */
    preloadPageNum: number;
    /** 显示页数。0 表示 auto */
    pageNum: 1 | 2 | 0;
    /** 自动切换单双页模式 */
    autoSwitchPageMode: boolean;
    /** 自动隐藏鼠标 */
    autoHiddenMouse: boolean;
    /** 翻页至尽头后继续翻页的操作 */
    scroolEnd: 'none' | 'exit' | 'auto';
    /** 自动全屏 */
    autoFullscreen: boolean;
    zoom: {
        /** 缩放大小 */
        ratio: number;
        /** 确保缩放前后基准点不变所需的偏移量 */
        offset: {
            x: number;
            y: number;
        };
    };
    /** 滚动条 */
    scrollbar: {
        /** 滚动条位置 */
        position: 'hidden' | 'auto' | 'top' | 'bottom' | 'right';
        /** 自动隐藏 */
        autoHidden: boolean;
        /** 显示图片加载状态 */
        showImgStatus: boolean;
        /** 快捷滚动 */
        easyScroll: boolean;
    };
    /** 点击翻页 */
    clickPageTurn: {
        enabled: boolean;
        /** 左右反转点击区域 */
        reverse: boolean;
        /** 缩小菜单区域 */
        shrinkMenu: boolean;
        /** 区域排列类型 */
        area: keyof typeof areaArrayMap;
    };
    /** 卷轴模式 */
    scrollMode: {
        enabled: boolean;
        /** 图片间距 */
        spacing: number;
        /** 图片缩放比例 */
        imgScale: number;
        /**
         * 调整图片的显示宽度
         *
         * - 'disable': 禁用
         * - 'full': 全部图片缩放适应页宽
         * - number: 通过调整图片缩放比例，让**大多数**图片的宽度接近指定值
         */
        adjustToWidth: 'disable' | 'full' | number;
        /** 并排模式 */
        abreastMode: boolean;
        /** 并排模式下重新显示上列结尾部分的比例 */
        abreastDuplicate: number;
        /** 双页模式 */
        doubleMode: boolean;
        /** 滚动翻页时对齐边缘 */
        alignEdge: boolean;
    };
    /** 图像识别 */
    imgRecognition: {
        enabled: boolean;
        /** 识别背景色 */
        background: boolean;
        /** 自动调整页面填充 */
        pageFill: boolean;
        /** 图片放大 */
        upscale: boolean;
    };
    /** 翻译 */
    translation: {
        /** 翻译服务器 */
        server: 'disable' | 'selfhosted' | 'cotrans';
        /** 本地部署的项目 url */
        localUrl: string | undefined;
        /** 忽略缓存强制重试 */
        forceRetry: boolean;
        /** manga-image-translator 配置 */
        options: {
            detector: {
                detector: string;
                detection_size: string;
                box_threshold: number;
                unclip_ratio: number;
            };
            render: {
                direction: string;
            };
            translator: {
                translator: string;
                target_lang: string;
            };
            inpainter: {
                inpainter: string;
                inpainting_size: string;
            };
            mask_dilation_offset: number;
        };
        /** 只下载完成翻译的图片 */
        onlyDownloadTranslated: boolean;
    };
    /** 自动滚动 */
    autoScroll: {
        enabled: boolean;
        interval: number;
        distance: number;
        /** 是否触发退出和上/下话 */
        triggerEnd: boolean;
    };
};
declare const optionState: {
    defaultOption: Option;
    option: Option;
};

declare const otherState: {
    /** 漫画标题 */
    title: string;
    /**
     * 用于防止滚轮连续滚动导致过快触发事件的锁
     *
     * - 在首次触发结束页时开启，一段时间关闭。开启时禁止触发结束页的上下话切换功能。
     */
    scrollLock: boolean;
    /** 当前是否处于全屏状态 */
    fullscreen: boolean;
    rootSize: {
        width: number;
        height: number;
    };
    scrollbarSize: {
        width: number;
        height: number;
    };
    /** 卷轴模式下的滚动距离 */
    scrollTop: number;
    autoScroll: {
        play: boolean;
        progress: number;
    };
    supportWorker: boolean;
    supportUpscaleImage: boolean;
};

type PropState = {
    /** 评论列表 */
    commentList: string[] | undefined;
    /** 快捷键配置 */
    hotkeys: Record<string, string[]>;
    prop: {
        /** 点击结束页按钮时触发的回调 */
        onExit?: (isEnd?: boolean) => void;
        /** 点击上一话按钮时触发的回调 */
        onPrev?: () => void | Promise<void>;
        /** 点击下一话按钮时触发的回调 */
        onNext?: () => void | Promise<void>;
        /** 图片加载状态发生变化时触发的回调 */
        onLoading?: (imgList: ComicImg[], img?: ComicImg) => void | Promise<void>;
        /** 图片加载失败时触发的回调 */
        onImgError?: (url: string) => void | Promise<void>;
        /** 配置发生变化时触发的回调 */
        onOptionChange?: (option: Partial<Option>) => void | Promise<void>;
        /** 快捷键配置发生变化时触发的回调 */
        onHotkeysChange?: (hotkeys: Record<string, string[]>) => void | Promise<void>;
        /** 显示图片发生变化时触发的回调 */
        onShowImgsChange?: (showImgs: Set<number>, imgList: ComicImg[]) => void | Promise<void>;
        editButtonList: (list: ToolbarButtonList) => ToolbarButtonList;
        editSettingList: (list: SettingList) => SettingList;
    };
};
declare const propState: PropState;

type ShowState = {
    /** 当前设备是否是移动端 */
    isMobile: boolean;
    /** 是否处于拖拽模式 */
    isDragMode: boolean;
    /** 当前页数 */
    activePageIndex: number;
    /** 网格模式 */
    gridMode: boolean;
    show: {
        /** 是否强制显示工具栏 */
        toolbar: boolean;
        /** 是否强制显示滚动条 */
        scrollbar: boolean;
        /** 是否显示点击区域 */
        touchArea: boolean;
        /** 结束页状态 */
        endPage: undefined | 'start' | 'end';
    };
    page: {
        /** 动画效果 */
        anima: '' | 'zoom' | 'page';
        /** 竖向排列 */
        vertical: boolean;
        /** 正常显示页面所需的偏移量 */
        offset: {
            x: {
                pct: number;
                px: number;
            };
            y: {
                pct: number;
                px: number;
            };
        };
    };
};
declare const showState: ShowState;

type State = typeof imgState & typeof showState & typeof propState & typeof optionState & typeof otherState;

type ComicImgData = Partial<ComicImg> & {
    src: string;
};
type MangaProps = {
    class?: string;
    classList?: Record<string, boolean | undefined>;
    /** 图片url列表 */
    imgList: (ComicImgData | string)[];
    /** 页面填充数据 */
    fillEffect?: FillEffect;
    /** 初始化配置 */
    option?: PartialDeep<Option>;
    /** 默认配置 */
    defaultOption?: PartialDeep<Option>;
    /** 快捷键配置 */
    hotkeys?: State['hotkeys'];
    /** 是否显示 */
    show?: boolean;
    /** 评论列表 */
    commentList?: string[];
    /** 漫画标题 */
    title?: string | null;
    /** 修改默认工具栏按钮列表 */
    editButtonList?: State['prop']['editButtonList'];
    /** 修改默认设置项列表 */
    editSettingList?: State['prop']['editSettingList'];
} & Partial<State['prop']>;

type Response<T = any> = {
    readonly responseText: string;
    readonly response: T;
    readonly status: number;
    readonly statusText: string;
};
type ErrorResponse = {
    readonly error: string;
} & Response;

type Request<TContext = object> = {
    method?: 'GET' | 'HEAD' | 'POST' | 'PUT' | 'DELETE';
    url: string;
    headers?: Record<string, string>;
    data?: string | Blob | File | FormData | URLSearchParams;
    nocache?: boolean;
    timeout?: number;
    responseType?: 'arraybuffer' | 'blob' | 'json' | 'stream';
    overrideMimeType?: string;
    fetch?: boolean;
    signal?: AbortSignal;
    onabort?(): void;
    onerror?: (res?: ErrorResponse) => void;
    ontimeout?: (res: ErrorResponse) => void;
    onload?: (res: Response<TContext>) => void;
    onprogress?: (res: Response<TContext> & {
        loaded: number;
        total: number;
    }) => void;
};
type GM_xmlhttpRequest = <TContext = any>(details: Request<TContext>) => {
    abort: () => void;
};
type GM_addElement = <T extends HTMLElement = HTMLElement>(tagName: string, attributes: object) => T;
type InitConfig = {
    polyfill?: {
        GM_addElement?: GM_addElement;
        GM_xmlhttpRequest?: GM_xmlhttpRequest;
        GM?: Partial<{
            setValue(name: string, value: any): Promise<void>;
            getValue<TValue>(name: string, defaultValue?: TValue): Promise<TValue>;
        }>;
    };
    modules?: Record<string, any>;
    props?: Partial<MangaProps>;
};
declare const initComicReader: {
    ({ polyfill, modules, props: initProps, }: InitConfig): {
        version: string;
        helper: typeof helper;
        store: Readonly<{
            title: string;
            scrollLock: boolean;
            fullscreen: boolean;
            rootSize: {
                width: number;
                height: number;
            };
            scrollbarSize: {
                width: number;
                height: number;
            };
            scrollTop: number;
            autoScroll: {
                play: boolean;
                progress: number;
            };
            supportWorker: boolean;
            supportUpscaleImage: boolean;
            defaultOption: Option;
            option: Option;
            commentList: string[] | undefined;
            hotkeys: Record<string, string[]>;
            prop: {
                onExit?: (isEnd?: boolean) => void;
                onPrev?: () => void | Promise<void>;
                onNext?: () => void | Promise<void>;
                onLoading?: (imgList: components_Manga.ComicImg[], img?: components_Manga.ComicImg) => void | Promise<void>;
                onImgError?: (url: string) => void | Promise<void>;
                onOptionChange?: (option: Partial<Option>) => void | Promise<void>;
                onHotkeysChange?: (hotkeys: Record<string, string[]>) => void | Promise<void>;
                onShowImgsChange?: (showImgs: Set<number>, imgList: components_Manga.ComicImg[]) => void | Promise<void>;
                editButtonList: (list: ToolbarButtonList) => ToolbarButtonList;
                editSettingList: (list: SettingList) => SettingList;
            };
            isMobile: boolean;
            isDragMode: boolean;
            activePageIndex: number;
            gridMode: boolean;
            show: {
                toolbar: boolean;
                scrollbar: boolean;
                touchArea: boolean;
                endPage: undefined | "start" | "end";
            };
            page: {
                anima: "" | "zoom" | "page";
                vertical: boolean;
                offset: {
                    x: {
                        pct: number;
                        px: number;
                    };
                    y: {
                        pct: number;
                        px: number;
                    };
                };
            };
            imgMap: Record<string, components_Manga.ComicImg>;
            imgList: string[];
            pageList: PageList;
            fillEffect: FillEffect;
            showRange: [number, number];
            renderRange: [number, number];
            loadingRange: [number, number];
            defaultImgType: components_Manga.ComicImg["type"];
        }>;
        setState: helper.SetStateFunction<{
            title: string;
            scrollLock: boolean;
            fullscreen: boolean;
            rootSize: {
                width: number;
                height: number;
            };
            scrollbarSize: {
                width: number;
                height: number;
            };
            scrollTop: number;
            autoScroll: {
                play: boolean;
                progress: number;
            };
            supportWorker: boolean;
            supportUpscaleImage: boolean;
            defaultOption: Option;
            option: Option;
            commentList: string[] | undefined;
            hotkeys: Record<string, string[]>;
            prop: {
                onExit?: (isEnd?: boolean) => void;
                onPrev?: () => void | Promise<void>;
                onNext?: () => void | Promise<void>;
                onLoading?: (imgList: components_Manga.ComicImg[], img?: components_Manga.ComicImg) => void | Promise<void>;
                onImgError?: (url: string) => void | Promise<void>;
                onOptionChange?: (option: Partial<Option>) => void | Promise<void>;
                onHotkeysChange?: (hotkeys: Record<string, string[]>) => void | Promise<void>;
                onShowImgsChange?: (showImgs: Set<number>, imgList: components_Manga.ComicImg[]) => void | Promise<void>;
                editButtonList: (list: ToolbarButtonList) => ToolbarButtonList;
                editSettingList: (list: SettingList) => SettingList;
            };
            isMobile: boolean;
            isDragMode: boolean;
            activePageIndex: number;
            gridMode: boolean;
            show: {
                toolbar: boolean;
                scrollbar: boolean;
                touchArea: boolean;
                endPage: undefined | "start" | "end";
            };
            page: {
                anima: "" | "zoom" | "page";
                vertical: boolean;
                offset: {
                    x: {
                        pct: number;
                        px: number;
                    };
                    y: {
                        pct: number;
                        px: number;
                    };
                };
            };
            imgMap: Record<string, components_Manga.ComicImg>;
            imgList: string[];
            pageList: PageList;
            fillEffect: FillEffect;
            showRange: [number, number];
            renderRange: [number, number];
            loadingRange: [number, number];
            defaultImgType: components_Manga.ComicImg["type"];
        }>;
        props: Readonly<MangaProps>;
        setProps: helper.SetStateFunction<MangaProps>;
        /** 加载显示指定的图片列表 */
        open: (imgList: MangaProps["imgList"], title?: string) => void;
        /** 跳到指定页数（注意在双页模式下，页数不等于图片在列表里的序列数） */
        goto: (pageIndex: number) => void;
    };
    defaultConfig: () => InitConfig;
};
declare const defaultConfig: () => InitConfig;

export { initComicReader as default, defaultConfig, initComicReader };
export type { InitConfig };
