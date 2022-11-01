import { memo } from 'react';
import { useStore } from '../hooks/useStore';
import classes from '../index.module.css';

export const ScrollbarPage: React.FC<Pick<ComicImg, 'index'>> = memo(
  ({ index }) => {
    const loadType = useStore((state) => state.imgList[index].loadType);

    return (
      <div
        className={classes.scrollbarPage}
        data-index={index}
        data-type={loadType}
      />
    );
  },
);
