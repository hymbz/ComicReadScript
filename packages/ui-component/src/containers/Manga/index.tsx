import { useInit } from './hooks/useInit';
import { ComicImgFlow } from './components/ComicImgFlow';
import { Toolbar } from './components/Toolbar';
import { CssVar } from './components/CssVar';
import { Scrollbar } from './components/Scrollbar';
import { TouchArea } from './components/TouchArea';

import classes from './index.module.css';
import { useStore } from './hooks/useStore';
import type { OtherSlice } from './hooks/useStore/OtherSlice';
import type { FillEffect } from './hooks/useStore/ImageSlice';
import type { Option } from './hooks/useStore/OptionSlice';

export { ToolbarButton } from './components/ToolbarButton';

export interface MangaProps {
  /** 图片url列表 */
  imgUrlList: string[];
  /** 页面填充数据 */
  fillEffect?: FillEffect;
  /** 初始化配置 */
  option?: Partial<Option>;
  /** 修改默认侧边栏按钮列表 */
  editButtonList?: OtherSlice['editButtonList'];
  /** 修改默认设置项列表 */
  editSettingList?: OtherSlice['editSettingList'];
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
