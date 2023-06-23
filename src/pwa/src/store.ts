import { createStore, produce } from 'solid-js/store';

import { createEffect, createRoot, on } from 'solid-js';
import { toast } from '../../components/Toast';
import { unzip } from './unzip';
import { isSupportFile } from './helper';

export interface ImgFile {
  name: string;
  url: string;
}
const [_state, _setState] = createStore({
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
export type State = typeof _state;

export const setState = (fn: (state: State) => void) => _setState(produce(fn));

// eslint-disable-next-line solid/reactivity
export const store: Readonly<State> = _state;

/** 自动从句柄中找出并处理为图片数据 */
const getImgData = async (fileHandle: FileSystemHandle): Promise<ImgFile[]> => {
  // 处理文件
  if (fileHandle.kind === 'file') {
    const fileType = isSupportFile(fileHandle.name);
    if (!fileType) return [];

    const file = await (fileHandle as FileSystemFileHandle).getFile();
    return fileType === 'img'
      ? [{ name: fileHandle.name, url: URL.createObjectURL(file) }]
      : unzip(file, fileType);
  }

  // 处理文件夹
  const handleList: Array<FileSystemHandle> = [];
  // eslint-disable-next-line no-restricted-syntax
  for await (const handle of (fileHandle as FileSystemDirectoryHandle).values())
    handleList.push(handle);
  const list = await Promise.all(handleList.map(getImgData));
  return list.filter(Boolean).flat();
};

export const handleExit = () =>
  setState((state) => {
    state.show = false;
  });

/** 加载新的文件列表 */
export const loadNewImglist = async (
  handleList: readonly FileSystemHandle[],
  errorTip?: string,
) => {
  if (!handleList.length) return;

  if (store.loading) {
    toast.warn('正在加载其他文件中...');
    return;
  }

  setState((state) => {
    state.loading = true;
  });

  try {
    const newImglist = (await Promise.all(handleList.map(getImgData))).flat();
    if (!newImglist.length) {
      toast.warn(errorTip ?? '找不到图片');
      return;
    }

    handleExit();
    setState((state) => {
      // 在清空上次的列表前把创建的 URL 对象释放掉
      state.imgList.map(({ url }) => URL.revokeObjectURL(url));
      state.imgList = [];
    });
    setState((state) => {
      newImglist.sort((a, b) => a.name.localeCompare(b.name));
      state.imgList = newImglist;
      state.show = true;

      // 在用过一次后提示安装
      if (state.hiddenInstallTip === 'init' && state.imgList.length)
        state.hiddenInstallTip = '';
    });
  } catch (error) {
    toast.error((error as Error).message);
    throw error;
  } finally {
    setState((state) => {
      state.loading = false;
    });
  }
};

createRoot(() => {
  // 将 hiddenInstallTip 的变动同步更新到 localStorage
  createEffect(
    on(
      () => store.hiddenInstallTip,
      (v) => localStorage.setItem('InstallTip', v),
      { defer: true },
    ),
  );
});
