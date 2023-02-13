import type { Draft } from 'immer';
import { debounce } from 'throttle-debounce';
import type { SyntheticEvent } from 'react';
import { handleComicData } from '../../handleComicData';
import type { SelfState, SelfStateCreator, Subscribe } from '.';
import type { MangaProps } from '../..';

declare global {
  type ComicImg = Draft<{
    loadType: 'loading' | 'loaded' | 'error' | 'wait';
    type: 'long' | 'wide' | 'vertical' | '';
    src: string;
    width?: number;
    height?: number;
    error?: SyntheticEvent<HTMLImageElement, Event>;
  }>;

  type PageList = Array<[number] | [number, number]>;
}

/** 加载状态的中文描述 */
export const loadTypeMap: Record<ComicImg['loadType'], string> = {
  error: '加载出错',
  loading: '正在加载',
  wait: '等待加载',
  loaded: '',
};

/** 页面填充数据 */
export type FillEffect = Map<number, boolean>;

export interface ImageSLice {
  imgList: ComicImg[];
  pageList: PageList;
  /** 页面填充数据 */
  fillEffect: FillEffect;

  /** 在 activePageIndex 更改时自动更改，不需要赋值 */
  activeImgIndex: number;
  activePageIndex: number;
  nowFillIndex: number;

  onLoading: MangaProps['onLoading'] | undefined;

  img: {
    单页比例: number;
    横幅比例: number;
    条漫比例: number;

    /** 重新计算 PageData，有防抖 */
    updatePageData: {
      (): void;
      /** 重新计算 PageData，无防抖同步版 */
      sync: (state: Draft<SelfState>) => void;
    };

    /** 根据比例更新图片类型 */
    updateImgType: (draftImg: Draft<ComicImg>) => void;

    /** 更新页面比例 */
    updatePageRatio: (
      state: Draft<SelfState>,
      width: number,
      height: number,
    ) => void;

    /** 切换页面填充 */
    switchFillEffect: () => void;

    /** 根据当前页数更新所有图片的加载状态 */
    updateImgLoadType: () => void;
  };

  /** 翻页 */
  pageTurn: (dir: 'next' | 'prev') => void;
}

/**
 * 预加载指定页数的图片，并取消其他预加载的图片
 *
 * @param state state
 * @param startIndex 起始 page index
 * @param endIndex 结束 page index
 * @param loadNum 加载图片的数量
 * @returns 返回指定范围内的图片在执行前是否还有未加载完的
 */
const loadImg = (
  state: Draft<SelfState>,
  startIndex: number,
  endIndex = startIndex,
  loadNum = NaN,
) => {
  let editNum = 0;
  state.pageList
    .slice(startIndex, endIndex)
    .flat()
    .some((index) => {
      if (index === -1) return false;
      const img = state.imgList[index];
      if (img.loadType !== 'loaded') {
        img.loadType = 'loading';
        editNum += 1;
      }
      return editNum >= loadNum;
    });

  const edited = editNum > 0;
  if (edited) state.scrollbar.updateTipText(state);
  return edited;
};

export const imageSlice: SelfStateCreator<ImageSLice> = (set, get) => {
  const _updatePageData = (state: Draft<SelfState>) => {
    if (state.option.onePageMode || state.option.scrollMode)
      state.pageList = state.imgList.map((_, i) => [i]);
    else
      state.pageList = handleComicData({
        comicImgList: state.imgList,
        fillEffect: state.fillEffect,
      });
    state.scrollbar.updateDrag(state);
    state.img.updateImgLoadType();
  };

  return {
    imgList: [],
    fillEffect: new Map([[-1, true]]),
    pageList: [],

    activeImgIndex: 0,
    activePageIndex: 0,
    nowFillIndex: -1,

    onLoading: undefined,

    img: {
      单页比例: 0,
      横幅比例: 0,
      条漫比例: 0,

      updatePageData: Object.assign(
        debounce(100, () => set(_updatePageData)),
        { sync: _updatePageData },
      ),

      updateImgType: (draftImg: Draft<ComicImg>) => {
        const {
          img: { 单页比例, 横幅比例, 条漫比例, updatePageData },
        } = get();
        const { width, height } = draftImg;

        if (width && height) {
          const imgRatio = width / height;
          if (imgRatio <= 单页比例) {
            if (imgRatio < 条漫比例) draftImg.type = 'vertical';
          } else {
            draftImg.type = imgRatio > 横幅比例 ? 'long' : 'wide';
          }
        }

        set(updatePageData);
      },

      updatePageRatio: (
        state: Draft<SelfState>,
        width: number,
        height: number,
      ) => {
        state.img.单页比例 = Math.min(width / 2 / height, 1);
        state.img.横幅比例 = width / height;
        state.img.条漫比例 = state.img.单页比例 / 2;

        state.imgList.forEach(state.img.updateImgType);
        state.scrollbar.updateDrag(state);
      },

      switchFillEffect: () => {
        set((state) => {
          state.fillEffect.set(
            state.nowFillIndex,
            !state.fillEffect.get(state.nowFillIndex),
          );
          state.img.updatePageData();
        });
      },

      updateImgLoadType: debounce(100, () => {
        set((state) => {
          const { imgList, activePageIndex } = state;

          // 先将所有加载中的图片状态改为暂停
          imgList.forEach(({ loadType }, i) => {
            if (loadType === 'loading') imgList[i].loadType = 'wait';
          });

          if (
            // 如果当前显示页还没有加载完，则优先加载
            loadImg(state, activePageIndex, activePageIndex + 1) ||
            // 之后加载后俩页
            loadImg(state, activePageIndex + 1, activePageIndex + 3) ||
            // 最后加载前一页
            (activePageIndex >= 1 &&
              loadImg(state, activePageIndex - 1, activePageIndex))
          )
            return;

          // 确认没有图片在加载后，在空闲时间自动加载其余图片
          if (
            !state.option.autoLoadOtherImg &&
            imgList.some((img) => img.loadType === 'loading')
          )
            return;
          // 优先加载当前页后面的图片
          if (
            loadImg(
              state,
              activePageIndex + 1,
              imgList.length,
              state.option.autoLoadOtherImg,
            )
          )
            return;
          loadImg(state, 0, imgList.length, state.option.autoLoadOtherImg);
        });
      }),
    },

    pageTurn: (dir) => {
      const { pageList, showEndPage, activePageIndex } = get();
      if (dir === 'next') {
        set((state) => {
          // 在最后一页继续向后翻页时弹出结束页
          if (activePageIndex === pageList.length - 1) state.showEndPage = true;
          else state.activePageIndex += 1;
        });
        return;
      }

      // 向前翻页时如果当前正在显示结束页，则关闭结束页但不翻页
      if (showEndPage) {
        set((state) => {
          state.showEndPage = false;
        });
        return;
      }

      if (activePageIndex > 0) {
        set((state) => {
          state.activePageIndex -= 1;
        });
      }
    },
  };
};

export const imageCallback: Subscribe = (useStore) => {
  // 页数发生变动时
  useStore.subscribe(
    (state) => state.activePageIndex,
    () => {
      useStore.setState((state) => {
        // 重新计算 activeImgIndex
        state.activeImgIndex =
          state.pageList[state.activePageIndex].find((i) => i !== -1) ?? 0;

        // 找到当前所属的 fillEffect
        let nowFillIndex = state.activeImgIndex;
        while (!state.fillEffect.has(nowFillIndex) && (nowFillIndex -= 1));
        state.nowFillIndex = nowFillIndex;

        state.img.updateImgLoadType();
        if (state.showEndPage) state.showEndPage = false;
      });
    },
  );
};
