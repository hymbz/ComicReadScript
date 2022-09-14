import type { InitData } from './hooks/useInit';
import { useInit } from './hooks/useInit';
import { ComicImgFlow } from './components/ComicImgFlow';
import { Toolbar } from './components/Toolbar';
import { CssVar } from './components/CssVar';
import { Scrollbar } from './components/Scrollbar';
import { TouchArea } from './components/TouchArea';

import classes from './index.module.css';
import { shallow, useStore } from './hooks/useStore';

interface MangaProps {
  imgUrlList: string[];
  initData?: InitData;
}

const selector = ({
  //
  handleScroll,
  handleKeyUp,
}: SelfState) => ({
  handleScroll,
  handleKeyUp,
});

/**
 * APP 测试
 *
 * @param props.imgUrlList 图片url列表
 * @param props.initData 初始化配置
 */
export const Manga: React.FC<MangaProps> = ({ imgUrlList, initData }) => {
  const { handleScroll, handleKeyUp } = useStore(selector, shallow);

  const rootRef = useInit(imgUrlList, initData);

  return (
    // eslint-disable-next-line jsx-a11y/no-static-element-interactions
    <div
      className={classes.root}
      ref={rootRef}
      onWheel={handleScroll}
      onKeyUp={handleKeyUp}
    >
      <CssVar />
      <Toolbar />
      <ComicImgFlow imgUrlList={imgUrlList} initData={initData} />
      <Scrollbar />
      <TouchArea />
    </div>
  );
};
