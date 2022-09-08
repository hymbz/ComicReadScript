import type { InitData } from './hooks/useInit';
import { useInit } from './hooks/useInit';
import { ImgFlow } from './components/ComicImgFlow';
import { Toolbar } from './components/Toolbar';
import { CssVar } from './components/CssVar';
import { Scrollbar } from './components/Scrollbar';
import { TouchArea } from './components/TouchArea';

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
  const rootRef = useInit(imgUrlList, initData);

  return (
    <div className={classes.root} ref={rootRef}>
      <CssVar />
      <Toolbar />
      <ImgFlow imgUrlList={imgUrlList} initData={initData} />
      <Scrollbar />
      <TouchArea />
    </div>
  );
};
