import { ImgFlow } from './components/ComicImgFlow';
import { Toolbar } from './components/Toolbar';
import { CssVar } from './components/CssVar';
import type { InitData } from './hooks/useInit';

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
  // const { styles, option } = useStore(selector, shallow);

  // const style = useMemo<CSSProperties>(
  //   () => ({
  //     overflow: 'hidden',
  //     userSelect: 'none',

  //     ...styles.normal,
  //   }),
  //   [styles.normal],
  // );

  return (
    <div className={classes.root}>
      <Toolbar />
      <ImgFlow imgUrlList={imgUrlList} initData={initData} />
      <CssVar />
    </div>
  );
};
