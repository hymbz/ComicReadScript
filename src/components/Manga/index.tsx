import type { Component } from 'solid-js';
import { createEffect, enableScheduling, onMount } from 'solid-js';

import { boolDataVal } from 'helper';
import { ComicImgFlow } from './components/ComicImgFlow';
import { Toolbar } from './components/Toolbar';
import { Scrollbar } from './components/Scrollbar';
import { TouchArea } from './components/TouchArea';
import { EndPage } from './components/EndPage';

import { store, type State } from './hooks/useStore/index';
import type { FillEffect } from './hooks/useStore/ImageState';
import type { Option } from './hooks/useStore/OptionState';
import { cssVar } from './hooks/useCssVar';
import { useInit } from './hooks/useInit';
import {
  focus,
  handleKeyDown,
  handleMouseDown,
  handleWheel,
} from './hooks/useStore/slice';
import { stopPropagation } from './helper';

import classes, { css as style } from './index.module.css';

export { buttonListDivider } from './defaultButtonList';

export const MangaStyle = style;

enableScheduling();

export interface MangaProps {
  class?: string;
  classList?: ClassList;

  /** 图片url列表 */
  imgList: string[];
  /** 页面填充数据 */
  fillEffect?: FillEffect;
  /** 初始化配置 */
  option?: Partial<Option>;
  /** 快捷键配置 */
  hotkeys?: State['hotkeys'];
  /** 是否显示 */
  show?: boolean;
  /** 评论列表 */
  commentList?: string[];

  /** 点击结束页按钮时触发的回调 */
  onExit?: State['prop']['Exit'];
  /** 点击上一话按钮时触发的回调 */
  onPrev?: State['prop']['Prev'];
  /** 点击下一话按钮时触发的回调 */
  onNext?: State['prop']['Next'];
  /** 配置发生变化时触发的回调 */
  onOptionChange?: State['prop']['OptionChange'];
  /** 快捷键配置发生变化时触发的回调 */
  onHotkeysChange?: State['prop']['HotkeysChange'];
  /**
   * 图片加载状态发生变化时触发的回调
   *
   * 当 imgList 发生改变时也会触发，此时 img 参数将为空
   */
  onLoading?: (imgList: ComicImg[], img?: ComicImg) => void | Promise<void>;

  /** 修改默认工具栏按钮列表 */
  editButtonList?: State['prop']['editButtonList'];
  /** 修改默认设置项列表 */
  editSettingList?: State['prop']['editSettingList'];

  getStore?: (state: State) => void;
}

/** 漫画组件 */
export const Manga: Component<MangaProps> = (props) => {
  let rootRef: HTMLDivElement;

  onMount(() => useInit(props, rootRef));

  createEffect(() => props.show && focus());

  return (
    <div
      class={classes.root}
      classList={{
        [classes.hidden]: props.show === false,
        [props.class ?? '']: !!props.class,
        ...props.classList,
      }}
      ref={rootRef!}
      style={cssVar()}
      onWheel={handleWheel}
      on:mousedown={handleMouseDown}
      oncapture:keydown={handleKeyDown}
      oncapture:keypress={stopPropagation}
      oncapture:keyup={stopPropagation}
      data-mobile={boolDataVal(store.isMobile)}
      role="presentation"
    >
      <ComicImgFlow />
      <Toolbar />
      <Scrollbar />
      <TouchArea />
      <EndPage />
    </div>
  );
};
