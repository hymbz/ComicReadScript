import {
  type Component,
  createEffect,
  enableScheduling,
  onMount,
} from 'solid-js';
import { boolDataVal } from 'helper';
import { type PartialDeep } from 'type-fest';

import { ComicImgFlow } from './components/ComicImgFlow';
import { Toolbar } from './components/Toolbar';
import { Scrollbar } from './components/Scrollbar';
import { TouchArea } from './components/TouchArea';
import { EndPage } from './components/EndPage';
import { useInit } from './hooks/useInit';
import { useStyle } from './hooks/useStyle';
import { useCssVar } from './hooks/useCssVar';
import { store, type State } from './store/index';
import { type FillEffect } from './store/image';
import { type Option } from './store/option';
import {
  bindRef,
  focus,
  handleKeyDown,
  handleMouseDown,
  handleWheel,
} from './actions';
import classes, { css as style } from './index.module.css';
import { stopPropagation } from './helper';

enableScheduling();

export type MangaProps = {
  class?: string;
  classList?: ClassList;

  /** 图片url列表 */
  imgList: string[];
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

export { store, setState, _setState, refs } from './store/index';
export { downloadImg } from './helper';
export * from './actions';
