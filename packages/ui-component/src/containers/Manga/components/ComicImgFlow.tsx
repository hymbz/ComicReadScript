import { forwardRef } from 'react';

import { useStore, shallow } from '../hooks/useStore';
import { ComicImg } from './ComicImg';

const selector = ({
  //
  option: { dir },
  slideData,
}: SelfState) => ({
  dir,
  slideData,
});

export const ImgFlow = forwardRef<HTMLDivElement>((_, ref) => {
  const { dir, slideData } = useStore(selector, shallow);

  return (
    <div ref={ref} dir={dir} className="manga-swiper-container h-screen">
      <div className="manga-swiper-wrapper">
        {slideData.map(([a, b]) => (
          <div
            key={`${a.index} ${b?.index}`}
            className="manga-swiper-slide flex h-screen items-center justify-center m-0"
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
});
ImgFlow.displayName = 'ImgFlow';
