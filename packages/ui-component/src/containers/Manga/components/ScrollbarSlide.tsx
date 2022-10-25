import { memo } from 'react';
import classes from '../index.module.css';

export interface ScrollbarSlideProps {
  img: ComicImg;
  key: string;
}

export const ScrollbarSlide: React.FC<ScrollbarSlideProps> = memo(({ img }) => (
  <div
    className={classes.scrollbarSlide}
    data-index={img.index}
    data-type={img.loadType}
  />
));
