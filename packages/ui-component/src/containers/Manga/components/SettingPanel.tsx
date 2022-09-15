import clsx from 'clsx';
import { Fragment, memo } from 'react';

import { defaultSettingsList } from '../defaultSettingList';

import classes from '../index.module.css';

/** 菜单面板 */
export const SettingPanel: React.FC = memo(() => (
  <div
    className={clsx(
      classes.toolbarButtonPopper,
      classes.SettingPanelPopper,
      classes.cardShadow,
    )}
  >
    <div className={classes.SettingPanel}>
      {defaultSettingsList.map(([key, SettingItem], i) => (
        <Fragment key={key}>
          {i ? <hr /> : undefined}
          <div className={classes.SettingBlock}>
            <div className={classes.SettingBlockSubtitle}>{key}</div>
            <SettingItem />
          </div>
        </Fragment>
      ))}
    </div>
  </div>
));
