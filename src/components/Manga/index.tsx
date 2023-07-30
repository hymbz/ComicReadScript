import type { Component } from 'solid-js';
import { createEffect, enableScheduling, onMount } from 'solid-js';

import { ComicImgFlow } from './components/ComicImgFlow';
import { Toolbar } from './components/Toolbar';
import { Scrollbar } from './components/Scrollbar';
import { TouchArea } from './components/TouchArea';
import { EndPage } from './components/EndPage';

import type { State } from './hooks/useStore/index';
import type { FillEffect } from './hooks/useStore/ImageState';
import type { Option } from './hooks/useStore/OptionState';
import { cssVar } from './hooks/useCssVar';
import { useInit } from './hooks/useInit';
import { handleKeyUp, handleWheel } from './hooks/useStore/slice';
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
  /** 是否显示 */
  show?: boolean;
  /** 评论列表 */
  commentList?: string[];

  /** 点击结束页按钮时触发的回调 */
  onExit?: State['onExit'];
  /** 点击上一话按钮时触发的回调 */
  onPrev?: State['onPrev'];
  /** 点击下一话按钮时触发的回调 */
  onNext?: State['onNext'];
  /** 配置发生变化时触发的回调 */
  onOptionChange?: (option: Partial<Option>) => void | Promise<void>;
  /** 图片加载状态发生变化时触发的回调 */
  onLoading?: (img: ComicImg, imgList: ComicImg[]) => void | Promise<void>;

  /** 修改默认侧边栏按钮列表 */
  editButtonList?: State['editButtonList'];
  /** 修改默认设置项列表 */
  editSettingList?: State['editSettingList'];
}

/** 漫画组件 */
export const Manga: Component<MangaProps> = (props) => {
  let rootRef: HTMLDivElement;

  onMount(() => {
    useInit(props, rootRef);
    rootRef.focus();
  });

  createEffect(() => {
    if (props.show) rootRef.focus();
  });

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
      onKeyUp={stopPropagation}
      onKeyDown={handleKeyUp}
      role="presentation"
      tabIndex={-1}
    >
      <ComicImgFlow />
      <Toolbar />
      <Scrollbar />
      <TouchArea />
      <EndPage />
    </div>
  );
};
