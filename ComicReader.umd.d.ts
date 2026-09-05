import { ReactiveMap } from '@solid-primitives/map';
import { ScheduleCallback, createScheduled } from '@solid-primitives/scheduled';
import { ReactiveSet } from '@solid-primitives/set';
import { dequal as isEqual } from 'dequal';
import { Accessor, Component, EffectFunction, JSX, MemoOptions, Owner, createEffect, createMemo, createSignal, on } from 'solid-js';
import { SetStoreFunction } from 'solid-js/store';
import { PartialDeep, Promisable } from 'type-fest';

/** 图片四边的空白边缘比例 */
export type BlankMargin = {
	top: number;
	right: number;
	bottom: number;
	left: number;
};
export type ComicImg = {
	loadType: "loading" | "loaded" | "error" | "wait";
	type?: "long" | "wide" | "vertical" | "";
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
	/** 背景色 */
	background?: string | null;
	/** 边缘区域 */
	blankMargin?: BlankMargin | null;
	/** 图片在「图像识别」处理时使用的配置版本号 */
	recognitionVersion?: number;
	translationUrl?: string;
	translationMessage?: string;
	translationType?: "wait" | "show" | "hide" | "error";
	upscaleUrl?: string;
};
export type PageList = ([
	number
] | [
	number,
	number
])[];
/** 值为 boolean 表示是自动修改的，值为 number 表示是手动修改 */
export type FillEffect = Record<number, boolean | 1 | 0>;
declare const imgState: {
	imgMap: Record<string, ComicImg>;
	imgList: string[];
	pageList: PageList;
	fillEffect: FillEffect;
	showRange: [
		number,
		number
	];
	renderRange: [
		number,
		number
	];
	loadingRange: [
		number,
		number
	];
	/**
	 * 图片显示状态
	 *
	 * 0 - 页面中的第一张图片
	 * 1 - 页面中的最后一张图片
	 * '' - 页面中的唯一一张图片
	 */
	imgShowState: Partial<Record<number, 0 | 1 | "">>;
	defaultImgType: ComicImg["type"];
};
/** MangaImageTranslator 翻译配置 */
export type MitOptions = {
	/** 自定义服务器地址，为空则使用默认地址 */
	localUrl: string | undefined;
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
/** Cotrans 翻译配置 */
export type CotransOptions = {
	detector: {
		detector: string;
		detection_size: string;
	};
	render: {
		direction: string;
	};
	translator: {
		translator: string;
		target_lang: string;
	};
};
export type Area = "prev" | "menu" | "next" | "PREV" | "MENU" | "NEXT";
export type Rows = [
	Area,
	Area,
	Area
];
export type ArrayConfig = [
	Rows,
	Rows,
	Rows
];
declare const areaArrayMap: {
	left_right: ArrayConfig;
	up_down: ArrayConfig;
	edge: ArrayConfig;
	l: ArrayConfig;
};
type Option$1 = {
	/** 漫画方向 */
	dir: "ltr" | "rtl";
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
	/** 页码提示显示方式 */
	pageTip: "hide" | "auto" | "always";
	/** 翻页动画时长（毫秒） */
	turnPageDuration: number;
	/** 卷轴模式滚动动画时长（毫秒） */
	scrollDuration: number;
	/** 自动切换单双页模式 */
	autoSwitchPageMode: boolean;
	/** 自动隐藏鼠标 */
	autoHiddenMouse: boolean;
	/** 翻页至尽头后继续翻页的操作 */
	scroolEnd: "none" | "exit" | "auto";
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
		position: "hidden" | "auto" | "top" | "bottom" | "right";
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
		 * - number: 将图片宽度限定至指定值，但宽图只会放大不缩小
		 */
		adjustToWidth: "disable" | "full" | number;
		/** 并排模式 */
		abreastMode: boolean;
		/** 并排模式下重新显示上列结尾部分的比例 */
		abreastDuplicate: number;
		/** 每行显示页数（仅双页模式） */
		pageColumns: number;
		/** 双页模式 */
		doubleMode: boolean;
		/** 滚动翻页时对齐边缘 */
		alignEdge: boolean;
	};
	/** 图片滤镜 */
	imgFilter: {
		/** 亮度 */
		brightness: number;
		/** 对比度 */
		contrast: number;
		/** 饱和度 */
		saturate: number;
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
		/** 边缘裁切 */
		crop: boolean;
		/** 保留白边 */
		keepMargin: number;
	};
	/** 翻译 */
	translation: {
		/** 是否启用翻译 */
		enabled: boolean;
		/** 翻译器 */
		provider: "manga-image-translator" | "cotrans";
		/** 忽略缓存强制重试 */
		forceRetry: boolean;
		/** 只下载完成翻译的图片 */
		onlyDownloadTranslated: boolean;
		mit: MitOptions;
		cotrans: CotransOptions;
	};
	/** 自动滚动 */
	autoScroll: {
		enabled: boolean;
		/** 间隔 */
		interval: number;
		/** 距离 */
		distance: number;
		/** 持续滚动（仅卷轴模式） */
		continuous: boolean;
		/** 是否触发退出和上/下话 */
		triggerEnd: boolean;
	};
};
declare const optionState: {
	defaultOption: Option$1;
	option: Option$1;
};
/** 滚动设备类型：A 类传统滚轮、B 类高精度滚轮、C 类触摸板；undefined 表示尚未确定 */
export type ScrollDeviceType = undefined | "a" | "b" | "c";
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
	/** 虚拟棘轮的翻页进度（0~1），正为向下滚动 */
	wheelProgress: number;
	/** 最近一次判定的滚动设备类型 */
	scrollDeviceType: ScrollDeviceType;
	autoScroll: {
		play: boolean;
		progress: number;
	};
	supportUpscaleImage: boolean;
};
export type ToolbarButtonList = Component[];
export type SettingList = ([
	string,
	Component
] | [
	string,
	Component,
	{
		initShow?: boolean | (() => boolean);
		hidden?: () => boolean;
	}
])[];
export type PropState = {
	/** 评论列表 */
	commentList: string[] | undefined;
	/** 快捷键配置 */
	hotkeys: Record<string, string[]>;
	prop: {
		/** 点击结束页按钮时触发的回调 */
		onExit?: (isEnd?: boolean) => void;
		/** 点击上一话按钮时触发的回调 */
		onPrev?: () => Promisable<void>;
		/** 点击下一话按钮时触发的回调 */
		onNext?: () => Promisable<void>;
		/** 图片加载状态发生变化时触发的回调 */
		onLoading?: (imgList: ComicImg[], img?: ComicImg) => Promisable<void>;
		/** 图片加载失败时触发的回调 */
		onImgError?: (url: string) => Promisable<void>;
		/** 配置发生变化时触发的回调 */
		onOptionChange?: (option: Partial<Option$1>) => Promisable<void>;
		/** 快捷键配置发生变化时触发的回调 */
		onHotkeysChange?: (hotkeys: Record<string, string[]>) => Promisable<void>;
		/** 显示图片发生变化时触发的回调 */
		onShowImgsChange?: (showImgs: Set<number>, imgList: ComicImg[]) => Promisable<void>;
		/** 每次加载范围改变后触发的回调，返回加载范围中等待 url 的图片的 index */
		onWaitUrlImgs?: (indexs: Set<number>, imgList: ComicImg[]) => void;
		editButtonList: (list: ToolbarButtonList) => ToolbarButtonList;
		editSettingList: (list: SettingList) => SettingList;
	};
};
declare const propState: PropState;
export type ShowState = {
	/** 当前设备是否是移动端 */
	isMobile: boolean;
	/** 是否处于拖拽模式 */
	isDragMode: boolean;
	/** 是否正在播放翻页滑动动画 */
	isTurnAnimating: boolean;
	/** 鼠标是否悬停在滚动条上 */
	isScrollbarHover: boolean;
	/** 当前页数 */
	activePageIndex: number;
	show: {
		/** 是否强制显示工具栏 */
		toolbar: boolean;
		/** 是否强制显示滚动条 */
		scrollbar: boolean;
		/** 是否强制显示页码提示 */
		pageTip: boolean;
		/** 是否显示点击区域 */
		touchArea: boolean;
		/** 结束页状态 */
		endPage: undefined | "start" | "end";
	};
	page: {
		/** 动画效果 */
		anima: "" | "zoom" | "page";
		/** 竖向排列 */
		vertical: boolean;
		/** 正常显示页面所需的偏移量 */
		offset: {
			/** 水平偏移 */
			x: {
				/** 以「页」（一屏）为单位的偏移量，乘以容器宽后得到像素值 */
				pct: number;
				/** 像素级补充偏移量，用于滚动/拖拽等细粒度位移 */
				px: number;
			};
			/** 垂直偏移 */
			y: {
				/** 以「页」（一屏）为单位的偏移量，乘以容器高后得到像素值 */
				pct: number;
				/** 像素级补充偏移量，用于滚动/拖拽等细粒度位移 */
				px: number;
			};
		};
	};
};
declare const showState: ShowState;
declare const mountComponents: (id: string, fc: () => JSX.Element) => HTMLDivElement;
declare class FaviconProgress {
	initLink: string;
	color: string;
	private readonly canvas;
	private readonly ctx;
	private readonly link;
	constructor(color?: string);
	update(progress: number): void;
	updateFavicon(): void;
	/** 恢复默认图标 */
	recover(): void;
}
declare const useFaviconProgress: () => void;
declare const lang: import("solid-js").Accessor<"zh" | "en" | "ru">, setLang: import("solid-js").Setter<"zh" | "en" | "ru">;
declare const setInitLang: () => Promise<"zh" | "en" | "ru">;
declare const t: (keys: string, variables?: Record<string, unknown>) => string;
declare const log: {
	(...args: unknown[]): void;
	warn(...args: unknown[]): void;
	error(...args: unknown[]): void;
};
declare const fileType: {
	readonly j: "jpg";
	readonly p: "png";
	readonly g: "gif";
	readonly w: "webp";
	readonly b: "bmp";
};
declare const exposeToGlobal: (obj: Record<string, unknown>) => void;
declare const throttle: ScheduleCallback;
declare const debounce: ScheduleCallback;
declare const sleep: (ms: number) => Promise<unknown>;
declare const clamp: (min: number, val: number, max: number) => number;
declare const inRange: (min: number, val: number, max: number) => boolean;
declare const getFileName: (url: string) => string | undefined;
declare const isString: (val: unknown) => val is string;
declare const isNumber: (val: unknown) => val is number;
declare const isArray: (val: unknown) => val is unknown[];
declare const approx: (val: number, target: number, range?: number) => boolean;
declare const once: <T extends (...args: any[]) => any>(fn: T) => ((...args: Parameters<T>) => ReturnType<T>);
declare function range(a: number, b?: number): number[];
declare function range<T = number>(a: number, b: (K: number) => T): T[];
declare function range<T = number>(a: number, b: T): T[];
declare function range<T = number>(a: number, b: number, c: (K: number) => T): T[] | number[];
declare const isHTMLElement: (node: Node) => node is HTMLElement;
declare const isImageElement: (node: Node) => node is HTMLImageElement;
declare const querySelector: <T extends HTMLElement = HTMLElement>(selector: string) => T | null;
declare const querySelectorAll: <T extends HTMLElement = HTMLElement>(selector: string) => T[];
declare const querySelectorClick: (selector: string | (() => HTMLElement | undefined | null), textContent?: string) => (() => void | undefined) | undefined;
declare const getMostItem: <T>(list: T[]) => T;
declare const isUrl: (text: string) => boolean;
declare const saveAs: (blob: Blob, name?: string) => void;
declare const scrollIntoView: (selector: string, behavior?: ScrollBehavior) => void | undefined;
export type SingleThreadedState<T extends any[]> = {
	running: boolean;
	argList: T[];
	/** 是否保留运行期间的调用到当此运行结束后调用 */
	abandon?: boolean;
	/** 连续调用的间隔 */
	timeout?: number;
	/** 确保本次运行完后再运行一次 */
	continueRun: (...args: T) => void;
};
declare const singleThreaded: <T extends any[]>(callback: (state: SingleThreadedState<T>, ...args: T) => Promisable<void | undefined>, initState?: Partial<SingleThreadedState<T>>) => (...args: T) => Promise<void> | undefined;
declare const plimit: <T>(fnList: (() => Promisable<T>)[], callBack?: ((doneNum: number, totalNum: number, resList: T[], i: number) => void) | undefined, limit?: number) => Promise<T[]>;
declare class PQueue<T> {
	wait: Set<T>;
	running: Set<T>;
	done: Set<T>;
	private readonly handleTask;
	concurrency: number;
	constructor(handleTask: (item: T) => Promise<unknown>, concurrency?: number);
	has: (item: T) => boolean;
	private processQueue;
	add(item: T): void;
	set(...items: T[]): void;
	clear(): void;
}
declare const needDarkMode: (hexColor: string) => boolean;
declare function wait<T>(fn: () => Promisable<T | undefined>): Promise<TrueValue<T>>;
declare function wait<T>(fn: () => Promisable<T>, timeout?: number, waitTime?: number): Promise<T>;
declare function waitDom(selector: string, count?: number): Promise<HTMLElement[]>;
declare function waitDom(selector: string, count?: number, timeout?: number): Promise<HTMLElement[] | undefined>;
declare const waitImgLoad: (target: HTMLImageElement | string, timeout?: number) => Promise<HTMLImageElement>;
declare const boolDataVal: (val: boolean | undefined) => "" | undefined;
declare const testImgUrl: (url: string) => Promise<unknown>;
declare const canvasToBlob: (canvas: HTMLCanvasElement | OffscreenCanvas, type?: string, quality?: number) => Promise<Blob>;
declare const canvasToBlobUrl: (canvas: HTMLCanvasElement | OffscreenCanvas, type?: string, quality?: number) => Promise<string>;
declare const difference: <T extends object>(a: T, b: T) => Partial<T>;
declare const assign: <T extends object>(target: T, ...sources: (Partial<T> | undefined)[]) => T;
declare const byPath: <T = object>(obj: object, path: string | string[], handleVal?: (parentObj: object, key: string) => unknown) => T | null;
declare const requestIdleCallback$1: (callback: IdleRequestCallback, timeout?: number) => number;
declare const getKeyboardCode: (e: KeyboardEvent) => string;
declare const keyboardCodeToText: (code: string) => string;
declare const domParse: (html: string) => Document;
declare const hijackFn: <T extends unknown[] = unknown[], R = unknown>(fnName: string, fn: (rawFn: (...args: T) => R, args: T) => R) => void;
declare const ensureGmValue: <T extends string | number | object = string>(name: string, defaultValue: string | (() => Promisable<void | string>)) => Promise<T>;
declare const extractRange: (rangeText: string, length: number) => Set<number>;
declare const descRange: (list: Iterable<number>, length: number) => string;
declare const onUrlChange: (fn: (lastUrl: string, nowUrl: string) => Promisable<void>, handleUrl?: (location: Location) => string) => () => void;
declare const waitUrlChange: <T = unknown>(isValidUrl: () => T) => Promise<NonNullable<T>>;
declare abstract class AnimationFrame {
	animationId: number;
	abstract frame: (timestamp: DOMHighResTimeStamp) => void;
	call: (force?: boolean) => void;
	cancel: () => void;
}
declare class WakeLock$1 {
	isSupported: boolean;
	lock: WakeLockSentinel | null;
	constructor();
	on: () => Promise<boolean | null>;
	off: () => Promise<void>;
}
declare const getImageData: (img: HTMLImageElement, maxSize?: number) => ImageData;
declare const withEventStop: <T extends Event>(handler?: (e: T) => void) => (e: T) => void;
declare const versionLt: (version1: string, version2: string) => boolean;
declare const gql: (strings: TemplateStringsArray, ...values: string[]) => string;
declare const createEqualsSignal: typeof createSignal;
declare const createRootMemo: typeof createMemo;
declare const createThrottleMemo: <T>(fn: EffectFunction<T | undefined, T>, wait?: number, init?: T, options?: MemoOptions<T>) => Accessor<T>;
declare const createMemoMap: <Return extends Record<string, any>>(fnMap: {
	[P in keyof Return]: Accessor<Return[P]>;
}) => Accessor<Return>;
declare const createRootEffect: typeof createEffect;
declare const createEffectOn: typeof on;
declare const onAutoMount: (fn: (owner: Owner | null) => void | (() => void)) => void | (() => void);
export type UseStore = <T>(txMode: IDBTransactionMode, callback: (store: IDBObjectStore) => T | PromiseLike<T>) => Promise<T>;
declare const promisifyRequest: <T>(request: IDBRequest<T>) => Promise<T>;
declare const useCache: <Schema extends Record<string, unknown>>(schema: Record<string, string> | ((db: IDBDatabase) => void), name?: string, version?: number) => Promise<{
	set: <K extends keyof Schema & string>(storeName: K, value: Schema[K]) => Promise<IDBValidKey>;
	get: <K extends keyof Schema & string>(storeName: K, query: IDBValidKey) => Promise<Schema[K] | undefined>;
	del: <K extends keyof Schema & string>(storeName: K, query: IDBValidKey | IDBKeyRange) => Promise<undefined>;
	each<K extends keyof Schema & string>(storeName: K, callback: (value: Schema[K], cursor: IDBCursorWithValue) => Promisable<void>): void;
}>;
export type PointerState = {
	id: number;
	/** 事件类型 */
	type: "down" | "move" | "up" | "cancel";
	/** 触发时的 xy 位置 */
	xy: [
		number,
		number
	];
	/** 手势开始时的 xy 位置 */
	initial: [
		number,
		number
	];
	/** 上次触发时的 xy 位置 */
	last: [
		number,
		number
	];
	/** 手势开始时间 */
	startTime: number;
	/** 触发元素 */
	target: HTMLElement;
};
export type UseDragOptions = {
	ref: HTMLElement;
	handleDrag: UseDrag;
	easyMode?: () => boolean;
	handleClick?: (e: PointerEvent, target: HTMLElement) => boolean | void;
	touches?: Map<number, PointerState>;
	skip?: (e: PointerEvent | MouseEvent) => boolean;
	setCapture?: boolean;
};
export type UseDrag = (state: PointerState, e: PointerEvent) => void;
declare const useDrag: ({ ref, handleDrag, easyMode, handleClick, skip, setCapture, touches, }: UseDragOptions) => void;
export type SetStateFunction<State> = SetStoreFunction<State> & ((fn: (state: State) => void) => void);
declare const useStore: <State extends object>(initState: State) => {
	store: Readonly<State>;
	setState: SetStateFunction<State>;
};
export type StyleMap = {
	[P in keyof JSX.CSSProperties]: Accessor<JSX.CSSProperties[P]>;
};
declare function css(styles: TemplateStringsArray, ...values: any[]): void;
declare function css(cssText: string | Accessor<string>, e?: Element | null): void;
declare function css(selector: string | Accessor<string>, styleMap: StyleMap | Accessor<JSX.CSSProperties> | (StyleMap | Accessor<JSX.CSSProperties>)[], e?: Element): void;
export type State = typeof imgState & typeof showState & typeof propState & typeof optionState & typeof otherState;
type Response$1<T = any> = {
	readonly responseText: string;
	readonly response: T;
	readonly status: number;
	readonly statusText: string;
};
export type ErrorResponse = {
	readonly error: string;
} & Response$1;
export type ComicImgData = Partial<ComicImg> & {
	src: string;
};
export type MangaProps = {
	class?: string;
	classList?: Record<string, boolean | undefined>;
	/** 图片url列表 */
	imgList: (ComicImgData | string)[];
	/** 页面填充数据 */
	fillEffect?: FillEffect;
	/** 初始化配置 */
	option?: PartialDeep<Option$1>;
	/** 默认配置 */
	defaultOption?: PartialDeep<Option$1>;
	/** 快捷键配置 */
	hotkeys?: State["hotkeys"];
	/** 是否显示 */
	show?: boolean;
	/** 评论列表 */
	commentList?: string[];
	/** 漫画标题 */
	title?: string | null;
	/** 修改默认工具栏按钮列表 */
	editButtonList?: State["prop"]["editButtonList"];
	/** 修改默认设置项列表 */
	editSettingList?: State["prop"]["editSettingList"];
} & Partial<State["prop"]>;
type Request$1<TContext = object> = {
	method?: "GET" | "HEAD" | "POST" | "PUT" | "DELETE";
	url: string;
	headers?: Record<string, string>;
	data?: string | Blob | File | FormData | URLSearchParams;
	nocache?: boolean;
	timeout?: number;
	responseType?: "arraybuffer" | "blob" | "json" | "stream";
	overrideMimeType?: string;
	fetch?: boolean;
	signal?: AbortSignal;
	onabort?: () => void;
	onerror?: (res?: ErrorResponse) => void;
	ontimeout?: (res: ErrorResponse) => void;
	onload?: (res: Response$1<TContext>) => void;
	onprogress?: (res: Response$1<TContext> & {
		loaded: number;
		total: number;
	}) => void;
};
export type GM_xmlhttpRequest = <TContext = any>(details: Request$1<TContext>) => {
	abort: () => void;
};
export type GM_addElement = <T extends HTMLElement = HTMLElement>(tagName: string, attributes: object) => T;
export type InitConfig = {
	polyfill?: {
		GM_addElement?: GM_addElement;
		GM_xmlhttpRequest?: GM_xmlhttpRequest;
		GM?: Partial<{
			setValue: (name: string, value: unknown) => Promisable<void>;
			getValue: <TValue>(name: string, defaultValue?: TValue) => Promisable<TValue>;
		}>;
	};
	modules?: Record<string, any>;
	props?: Partial<MangaProps>;
};
export declare const initComicReader: {
	({ polyfill, modules, props: initProps, }?: InitConfig): {
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
			wheelProgress: number;
			scrollDeviceType: ScrollDeviceType;
			autoScroll: {
				play: boolean;
				progress: number;
			};
			supportUpscaleImage: boolean;
			defaultOption: Option$1;
			option: Option$1;
			commentList: string[] | undefined;
			hotkeys: Record<string, string[]>;
			prop: {
				onExit?: (isEnd?: boolean) => void;
				onPrev?: () => Promisable<void>;
				onNext?: () => Promisable<void>;
				onLoading?: (imgList: ComicImg[], img?: ComicImg) => Promisable<void>;
				onImgError?: (url: string) => Promisable<void>;
				onOptionChange?: (option: Partial<Option$1>) => Promisable<void>;
				onHotkeysChange?: (hotkeys: Record<string, string[]>) => Promisable<void>;
				onShowImgsChange?: (showImgs: Set<number>, imgList: ComicImg[]) => Promisable<void>;
				onWaitUrlImgs?: (indexs: Set<number>, imgList: ComicImg[]) => void;
				editButtonList: (list: ToolbarButtonList) => ToolbarButtonList;
				editSettingList: (list: SettingList) => SettingList;
			};
			isMobile: boolean;
			isDragMode: boolean;
			isTurnAnimating: boolean;
			isScrollbarHover: boolean;
			activePageIndex: number;
			show: {
				toolbar: boolean;
				scrollbar: boolean;
				pageTip: boolean;
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
			imgMap: Record<string, ComicImg>;
			imgList: string[];
			pageList: PageList;
			fillEffect: FillEffect;
			showRange: [
				number,
				number
			];
			renderRange: [
				number,
				number
			];
			loadingRange: [
				number,
				number
			];
			imgShowState: Partial<Record<number, 0 | 1 | "">>;
			defaultImgType: ComicImg["type"];
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
			wheelProgress: number;
			scrollDeviceType: ScrollDeviceType;
			autoScroll: {
				play: boolean;
				progress: number;
			};
			supportUpscaleImage: boolean;
			defaultOption: Option$1;
			option: Option$1;
			commentList: string[] | undefined;
			hotkeys: Record<string, string[]>;
			prop: {
				onExit?: (isEnd?: boolean) => void;
				onPrev?: () => Promisable<void>;
				onNext?: () => Promisable<void>;
				onLoading?: (imgList: ComicImg[], img?: ComicImg) => Promisable<void>;
				onImgError?: (url: string) => Promisable<void>;
				onOptionChange?: (option: Partial<Option$1>) => Promisable<void>;
				onHotkeysChange?: (hotkeys: Record<string, string[]>) => Promisable<void>;
				onShowImgsChange?: (showImgs: Set<number>, imgList: ComicImg[]) => Promisable<void>;
				onWaitUrlImgs?: (indexs: Set<number>, imgList: ComicImg[]) => void;
				editButtonList: (list: ToolbarButtonList) => ToolbarButtonList;
				editSettingList: (list: SettingList) => SettingList;
			};
			isMobile: boolean;
			isDragMode: boolean;
			isTurnAnimating: boolean;
			isScrollbarHover: boolean;
			activePageIndex: number;
			show: {
				toolbar: boolean;
				scrollbar: boolean;
				pageTip: boolean;
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
			imgMap: Record<string, ComicImg>;
			imgList: string[];
			pageList: PageList;
			fillEffect: FillEffect;
			showRange: [
				number,
				number
			];
			renderRange: [
				number,
				number
			];
			loadingRange: [
				number,
				number
			];
			imgShowState: Partial<Record<number, 0 | 1 | "">>;
			defaultImgType: ComicImg["type"];
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
export declare const defaultConfig: () => InitConfig;

declare namespace helper {
	export { AnimationFrame, FaviconProgress, PQueue, PointerState, ReactiveMap, ReactiveSet, SetStateFunction, StyleMap, UseDrag, UseStore, WakeLock$1 as WakeLock, approx, assign, boolDataVal, byPath, canvasToBlob, canvasToBlobUrl, clamp, createEffectOn, createEqualsSignal, createMemoMap, createRootEffect, createRootMemo, createScheduled, createThrottleMemo, css, debounce, descRange, difference, domParse, ensureGmValue, exposeToGlobal, extractRange, fileType, getFileName, getImageData, getKeyboardCode, getMostItem, gql, hijackFn, inRange, isArray, isEqual, isHTMLElement, isImageElement, isNumber, isString, isUrl, keyboardCodeToText, lang, log, mountComponents, needDarkMode, onAutoMount, onUrlChange, once, plimit, promisifyRequest, querySelector, querySelectorAll, querySelectorClick, range, requestIdleCallback$1 as requestIdleCallback, saveAs, scrollIntoView, setInitLang, setLang, singleThreaded, sleep, t, testImgUrl, throttle, useCache, useDrag, useFaviconProgress, useStore, versionLt, wait, waitDom, waitImgLoad, waitUrlChange, withEventStop };
}

export {
	initComicReader as default,
};

export {};
