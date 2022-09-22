import type { InitData } from './hooks/useInit';
import { useInit } from './hooks/useInit';
import { ComicImgFlow } from './components/ComicImgFlow';
import { Toolbar } from './components/Toolbar';
import { Scrollbar } from './components/Scrollbar';
import { TouchArea } from './components/TouchArea';

import { useStore } from './hooks/useStore';
import { useCssVar } from './hooks/useCssVar';

import classes from './index.module.css';

interface MangaProps {
  imgUrlList: string[];
  initData?: InitData;
}

/**
 * APP 测试
 *
 * @param props.imgUrlList 图片url列表
 * @param props.initData 初始化配置
 */
export const Manga: React.FC<MangaProps> = ({ imgUrlList, initData }) => {
  const handleScroll = useStore((state) => state.handleScroll);
  const handleKeyUp = useStore((state) => state.handleKeyUp);

  const rootRef = useInit(imgUrlList, initData);
  const cssVar = useCssVar();

  return (
    <div
      className={classes.root}
      ref={rootRef}
      onWheel={handleScroll}
      onKeyUp={handleKeyUp}
      style={cssVar}
    >
      <Toolbar />
      <ComicImgFlow imgUrlList={imgUrlList} initData={initData} />
      <Scrollbar />
      <TouchArea />
    </div>
  );
};
