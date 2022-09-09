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
export const ImgFlow: React.FC<ImgFlowProps> = () => {
  const { slideData, option } = useStore(selector, shallow);

  return (
    <div className={classes.mangaFlow} dir={option.dir}>
      <div className={classes.wrapper}>
        {slideData.map(([a, b], i) => (
          // 为了防止切换页面填充时 key 产生变化导致整个 dom 被重新创建，只能用 index 当 key
          // eslint-disable-next-line react/no-array-index-key
          <div key={i} className={classes.mangaFlowPage}>
            <ComicImg src={a.src} index={`${a.index}`} type={a.type} />
            {b && <ComicImg src={b.src} index={`${b.index}`} type={b.type} />}
          </div>
        ))}
      </div>
    </div>
  );
};
