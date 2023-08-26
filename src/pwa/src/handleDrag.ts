import { setState, loadNewImglist } from './store';
import { FileSystemToFile } from './helper';

import classes from './index.module.css';

const setDragging = (v: boolean) =>
  setState((state) => {
    state.dragging = v;
  });

export const handleDrag = (ref: HTMLElement) => {
  ref.addEventListener('drop', async (e: DragEvent) => {
    setDragging(false);
    e.preventDefault();
    if (!e.dataTransfer) return;

    const handleList = (
      await Promise.all(
        [...e.dataTransfer.items].map((handle) =>
          handle.getAsFileSystemHandle(),
        ),
      )
    ).filter(Boolean) as FileSystemHandle[];
    loadNewImglist(await FileSystemToFile(handleList));
  });

  // 防止拖拽文件被浏览器处理
  ref.addEventListener('dragover', (e) => e.preventDefault());

  ref.addEventListener('dragenter', () => setDragging(true));
  ref.addEventListener('dragleave', (e) => {
    if ((e.target as HTMLElement).className !== classes.root) return;
    setDragging(false);
  });
};
