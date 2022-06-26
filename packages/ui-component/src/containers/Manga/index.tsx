import type { CSSProperties } from 'react';
import { useMemo } from 'react';
import { ImgFlow } from './components/ComicImgFlow';
import type { InitData } from './hooks/useInit';
import { useInit } from './hooks/useInit';
import { shallow, useStore } from './hooks/useStore';

interface MangaProps {
  imgUrlList: string[];
  initData?: InitData;
}

const selector = ({ mainRef, styles, option }: SelfState) => ({
  mainRef,
  styles,
  option,
});

/**
 * APP 测试
 *
 * @param props.imgUrlList 图片url列表
 * @param props.initData 初始化配置
 */
export const Manga: React.FC<MangaProps> = ({ imgUrlList, initData }) => {
  const { mainRef, handleScroll, handleKeyUp } = useInit(imgUrlList, initData);

  const { styles, option } = useStore(selector, shallow);

  const style = useMemo<CSSProperties>(
    () => ({
      overflow: 'hidden',
      userSelect: 'none',

      ...styles.normal,
    }),
    [styles.normal],
  );

  return (
    <div>
      <div
        id="manga-main"
        style={style}
        onWheel={handleScroll}
        tabIndex={-1}
        onKeyUp={handleKeyUp}
        role="presentation"
      >
        <ImgFlow ref={mainRef} />
      </div>

      {/* <div className="i-twemoji-grinning-face-with-smiling-eyes hover:i-twemoji-face-with-tears-of-joy" />
      <button
        type="button"
        // TODO:类名太长了，需要用 unncss 的功能优化下
        className="flex mx-auto mt-16 text-white bg-indigo-500 border-0 py-2 px-8 focus:outline-none hover:bg-indigo-600 rounded text-lg"
      >
        add
      </button> */}

      {/* eslint-disable-next-line react/jsx-curly-brace-presence */}
      <style type="text/css">{`@unocss-placeholder;`}</style>
    </div>
  );
};
