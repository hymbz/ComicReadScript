import clsx from 'clsx';
import type { InitData } from '../hooks/useInit';

import { useStore, shallow } from '../hooks/useStore';
import { ComicImg } from './ComicImg';

import classes from '../index.module.css';

interface ImgFlowProps {
  imgUrlList: string[];
  initData?: InitData;
}

const selector = ({
  //
  slideData,
  option,
}: SelfState) => ({
  slideData,
  option,
});

/**
 * 漫画图片流的容器
 */
export const ComicImgFlow: React.FC<ImgFlowProps> = () => {
  const { slideData, option } = useStore(selector, shallow);

  return (
    <div
      className={clsx(
        classes.mangaFlow,
        option.disableZoom && classes.disableZoom,
      )}
      dir={option.dir}
    >
      <div className={classes.wrapper}>
        {slideData.map(([a, b], i) => (
          // 为了防止切换页面填充时 key 产生变化导致整个 dom 被重新创建，只能用 index 当 key
          // eslint-disable-next-line react/no-array-index-key
          <div key={i} className={classes.mangaFlowPage}>
            <ComicImg img={a} />
            {b && <ComicImg img={b} />}
          </div>
        ))}
      </div>
    </div>
  );
};
