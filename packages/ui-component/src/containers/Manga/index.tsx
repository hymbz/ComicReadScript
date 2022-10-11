import { useInit } from './hooks/useInit';
import { ComicImgFlow } from './components/ComicImgFlow';
import { Toolbar } from './components/Toolbar';
import { Scrollbar } from './components/Scrollbar';
import { TouchArea } from './components/TouchArea';
import { EndPage } from './components/EndPage';

import { useStore } from './hooks/useStore';
import { useCssVar } from './hooks/useCssVar';

import classes from './index.module.css';

import type { OtherSlice } from './hooks/useStore/OtherSlice';
import type { FillEffect } from './hooks/useStore/ImageSlice';
import type { Option } from './hooks/useStore/OptionSlice';

export interface MangaProps {
  /** 图片url列表 */
  imgList: string[];
  /** 页面填充数据 */
  fillEffect?: FillEffect;
  /** 初始化配置 */
  option?: Partial<Option>;

  /** 点击结束页按钮时触发的回调 */
  onExit?: () => void | Promise<void>;
  /** 点击上一话按钮时触发的回调 */
  onPrev?: () => void | Promise<void>;
  /** 点击下一话按钮时触发的回调 */
  onNext?: () => void | Promise<void>;
  /** 配置发生变化时触发的回调 */
  onOptionChange?: (option: Option, prevOption: Option) => void | Promise<void>;

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
  const rootRef = useInit(props);
  const cssVar = useCssVar();

  const handleScroll = useStore((state) => state.handleScroll);
  const handleKeyUp = useStore((state) => state.handleKeyUp);

  return (
    <div
      className={classes.root}
      ref={rootRef}
      style={cssVar}
      onWheel={handleScroll}
      onKeyUp={handleKeyUp}
      role="presentation"
    >
      <Toolbar />
      <ComicImgFlow />
      <Scrollbar />
      <TouchArea />
      <EndPage />
    </div>
  );
};
