import type { Component } from 'solid-js';

import MdFullscreenExit from '@material-design-icons/svg/round/fullscreen_exit.svg';
import MdFullscreen from '@material-design-icons/svg/round/fullscreen.svg';
import MdGrid from '@material-design-icons/svg/round/grid_4x4.svg';
import MdLooksOne from '@material-design-icons/svg/round/looks_one.svg';
import MdLooksTwo from '@material-design-icons/svg/round/looks_two.svg';
import MdLowPriority from '@material-design-icons/svg/round/low_priority.svg';
import MdQueue from '@material-design-icons/svg/round/queue.svg';
import MdSettings from '@material-design-icons/svg/round/settings.svg';
import MdTranslate from '@material-design-icons/svg/round/translate.svg';
import MdViewDay from '@material-design-icons/svg/round/view_day.svg';
import MdZoomIn from '@material-design-icons/svg/round/zoom_in.svg';
import MdZoomOut from '@material-design-icons/svg/round/zoom_out.svg';
import { createSignal, Show } from 'solid-js';

import { createEffectOn, t } from 'helper';

import { IconButton } from '../IconButton';
import {
  doubleClickZoom,
  handleScrollModeZoom,
  isOnePageMode,
  isScrollMode,
  isTranslatingImage,
  isTranslatingToEnd,
  nowFillIndex,
  switchFillEffect,
  switchFullscreen,
  switchGridMode,
  switchOnePageMode,
  switchScrollMode,
  translateCurrent,
  translateToEnd,
} from './actions';
import { AutoScrollButton } from './components/autoScroll';
import { SettingPanel } from './components/SettingPanel';
import classes from './index.module.css';
import { refs, setState, store } from './store';

export type ToolbarButtonList = Component[];

const ZoomButton = () => (
  <IconButton
    tip={
      store.option.zoom.ratio === 100
        ? t('button.zoom_in')
        : t('button.zoom_out')
    }
    enabled={store.option.zoom.ratio !== 100}
    onClick={() => doubleClickZoom()}
    children={
      <Show
        when={store.option.zoom.ratio === 100}
        fallback={<MdZoomOut />}
        children={<MdZoomIn />}
      />
    }
  />
);

/** 工具栏的默认按钮列表 */
export const defaultButtonList: ToolbarButtonList = [
  // 单双页模式
  () => (
    <IconButton
      tip={
        isOnePageMode()
          ? t('button.page_mode_single')
          : t('button.page_mode_double')
      }
      hidden={store.isMobile}
      onClick={switchOnePageMode}
      children={isOnePageMode() ? <MdLooksOne /> : <MdLooksTwo />}
    />
  ),
  // 卷轴模式
  () => (
    <IconButton
      tip={t('button.scroll_mode')}
      enabled={store.option.scrollMode.enabled}
      onClick={switchScrollMode}
      children={<MdViewDay />}
    />
  ),
  // 页面填充
  () => (
    <IconButton
      tip={t('button.page_fill')}
      enabled={Boolean(store.fillEffect[nowFillIndex()])}
      hidden={isOnePageMode()}
      onClick={switchFillEffect}
      children={<MdQueue />}
    />
  ),
  // 网格模式
  () => (
    <IconButton
      tip={t('button.grid_mode')}
      enabled={store.gridMode}
      onClick={switchGridMode}
      children={<MdGrid />}
    />
  ),
  // 翻译
  () => (
    <Show when={store.option.translation.server !== 'disable'}>
      <hr />
      <IconButton
        tip={
          isTranslatingImage()
            ? t('button.close_current_page_translation')
            : t('button.translate_current_page')
        }
        enabled={isTranslatingImage()}
        onClick={translateCurrent}
        children={<MdTranslate />}
      />
      <IconButton
        tip={t('setting.translation.translate_to_end')}
        enabled={isTranslatingToEnd()}
        hidden={store.option.translation.server !== 'selfhosted'}
        onClick={translateToEnd}
        children={<MdLowPriority />}
      />
    </Show>
  ),
  // 自动滚动
  () => (
    <Show when={store.option.autoScroll.enabled}>
      <hr />
      <AutoScrollButton />
    </Show>
  ),
  () => <hr />,
  // 缩放
  () => (
    <>
      {/* 翻页模式下是放大按钮 */}
      <Show when={!store.option.scrollMode.enabled}>
        <ZoomButton />
      </Show>

      {/* 卷轴模式下改为调整图片缩放比例 */}
      <Show
        when={
          store.option.scrollMode.enabled &&
          store.option.scrollMode.adjustToWidth !== 'full'
        }
      >
        <IconButton
          tip={t('button.zoom_in')}
          enabled={store.option.scrollMode.imgScale >= 3}
          onClick={() => handleScrollModeZoom('add')}
          children={<MdZoomIn />}
        />
        <IconButton
          tip={t('button.zoom_out')}
          enabled={store.option.scrollMode.imgScale <= 0.1}
          onClick={() => handleScrollModeZoom('sub')}
          children={<MdZoomOut />}
        />
      </Show>
    </>
  ),
  // 全屏
  () => (
    <IconButton
      tip={
        store.fullscreen ? t('button.fullscreen_exit') : t('button.fullscreen')
      }
      hidden={!refs.root.requestFullscreen}
      onClick={switchFullscreen}
      children={store.fullscreen ? <MdFullscreenExit /> : <MdFullscreen />}
    />
  ),
  // 设置
  () => {
    const [showPanel, setShowPanel] = createSignal(false);

    const handleClick = () => {
      const _showPanel = !showPanel();
      setState('show', 'toolbar', _showPanel);
      setShowPanel(_showPanel);
    };

    createEffectOn(
      () => store.show.toolbar,
      (showToolbar) => showToolbar || setShowPanel(false),
    );

    const Popper = (
      <Show when={showPanel()}>
        <SettingPanel />
        <div
          class={classes.closeCover}
          on:click={handleClick}
          onWheel={(e) => {
            if (isScrollMode()) refs.mangaBox.scrollBy({ top: e.deltaY });
          }}
          role="button"
          tabIndex={-1}
        />
      </Show>
    );

    return (
      <IconButton
        tip={t('other.setting')}
        enabled={showPanel()}
        showTip={showPanel()}
        onClick={handleClick}
        popperClassName={showPanel() && classes.SettingPanelPopper}
        popper={showPanel() && Popper}
        children={<MdSettings />}
      />
    );
  },
];
