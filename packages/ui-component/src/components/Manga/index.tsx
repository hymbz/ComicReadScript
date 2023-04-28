import type { Component } from 'solid-js';
import { enableScheduling, onMount } from 'solid-js';
import { useInit } from './hooks/useInit';
import { ComicImgFlow } from './components/ComicImgFlow';
import { Toolbar } from './components/Toolbar';
import { Scrollbar } from './components/Scrollbar';
import { TouchArea } from './components/TouchArea';
import { EndPage } from './components/EndPage';

import { cssVar } from './hooks/useCssVar';

import classes, { css as style } from './index.module.css';
// import style from './index.module.css?inline';

import type { State } from './hooks/useStore/index';
import type { FillEffect } from './hooks/useStore/ImageState';
import type { Option } from './hooks/useStore/OptionState';
import { handleKeyUp, handleScroll } from './hooks/useStore/slice';
import { stopPropagation } from './helper';

export { buttonListDivider } from './defaultButtonList';

export const MangaStyle = style;

enableScheduling();

export interface MangaProps {
  /** 图片url列表 */
  imgList: string[];
  /** 页面填充数据 */
  fillEffect?: FillEffect;
  /** 初始化配置 */
  option?: Partial<Option>;

  /** 点击结束页按钮时触发的回调 */
  onExit?: State['onExit'] | null;
  /** 点击上一话按钮时触发的回调 */
  onPrev?: State['onPrev'] | null;
  /** 点击下一话按钮时触发的回调 */
  onNext?: State['onNext'] | null;
  /** 配置发生变化时触发的回调 */
  onOptionChange?: (option: Option, prevOption: Option) => void | Promise<void>;
  /** 图片加载状态发生变化时触发的回调 */
  onLoading?: (img: ComicImg, imgList: ComicImg[]) => void | Promise<void>;

  /** 修改默认侧边栏按钮列表 */
  editButtonList?: State['editButtonList'];
  /** 修改默认设置项列表 */
  editSettingList?: State['editSettingList'];
}

/**
 * 漫画组件
 */
export const Manga: Component<MangaProps> = (props) => {
  let rootRef: HTMLDivElement;

  onMount(() => {
    useInit(props, rootRef);
    rootRef.focus();
  });

  return (
    <div
      class={classes.root}
      ref={rootRef!}
      style={cssVar()}
      onWheel={handleScroll}
      onKeyUp={handleKeyUp}
      onKeyDown={stopPropagation}
      role="presentation"
      tabIndex={-1}
    >
      <Toolbar />
      <ComicImgFlow />
      <Scrollbar />
      <TouchArea />
      <EndPage />
    </div>
  );
};
