import MdLooksOne from '@material-design-icons/svg/round/looks_one.svg';
import MdLooksTwo from '@material-design-icons/svg/round/looks_two.svg';
import MdViewDay from '@material-design-icons/svg/round/view_day.svg';
import MdQueue from '@material-design-icons/svg/round/queue.svg';
import MdSettings from '@material-design-icons/svg/round/settings.svg';

import { useMemo, useCallback, useState } from 'react';
import { useStore } from './hooks/useStore';
import { IconBotton } from '../IconBotton';
import { SettingPanel } from './components/SettingPanel';

import classes from './index.module.css';

interface DefaultSettingsButtonProps {
  /** 触发鼠标离开工具栏的事件 */
  onMouseLeave: () => void;
}

export type DefaultButtonList = [
  string,
  React.FC<DefaultSettingsButtonProps>,
][];

// FIXME: ESlint 莫名把这列表当成了 jsdoc，等之后更新修复再删除这个注释
// eslint-disable-next-line jsdoc/require-param
/** 工具栏的默认按钮列表 */
export const defaultButtonList: DefaultButtonList = [
  [
    '单页模式',
    () => {
      const isOnePageMode = useStore((state) => state.option.onePageMode);
      const handleClick = useCallback(() => {
        useStore.setState((draftState) => {
          draftState.option.onePageMode = !draftState.option.onePageMode;
          draftState.img.updateSlideData.sync();
          draftState.activeSlideIndex = draftState.option.onePageMode
            ? draftState.activeImgIndex
            : draftState.slideData.findIndex((slide) =>
                slide.some((img) => img.index === draftState.activeImgIndex),
              );
        });
      }, []);

      const isScrollMode = useStore((state) => state.option.scrollMode);
      return (
        <IconBotton tip="单页模式" onClick={handleClick} hidden={isScrollMode}>
          {isOnePageMode ? <MdLooksOne /> : <MdLooksTwo />}
        </IconBotton>
      );
    },
  ],
  [
    '卷轴模式',
    () => {
      const enabled = useStore((state) => state.option.scrollMode);

      const handleClick = useCallback(() => {
        useStore.setState((draftState) => {
          draftState.option.scrollMode = !draftState.option.scrollMode;
          draftState.option.onePageMode = draftState.option.scrollMode;
          draftState.img.updateSlideData.sync();
          draftState.activeSlideIndex = draftState.activeImgIndex;
        });
      }, []);

      return (
        <IconBotton tip="卷轴模式" enabled={enabled} onClick={handleClick}>
          <MdViewDay />
        </IconBotton>
      );
    },
  ],
  [
    '页面填充',
    () => {
      const enabled = useStore(
        (state) => state.fillEffect.get(state.nowFillIndex)!,
      );
      const isOnePageMode = useStore((state) => state.option.onePageMode);

      const handleClick = useStore((state) => state.img.switchFillEffect);

      return (
        <IconBotton
          tip="页面填充"
          enabled={enabled}
          hidden={isOnePageMode}
          onClick={handleClick}
        >
          <MdQueue />
        </IconBotton>
      );
    },
  ],
  ['分隔', () => <div style={{ height: '1em' }} />],
  [
    '设置',
    ({ onMouseLeave }) => {
      const [showPanel, setShowPanel] = useState(false);

      const handleClick = useCallback(() => {
        useStore.setState((draftState) => {
          draftState.showToolbar = !showPanel;
        });
        setShowPanel(!showPanel);
      }, [showPanel]);

      const popper = useMemo(
        () => (
          <>
            <SettingPanel />
            <div
              className={classes.closeCover}
              onClick={() => {
                handleClick();
                onMouseLeave();
              }}
              role="button"
              tabIndex={-1}
              aria-label="关闭设置弹窗的遮罩"
            />
          </>
        ),
        [handleClick, onMouseLeave],
      );

      return (
        <IconBotton
          tip="设置"
          enabled={showPanel}
          showTip={showPanel}
          onClick={handleClick}
          popperClassName={showPanel && classes.SettingPanelPopper}
          popper={showPanel && popper}
        >
          <MdSettings />
        </IconBotton>
      );
    },
  ],
];
