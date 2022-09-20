import type { InitData } from './hooks/useInit';
import { useInit } from './hooks/useInit';
import { ComicImgFlow } from './components/ComicImgFlow';
import { Toolbar } from './components/Toolbar';
import { CssVar } from './components/CssVar';
import { Scrollbar } from './components/Scrollbar';
import { TouchArea } from './components/TouchArea';

import classes from './index.module.css';
import { useStore } from './hooks/useStore';

export interface MangaProps {
  /** 图片url列表 */
  imgUrlList: string[];
  /** 初始化配置 */
  initData?: InitData;
  /** 修改默认侧边栏按钮列表 */
  editButtonList?: SelfState['editButtonList'];
  /** 修改默认设置项列表 */
  editSettingList?: SelfState['editSettingList'];
}

/**
 * APP 测试
 *
 * @param props
 */
export const Manga: React.FC<MangaProps> = (props) => {
  const handleScroll = useStore((state) => state.handleScroll);
  const handleKeyUp = useStore((state) => state.handleKeyUp);

  const rootRef = useInit(props);

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
      <ComicImgFlow />
      <Scrollbar />
      <TouchArea />
    </div>
  );
};
