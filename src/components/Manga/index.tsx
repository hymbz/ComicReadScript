import type { Component } from 'solid-js';
import type { PartialDeep } from 'type-fest';

import { createEffect, enableScheduling, onMount } from 'solid-js';

import { boolDataVal } from 'helper';

import type { ComicImg, FillEffect } from './store/image';
import type { State } from './store/index';
import type { Option } from './store/option';

import {
  bindRef,
  focus,
  handleKeyDown,
  handleKeyUp,
  handleMouseDown,
  handleWheel,
} from './actions';
import { ComicImgFlow } from './components/ComicImgFlow';
import { EndPage } from './components/EndPage';
import { Scrollbar } from './components/Scrollbar';
import { Toolbar } from './components/Toolbar';
import { TouchArea } from './components/TouchArea';
import { stopPropagation } from './helper';
import { useCssVar } from './hooks/useCssVar';
import { useInit } from './hooks/useInit';
import { useStyle } from './hooks/useStyle';
import classes, { css as style } from './index.module.css';
import { store } from './store/index';

enableScheduling();

export type ComicImgData = Partial<ComicImg> & { src: string };

export type MangaProps = {
  class?: string;
  classList?: ClassList;

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

/** 漫画组件 */
export const Manga: Component<MangaProps> = (props) => {
  useStyle(style);
  useCssVar();
  onMount(() => useInit(props));

  createEffect(() => props.show && focus());

  return (
    <>
      <div
        class={classes.root}
        classList={{
          [classes.hidden]: props.show === false,
          [props.class ?? '']: Boolean(props.class),
          ...props.classList,
        }}
        ref={bindRef('root')}
        on:click={stopPropagation}
        on:mousedown={handleMouseDown}
        on:wheel={handleWheel}
        oncapture:keydown={handleKeyDown}
        oncapture:keyup={handleKeyUp}
        data-mobile={boolDataVal(store.isMobile)}
        data-scroll-mode={boolDataVal(store.option.scrollMode.enabled)}
        data-grid-mode={boolDataVal(store.gridMode)}
      >
        <ComicImgFlow />
        <TouchArea />
        <Scrollbar />
        <EndPage />
        <Toolbar />
      </div>
    </>
  );
};

export * from './actions';
export { SettingHotkeys } from './components/SettingHotkeys';
export { SettingBlockSubtitle } from './components/SettingPanel';
export { SettingsItem } from './components/SettingsItem';
export { SettingsItemButton } from './components/SettingsItemButton';
export { SettingsItemNumber } from './components/SettingsItemNumber';
export { SettingsItemSwitch } from './components/SettingsItemSwitch';
export { downloadImg, downloadImgHeaders } from './helper';
export type { ComicImg } from './store/image';
export { refs, setState, store } from './store/index';
