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
  handleScroll,
  handleKeyUp,
}: SelfState) => ({
  slideData,
  option,
  handleScroll,
  handleKeyUp,
});

/**
 * 漫画图片流的容器
 */
export const ImgFlow: React.FC<ImgFlowProps> = () => {
  const { slideData, option, handleScroll, handleKeyUp } = useStore(
    selector,
    shallow,
  );

  return (
    <div
      className={classes.mangaFlow}
      tabIndex={-1}
      role="presentation"
      dir={option.dir}
      onWheel={handleScroll}
      onKeyUp={handleKeyUp}
    >
      <div className={classes.wrapper}>
        {slideData.map(([a, b]) => (
          <div key={`${a.index} ${b?.index}`} className={classes.mangaFlowPage}>
            <ComicImg src={a.src} index={`${a.index}`} type={a.type} />
            {b && <ComicImg src={b.src} index={`${b.index}`} type={b.type} />}
          </div>
        ))}
      </div>
    </div>
  );
};
