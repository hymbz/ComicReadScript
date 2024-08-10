import MdLooksOne from '@material-design-icons/svg/round/looks_one.svg';
import MdLooksTwo from '@material-design-icons/svg/round/looks_two.svg';
import MdViewDay from '@material-design-icons/svg/round/view_day.svg';
import MdQueue from '@material-design-icons/svg/round/queue.svg';
import MdSettings from '@material-design-icons/svg/round/settings.svg';
import MdTranslate from '@material-design-icons/svg/round/translate.svg';
import MdGrid from '@material-design-icons/svg/round/grid_4x4.svg';
import MdZoomIn from '@material-design-icons/svg/round/zoom_in.svg';
import MdZoomOut from '@material-design-icons/svg/round/zoom_out.svg';
import { createMemo, type Component, createSignal, Show } from 'solid-js';
import { t } from 'helper';

import { IconButton } from '../IconButton';

import { _setState, refs, store } from './store';
import { SettingPanel } from './components/SettingPanel';
import {
  nowFillIndex,
  zoomScrollModeImg,
  switchFillEffect,
  switchScrollMode,
  switchOnePageMode,
  doubleClickZoom,
  switchGridMode,
  switchTranslation,
  isTranslatingImage,
  isOnePageMode,
  isScrollMode,
} from './actions';
import classes from './index.module.css';

export type ToolbarButtonList = Component[];

/** 工具栏按钮分隔栏 */
export const buttonListDivider: Component = () => (
  <div style={{ height: '1em' }} />
);

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
      hidden={store.isMobile || store.option.scrollMode.enabled}
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
  buttonListDivider,
  // 放大模式
  () => (
    <Show when={store.option.scrollMode.enabled} fallback={<ZoomButton />}>
      <IconButton
        tip={t('button.zoom_in')}
        enabled={store.option.scrollMode.imgScale >= 3}
        onClick={() => zoomScrollModeImg(0.05)}
        children={<MdZoomIn />}
      />
      <IconButton
        tip={t('button.zoom_out')}
        enabled={store.option.scrollMode.imgScale <= 0.1}
        onClick={() => zoomScrollModeImg(-0.05)}
        children={<MdZoomOut />}
      />
    </Show>
  ),
  // 翻译设置
  () => (
    <IconButton
      tip={
        isTranslatingImage()
          ? t('button.close_current_page_translation')
          : t('button.translate_current_page')
      }
      enabled={isTranslatingImage()}
      hidden={store.option.translation.server === 'disable'}
      onClick={switchTranslation}
      children={<MdTranslate />}
    />
  ),
  // 设置
  () => {
    const [showPanel, setShowPanel] = createSignal(false);

    const handleClick = () => {
      const _showPanel = !showPanel();
      _setState('show', 'toolbar', _showPanel);
      setShowPanel(_showPanel);
    };

    const popper = createMemo(() => (
      <>
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
      </>
    ));

    return (
      <IconButton
        tip={t('button.setting')}
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
