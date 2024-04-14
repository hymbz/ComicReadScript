import { getFilesFromDataTransferItems } from '@placemarkio/flat-drop-files';

import { loadNewImglist, _setState } from './store';
import classes from './index.module.css';

const setDragging = (v: boolean) => _setState('dragging', v);

export const handleDrag = (ref: HTMLElement) => {
  ref.addEventListener('drop', async (e: DragEvent) => {
    setDragging(false);
    e.preventDefault();
    if (!e.dataTransfer) return;
    return loadNewImglist(
      await getFilesFromDataTransferItems(e.dataTransfer.items),
    );
  });

  // 防止拖拽文件被浏览器处理
  ref.addEventListener('dragover', (e) => e.preventDefault());

  ref.addEventListener('dragenter', (e) => {
    e.preventDefault();
    setDragging(true);
  });
  ref.addEventListener('dragleave', (e) => {
    if ((e.target as HTMLElement).className !== classes.root) return;
    setDragging(false);
  });
};
