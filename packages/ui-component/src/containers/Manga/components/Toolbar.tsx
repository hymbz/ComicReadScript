import { useCallback, useState } from 'react';

import { useStore } from '../hooks/useStore';

import { defaultButtonList } from './defaultButtonList';

/** 左侧工具栏 */
export const Toolbar: React.FC = () => {
  const showToolbar = useStore((state) => state.showToolbar);

  const [isHover, setIsHover] = useState(false);
  const handleMouseLeave = useCallback(() => {
    setIsHover(false);
  }, []);
  const handleMouseEnter = useCallback(() => {
    setIsHover(true);
  }, []);

  return (
    <div
      role="toolbar"
      className="w-5vw fixed z-10 flex h-full items-center"
      onMouseLeave={handleMouseLeave}
      onMouseEnter={handleMouseEnter}
    >
      <div
        className="panel p-1em pl-3em flex flex-col items-center duration-100"
        style={{
          marginLeft: isHover || showToolbar ? '-2.5em' : '-5.5em',
        }}
      >
        {defaultButtonList.map((ButtonItem) => (
          <ButtonItem />
        ))}
      </div>

      <style type="text/css">{`
        @unocss-placeholder;
      `}</style>
    </div>
  );
};
