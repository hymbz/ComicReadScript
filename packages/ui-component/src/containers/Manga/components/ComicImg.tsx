import clsx from 'clsx';

import classes from '../index.module.css';

export interface ComicImgProps {
  src: string;
  index: string;
  type: ComicImg['type'];
}

/**
 * 漫画图片
 *
 * @param args.src 图片地址
 * @param args.index *
 * @param args.type 图片类型
 */
export const ComicImg: React.FC<ComicImgProps> = ({ src, index, type }) => {
  return (
    <img
      src={src}
      alt={`${index}`}
      className={clsx(classes.img, classes[type])}
      style={{ backgroundImage: `url(${src})` }}
    />
  );
};
