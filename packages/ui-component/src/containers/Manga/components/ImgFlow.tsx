import { forwardRef } from 'react';

import { useStore, shallow } from '../hooks/useStore';

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
    <div
      ref={ref}
      dir={dir}
      className="manga-swiper-container"
      // css={css({
      //   height: '100vh',
      //   visibility: 'hidden',
      // })}
    >
      <div className="manga-swiper-wrapper">
        {slideData.map(([a, b]) => (
          <div
            key={`${a.index} ${b?.index}`}
            className="manga-swiper-slide"
            // css={css({
            //   display: 'flex',
            //   alignItems: 'center',
            //   justifyContent: 'center',
            //   height: '100vh',
            //   margin: 0,
            //   '& img': {
            //     width: 'auto',
            //     height: '100%',
            //     verticalAlign: 'middle',
            //     imageRendering: '-webkit-optimize-contrast',
            //     '&.fill': {
            //       visibility: 'hidden',
            //     },
            //     '&.long': {
            //       width: '100%',
            //       height: 'auto',
            //     },
            //   },
            // })}
          >
            <img src={a.src} alt={`${a.index}`} className={a.type} />
            {b ? (
              <img src={b.src} alt={`${b.index}`} className={b.type} />
            ) : undefined}
          </div>
        ))}
      </div>
    </div>
  );
});
ImgFlow.displayName = 'ImgFlow';
