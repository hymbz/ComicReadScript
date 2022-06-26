export interface ComicImgProps {
  src: string;
  index: string;
  type: ComicImg['type'];
}

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

/**
 * 漫画图片
 *
 * @param args.src 图片地址
 * @param args.index *
 * @param args.type 图片类型
 */
export const ComicImg: React.FC<ComicImgProps> = ({ src, index, type }) => {
  return (
    <>
      <img
        src={src}
        alt={`${index}`}
        className={`${imgTypeToClass(type)} w-auto h-full align-middle`}
      />
      <style type="text/css">{`
        @unocss-placeholder;
      `}</style>
    </>
  );
};
