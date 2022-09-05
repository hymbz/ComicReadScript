import { useHover } from '../hooks/useHover';
import { useStore } from '../hooks/useStore';

import { defaultButtonList } from '../defaultButtonList';

import classes from '../index.module.css';

/** 左侧工具栏 */
export const Toolbar: React.FC = () => {
  const showToolbar = useStore((state) => state.showToolbar);
  const [isHover, handleMouseEnter, handleMouseLeave] = useHover();

  return (
    <div
      role="toolbar"
      className={classes.toolbar}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={handleMouseEnter}
    >
      <div
        className={classes.toolbarPanel}
        style={{
          marginLeft: isHover || showToolbar ? '-2.5em' : '-5.5em',
        }}
      >
        {defaultButtonList.map(([key, ButtonItem]) => (
          <ButtonItem key={key} />
        ))}
      </div>
    </div>
  );
};
