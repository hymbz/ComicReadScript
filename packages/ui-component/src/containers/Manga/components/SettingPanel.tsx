import type { UIEventHandler } from 'react';
import { Fragment, memo, useCallback, useMemo } from 'react';
import { useStore } from '../hooks/useStore';

import { defaultSettingList } from '../defaultSettingList';

import classes from '../index.module.css';

/** 菜单面板 */
export const SettingPanel: React.FC = memo(() => {
  const editSettingList = useStore((state) => state.editSettingList);
  const settingList = useMemo(
    () => editSettingList(defaultSettingList),
    [editSettingList],
  );

  const handleScroll = useCallback<UIEventHandler>((e) => {
    e.stopPropagation();
  }, []);

  return (
    <div
      className={classes.SettingPanel}
      onScroll={handleScroll}
      onWheel={handleScroll}
    >
      {settingList.map(([key, SettingItem], i) => (
        <Fragment key={key}>
          {i ? <hr /> : null}
          <div className={classes.SettingBlock}>
            <div className={classes.SettingBlockSubtitle}>{key}</div>
            <SettingItem />
          </div>
        </Fragment>
      ))}
    </div>
  );
});
