import { useHover } from '../hooks/useHover';
import { useStore } from '../hooks/useStore';

import { defaultButtonList } from '../defaultButtonList';

/** 左侧工具栏 */
export const Toolbar: React.FC = () => {
  const showToolbar = useStore((state) => state.showToolbar);
  const [isHover, handleMouseEnter, handleMouseLeave] = useHover();

  return (
    <div
      role="toolbar"
      className="w-5vw flex fixed z-10 h-full items-center justify-start"
      onMouseLeave={handleMouseLeave}
      onMouseEnter={handleMouseEnter}
    >
      <div
        className="panel p-1em pl-3em flex flex-col duration-100"
        style={{
          marginLeft: isHover || showToolbar ? '-2.5em' : '-5.5em',
        }}
      >
        {defaultButtonList.map(([key, ButtonItem]) => (
          <ButtonItem key={key} />
        ))}
      </div>

      <style type="text/css">{`
        @unocss-placeholder;
      `}</style>
    </div>
  );
};
