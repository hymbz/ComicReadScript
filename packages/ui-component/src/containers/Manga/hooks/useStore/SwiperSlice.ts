import type { WritableDraft } from 'immer/dist/internal';
import type { PanZoom, PanZoomOptions } from 'panzoom';
import createPanZoom from 'panzoom';
import type { SwiperOptions } from 'swiper';
import Swiper, { Scrollbar, Mousewheel } from 'swiper';

Swiper.use([Scrollbar, Mousewheel]);

declare global {
  //
}

/**
 * Swiper Option
 */
const defaultSwiperOption: SwiperOptions = {
  // 加载所有图片后才初始化
  preloadImages: false,
  // 自动 update
  observer: true,
  // 在子元素外查找
  uniqueNavElements: false,
  virtual: true,
  // 垂直滚动
  direction: 'vertical',
  // 默认禁用 swiper 的鼠标滚轮
  mousewheel: false,
  // 稍微减少一点自由模式下的滑动距离
  // TODO:这个属性被删了，需要找到新的属性名
  // freeModeMomentumRatio: 0.7,

  // 修改默认的 className，防止可能的样式污染
  containerModifierClass: 'manga-swiper-container-',
  wrapperClass: 'manga-swiper-wrapper',
  slideClass: 'manga-swiper-slide',
  slideActiveClass: 'manga-swiper-slide-active',
  slideNextClass: 'manga-swiper-slide-next',
  slidePrevClass: 'manga-swiper-slide-prev',
  slideVisibleClass: 'manga-swiper-slide-visible',
};

defaultSwiperOption.scrollbar = {
  el: '#manga-swiper-scrollbar',
  draggable: true,
  dragClass: 'manga-swiper-scrollbar-drag',
};

/**
 * panzoom Option
 */
const panzoomOption: PanZoomOptions = {
  // 禁用键盘
  disableKeyboardInteraction: true,
  // 禁用双击缩放
  zoomDoubleClickSpeed: 1,
  // 边界限制
  bounds: true,
  boundsPadding: 1,
  // 禁止缩小
  minZoom: 1,
};

export interface SwiperSlice {
  swiper?: WritableDraft<Swiper>;
  panzoom?: WritableDraft<PanZoom>;

  activeSlideIndex: number;

  initSwiper: (
    swiperOption?: SwiperOptions,
  ) => [SwiperSlice['swiper'], SwiperSlice['panzoom']];

  [key: string]: unknown;
}

export const swiperSlice: SelfStateCreator<SwiperSlice> = (set, get) => ({
  swiper: undefined as unknown as WritableDraft<Swiper>,

  panzoom: undefined as unknown as WritableDraft<PanZoom>,

  activeSlideIndex: 0,

  initSwiper: (swiperOption?: SwiperOptions) => {
    const { mainRef, swiper: _swiper, panzoom: _panzoom } = get();

    if (!mainRef?.current) return [undefined, undefined];

    // 销毁之前可能创建过的实例
    _swiper?.destroy();
    _panzoom?.dispose();

    // 初始化 swiper
    const swiper = new Swiper(mainRef.current, {
      ...defaultSwiperOption,
      ...swiperOption,
    }) as WritableDraft<Swiper>;

    (window as any).swiper = swiper;

    swiper.on('observerUpdate', () => {
      // scrollbar 不会跟着更新，要手动更新下
      swiper.scrollbar.updateSize();
    });

    swiper.on('activeIndexChange', () => {
      set((state) => {
        if (state.swiper === undefined) return;

        // 绑定 activeSlideIndex
        state.activeSlideIndex = state.swiper.activeIndex;

        // 在每次 activeIndexChange 时计算 activeImgIndex
        state.activeImgIndex = state.slideData[state.activeSlideIndex].find(
          (img) => img.index !== '填充',
        )!.index as number;

        // 找到当前所属的 fillEffect
        let nowFillIndex = state.activeImgIndex;
        while (!state.fillEffect.has(nowFillIndex) && (nowFillIndex -= 1));
        state.nowFillIndex = nowFillIndex;

        // TODO:等完成了工具栏的搬迁后再取消注释
        // 更新工具栏的 页面填充 按钮的打开状态
        // state.buttonMap.set(
        //   '页面填充',
        //   produce(state.buttonMap.get('页面填充')!, (draftButton: Button) => {
        //     draftButton.enable = state.fillEffect.get(nowFillIndex)!;
        //   }),
        // );
      });
    });

    // 初始化 panzoom
    const panzoom = createPanZoom(mainRef.current, {
      beforeWheel(e) {
        const { scale } = panzoom.getTransform();
        // 图片不处于放大状态时，必须按下 Alt 键才能通过滚轮缩放
        if (e.altKey && scale === 1) return false;
        // 图片处于放大状态时，可以直接通过滚轮缩放
        if (scale !== 1) return false;
        return true;
      },
      beforeMouseDown(e) {
        // 按下 alt 键 或 处于放大状态 时才允许拖动
        return !(e.altKey || panzoom.getTransform().scale !== 1);
      },

      onDoubleClick(e) {
        e.stopPropagation();
        return true;
      },

      ...panzoomOption,
    }) as WritableDraft<PanZoom>;

    // 处于放大状态时禁止 swiper
    panzoom.on('transform', (e: PanZoom) => {
      if (e.getTransform().scale === 1) {
        swiper.allowTouchMove = true;
      } else if (swiper.allowTouchMove) {
        swiper.allowTouchMove = false;
      }
    });

    // 防止移动端上的滑动页面操作被 panzoom 捕捉处理
    swiper.on('touchStart', (_, event) => {
      if (
        'touches' in event &&
        event.touches.length === 1 &&
        panzoom.getTransform().scale === 1
      )
        event.stopPropagation();
    });

    return [swiper, panzoom];
  },
});
