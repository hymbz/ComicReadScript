import MdLooksOne from '@material-design-icons/svg/round/looks_one.svg';
import MdLooksTwo from '@material-design-icons/svg/round/looks_two.svg';
import MdViewDay from '@material-design-icons/svg/round/view_day.svg';
import MdQueue from '@material-design-icons/svg/round/queue.svg';
import MdSettings from '@material-design-icons/svg/round/settings.svg';
import MdSearch from '@material-design-icons/svg/round/search.svg';
import MdTranslate from '@material-design-icons/svg/round/translate.svg';

import { createMemo, type Component, createSignal } from 'solid-js';
import { setState, store } from './hooks/useStore';
import { IconButton } from '../IconButton';
import { SettingPanel } from './components/SettingPanel';

import {
  activePage,
  jumpBackPage,
  nowFillIndex,
  setOption,
  zoomScrollModeImg,
  switchFillEffect,
  switchScrollMode,
  updatePageData,
  focus,
} from './hooks/useStore/slice';

import { setImgTranslationEnbale } from './hooks/useStore/slice/Translation';

import classes from './index.module.css';

interface DefaultSettingsButtonProps {
  /** 触发鼠标离开工具栏的事件 */
  onMouseLeave: () => void;
}

export type ToolbarButtonList = Component<DefaultSettingsButtonProps>[];

/** 工具栏按钮分隔栏 */
export const buttonListDivider: Component = () => (
  <div style={{ height: '1em' }} />
);

/** 工具栏的默认按钮列表 */
export const defaultButtonList: ToolbarButtonList = [
  // 单双页模式
  () => (
    <IconButton
      tip={store.option.onePageMode ? '单页模式' : '双页模式'}
      hidden={store.option.scrollMode}
      onClick={() => {
        const jump = jumpBackPage(store);
        setOption((draftOption) => {
          draftOption.onePageMode = !draftOption.onePageMode;
        });
        setState(updatePageData);
        jump();
      }}
      children={store.option.onePageMode ? <MdLooksOne /> : <MdLooksTwo />}
    />
  ),
  // 卷轴模式
  () => (
    <IconButton
      tip="卷轴模式"
      enabled={store.option.scrollMode}
      onClick={switchScrollMode}
      children={<MdViewDay />}
    />
  ),
  // 页面填充
  () => (
    <IconButton
      tip="页面填充"
      enabled={store.fillEffect[nowFillIndex()]}
      hidden={store.option.onePageMode}
      onClick={switchFillEffect}
      children={<MdQueue />}
    />
  ),
  buttonListDivider,
  // 放大模式
  () => (
    <IconButton
      tip="放大"
      enabled={
        store.isZoomed ||
        (store.option.scrollMode && store.option.scrollModeImgScale > 1)
      }
      onClick={() => {
        if (store.option.scrollMode) {
          return zoomScrollModeImg(
            store.option.scrollModeImgScale < 1 ||
              store.option.scrollModeImgScale > 1.6
              ? undefined
              : 0.2,
          );
        }

        if (!store.panzoom) return;
        const { scale } = store.panzoom.getTransform();

        if (scale === 1) store.panzoom.smoothZoom(0, 0, 1.2);
        else store.panzoom.smoothZoomAbs(0, 0, 1);
      }}
      children={<MdSearch />}
    />
  ),
  // 翻译设置
  () => {
    /** 当前显示的图片是否正在翻译 */
    const isTranslatingImage = createMemo(() =>
      activePage().some(
        (i) =>
          store.imgList[i]?.translationType &&
          store.imgList[i].translationType !== 'hide',
      ),
    );

    return (
      <IconButton
        tip={isTranslatingImage() ? '关闭当前页的翻译' : '翻译当前页'}
        enabled={isTranslatingImage()}
        hidden={store.option.translation.server === '禁用'}
        onClick={() =>
          setImgTranslationEnbale(activePage(), !isTranslatingImage())
        }
        children={<MdTranslate />}
      />
    );
  },
  // 设置
  (props) => {
    const [showPanel, setShowPanel] = createSignal(false);

    const handleClick = () => {
      const _showPanel = !showPanel();
      setState((state) => {
        state.showToolbar = _showPanel;
      });
      setShowPanel(_showPanel);
    };

    const popper = createMemo(() => (
      <>
        <SettingPanel />
        <div
          class={classes.closeCover}
          on:click={() => {
            handleClick();
            props.onMouseLeave();
            setState((state) => {
              state.showToolbar = false;
              state.showScrollbar = false;
            });
            focus();
          }}
          role="button"
          tabIndex={-1}
          aria-label="关闭弹窗的遮罩"
        />
      </>
    ));

    return (
      <IconButton
        tip="设置"
        enabled={showPanel()}
        showTip={showPanel()}
        onClick={handleClick}
        popperClassName={showPanel() && classes.SettingPanelPopper}
        popper={showPanel() && popper()}
        children={<MdSettings />}
      />
    );
  },
];
