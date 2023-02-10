import { useMemo } from 'react';
import { useHover } from '../hooks/useHover';
import { useStore } from '../hooks/useStore';

import { defaultButtonList } from '../defaultButtonList';

import classes from '../index.module.css';

/** 左侧工具栏 */
export const Toolbar: React.FC = () => {
  const showToolbar = useStore((state) => state.showToolbar);
  const [isHover, handleMouseEnter, handleMouseLeave] = useHover();

  const editButtonList = useStore((state) => state.editButtonList);
  const buttonList = useMemo(
    () =>
      editButtonList(defaultButtonList).map(([key, ButtonItem], i) => (
        <ButtonItem key={key || i} onMouseLeave={handleMouseLeave} />
      )),
    [editButtonList, handleMouseLeave],
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
