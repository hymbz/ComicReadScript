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

// 不同图片类型的 class
const ImgClassMap: Record<string, string> = {
  fill: 'invisible',
  long: 'w-full h-auto',
};

/**
 * 将 img.type 转换成 className
 *
 * @param type 图片类型
 */
const imgTypeToClass = (type: ComicImg['type']) =>
  [type, ImgClassMap[type]].filter((e) => e).join(' ');

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
            <img
              src={a.src}
              alt={`${a.index}`}
              className={`${imgTypeToClass(a.type)} w-auto h-full align-middle`}
            />
            {b ? (
              <img
                src={b.src}
                alt={`${b.index}`}
                className={`${imgTypeToClass(
                  b.type,
                )} w-auto h-full align-middle`}
                // style={{ imageRendering: '-webkit-optimize-contrast' }}
              />
            ) : undefined}
          </div>
        ))}
      </div>

      {/*
        FIXME:看看有没有其他 css 库能避免这样直接手写 css
         没有的话就看看能不能对这里的 css 进行高亮和格式化
      */}
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
