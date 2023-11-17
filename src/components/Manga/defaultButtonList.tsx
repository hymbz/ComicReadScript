import MdLooksOne from '@material-design-icons/svg/round/looks_one.svg';
import MdLooksTwo from '@material-design-icons/svg/round/looks_two.svg';
import MdViewDay from '@material-design-icons/svg/round/view_day.svg';
import MdQueue from '@material-design-icons/svg/round/queue.svg';
import MdSettings from '@material-design-icons/svg/round/settings.svg';
import MdSearch from '@material-design-icons/svg/round/search.svg';
import MdTranslate from '@material-design-icons/svg/round/translate.svg';
import MdGrid from '@material-design-icons/svg/round/grid_4x4.svg';

import { createMemo, type Component, createSignal } from 'solid-js';
import { t } from 'helper/i18n';
import { setState, store } from './hooks/useStore';
import { IconButton } from '../IconButton';
import { SettingPanel } from './components/SettingPanel';

import {
  activePage,
  nowFillIndex,
  zoomScrollModeImg,
  switchFillEffect,
  switchScrollMode,
  switchOnePageMode,
  doubleClickZoom,
  switchGridMode,
} from './hooks/useStore/slice';

import { setImgTranslationEnbale } from './hooks/useStore/slice/Translation';

import classes from './index.module.css';

export type ToolbarButtonList = Component[];

/** 工具栏按钮分隔栏 */
export const buttonListDivider: Component = () => (
  <div style={{ height: '1em' }} />
);

/** 工具栏的默认按钮列表 */
export const defaultButtonList: ToolbarButtonList = [
  // 单双页模式
  () => (
    <IconButton
      tip={
        store.option.onePageMode
          ? t('button.page_mode_single')
          : t('button.page_mode_double')
      }
      hidden={store.isMobile || store.option.scrollMode}
      onClick={switchOnePageMode}
      children={store.option.onePageMode ? <MdLooksOne /> : <MdLooksTwo />}
    />
  ),
  // 卷轴模式
  () => (
    <IconButton
      tip={t('button.scroll_mode')}
      enabled={store.option.scrollMode}
      onClick={switchScrollMode}
      children={<MdViewDay />}
    />
  ),
  // 页面填充
  () => (
    <IconButton
      tip={t('button.page_fill')}
      enabled={store.fillEffect[nowFillIndex()]}
      hidden={store.isMobile || store.option.onePageMode}
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
    <IconButton
      tip={t('button.zoom_in')}
      enabled={
        store.zoom.scale !== 100 ||
        (store.option.scrollMode && store.option.scrollModeImgScale > 1)
      }
      onClick={() => {
        if (!store.option.scrollMode) return doubleClickZoom();

        if (
          store.option.scrollModeImgScale >= 1 &&
          store.option.scrollModeImgScale < 1.6
        )
          return zoomScrollModeImg(0.2);
        return zoomScrollModeImg(1, true);
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
        tip={
          isTranslatingImage()
            ? t('button.close_current_page_translation')
            : t('button.translate_current_page')
        }
        enabled={isTranslatingImage()}
        hidden={store.option.translation.server === 'disable'}
        onClick={() =>
          setImgTranslationEnbale(activePage(), !isTranslatingImage())
        }
        children={<MdTranslate />}
      />
    );
  },
  // 设置
  () => {
    const [showPanel, setShowPanel] = createSignal(false);

    const handleClick = () => {
      const _showPanel = !showPanel();
      setState((state) => {
        state.show.toolbar = _showPanel;
      });
      setShowPanel(_showPanel);
    };

    const popper = createMemo(() => (
      <>
        <SettingPanel />
        <div
          class={classes.closeCover}
          on:click={handleClick}
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
