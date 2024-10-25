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
import { stopPropagation } from './helper';
import classes, { css as style } from './index.module.css';

enableScheduling();

export interface MangaProps {
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
  onLoading?: (imgList: ComicImg[], img?: ComicImg) => unknown;

  /** 修改默认工具栏按钮列表 */
  editButtonList?: State['prop']['editButtonList'];
  /** 修改默认设置项列表 */
  editSettingList?: State['prop']['editSettingList'];
}

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
        oncapture:keypress={stopPropagation}
        oncapture:keyup={stopPropagation}
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

export { buttonListDivider } from './defaultButtonList';
export { store, setState, _setState } from './store/index';
export * from './actions';
