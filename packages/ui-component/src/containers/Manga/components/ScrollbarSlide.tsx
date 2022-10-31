import { memo } from 'react';
import { useStore } from '../hooks/useStore';
import classes from '../index.module.css';

export interface ScrollbarSlideProps {
  index: number;
}

export const ScrollbarSlide: React.FC<ScrollbarSlideProps> = memo(
  ({ index }) => {
    const loadType = useStore((state) => state.imgList[index].loadType);

    return (
      <div
        className={classes.scrollbarSlide}
        data-index={index}
        data-type={loadType}
      />
    );
  },
);
