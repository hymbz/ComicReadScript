import type { InitData } from '../hooks/useInit';
import { useInit } from '../hooks/useInit';

import { useStore, shallow } from '../hooks/useStore';
import { ComicImg } from './ComicImg';

interface ImgFlowProps {
  imgUrlList: string[];
  initData?: InitData;
}

const selector = ({
  //
  slideData,
  mainRef,
  option,
}: SelfState) => ({
  slideData,
  option,
  mainRef,
});

export const ImgFlow: React.FC<ImgFlowProps> = ({ imgUrlList, initData }) => {
  const { mainRef, handleScroll, handleKeyUp } = useInit(imgUrlList, initData);
  const { slideData, option } = useStore(selector, shallow);

  return (
    <div
      id="manga-main"
      onWheel={handleScroll}
      tabIndex={-1}
      onKeyUp={handleKeyUp}
      role="presentation"
      ref={mainRef}
      dir={option.dir}
      className="manga-swiper-container text-[var(--primaryColor)] bg-[var(--backgroundColor)] h-full select-none"
    >
      <div className="manga-swiper-wrapper">
        {slideData.map(([a, b]) => (
          <div
            key={`${a.index} ${b?.index}`}
            className="manga-swiper-slide m-0 flex h-full items-center justify-center"
          >
            <ComicImg src={a.src} index={`${a.index}`} type={a.type} />
            {b && <ComicImg src={b.src} index={`${b.index}`} type={b.type} />}
          </div>
        ))}
      </div>

      <style type="text/css">{`
        .manga-swiper-slide > img {
          image-rendering: -webkit-optimize-contrast;
        };

        @unocss-placeholder;
      `}</style>
    </div>
  );
};
