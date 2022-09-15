import { useMemo } from 'react';
import { useHover } from '../hooks/useHover';
import { useStore } from '../hooks/useStore';

import { defaultButtonList } from '../defaultButtonList';

import classes from '../index.module.css';

/** 左侧工具栏 */
export const Toolbar: React.FC = () => {
  const showToolbar = useStore((state) => state.showToolbar);
  const [isHover, handleMouseEnter, handleMouseLeave] = useHover();

  const buttonList = useMemo(
    () =>
      defaultButtonList.map(([key, ButtonItem]) => (
        <ButtonItem key={key} onMouseLeave={handleMouseLeave} />
      )),
    [handleMouseLeave],
  );

  return (
    <div
      role="toolbar"
      className={classes.toolbar}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={handleMouseEnter}
      data-show={isHover || showToolbar}
    >
      <div className={classes.toolbarPanel}>{buttonList}</div>
    </div>
  );
};
