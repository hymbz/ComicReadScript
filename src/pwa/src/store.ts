import { toast } from 'components/Toast';
import { createEffectOn, t, useStore } from 'helper';

import { getImgData } from './fileParser';

export type ImgFile = { name: string; src: string };
export const { store, setState } = useStore({
  /** 传入单个文件/文件夹时的标题 */
  title: '',
  /** 图片文件数据列表 */
  imgList: [] as ImgFile[],
  /** 是否显示漫画 */
  show: false,
  /** 是否有文件被拖拽到页面上 */
  dragging: false,
  /** 是否有文件正在加载中 */
  loading: false,
  /** 是否要隐藏安装提示 */
  hiddenInstallTip:
    (localStorage.getItem('InstallTip') as '' | 'init' | 'TD') ?? 'init',
});
export type State = typeof store;

export const handleExit = () => setState('show', false);

const collator = new Intl.Collator(undefined, { numeric: true });

/** 加载新的文件列表 */
export const loadNewImglist = async (files: File[], errorTip?: string) => {
  if (files.length === 0) return;

  if (store.loading) return toast.warn(t('pwa.alert.repeat_load'));

  setState('loading', true);

  try {
    const imgListRaw = await Promise.all(files.map(getImgData));
    const newImglist = imgListRaw.flat();
    if (newImglist.length === 0) {
      toast.warn(errorTip ?? t('pwa.alert.img_not_found'));
      return;
    }

    handleExit();
    setState((state) => {
      // 在清空上次的列表前把创建的 URL 对象释放掉
      for (const { src } of state.imgList) URL.revokeObjectURL(src);
      state.imgList = [];
    });
    setState((state) => {
      newImglist.sort((a, b) => collator.compare(a.name, b.name));
      state.imgList = newImglist;
      state.show = true;

      // 在用过一次后提示安装
      if (state.hiddenInstallTip === 'init' && state.imgList.length > 0)
        state.hiddenInstallTip = '';
    });
  } catch (error) {
    toast.error((error as Error).message, { throw: error as Error });
  } finally {
    setState('loading', false);
  }
};

// 将 hiddenInstallTip 的变动同步更新到 localStorage
createEffectOn(
  () => store.hiddenInstallTip,
  (v) => localStorage.setItem('InstallTip', v),
  { defer: true },
);
