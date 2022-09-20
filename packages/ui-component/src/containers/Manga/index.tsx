import type { InitData } from './hooks/useInit';
import { useInit } from './hooks/useInit';
import { ComicImgFlow } from './components/ComicImgFlow';
import { Toolbar } from './components/Toolbar';
import { CssVar } from './components/CssVar';
import { Scrollbar } from './components/Scrollbar';
import { TouchArea } from './components/TouchArea';

import classes from './index.module.css';
import { useStore } from './hooks/useStore';

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

  return (
    <div
      className={classes.root}
      ref={rootRef}
      onWheel={handleScroll}
      onKeyUp={handleKeyUp}
      role="presentation"
    >
      <CssVar />
      <Toolbar />
      <ComicImgFlow imgUrlList={imgUrlList} initData={initData} />
      <Scrollbar />
      <TouchArea />
    </div>
  );
};
