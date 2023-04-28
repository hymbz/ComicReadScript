import MdFileDownload from '@material-design-icons/svg/round/file_download.svg';
import MdClose from '@material-design-icons/svg/round/close.svg';

import { IconButton } from '@crs/ui-component/dist/IconButton';
import { buttonListDivider } from '@crs/ui-component/dist/Manga';

import { createSignal } from 'solid-js';
import fflate from 'fflate';
import toast from 'solid-toast';
import type { SelfMangaProps } from '../components/Manga';
// eslint-disable-next-line import/no-cycle
import { request, saveAs } from './utils';

/** 为工具栏加上下载和退出按钮 */
export const setToolbarButton = (draftProps: SelfMangaProps) => {
  /** 下载按钮 */
  const DownloadButton = () => {
    const [tip, setTip] = createSignal('下载');
    const handleDownload = async () => {
      const { imgList } = draftProps;

      const fileData: fflate.Zippable = {};
      const imgIndexNum = `${imgList.length}`.length;

      for (let i = 0; i < imgList.length; i += 1) {
        setTip(`下载中 - ${i}/${imgList.length}`);
        const index = `${`${i}`.padStart(imgIndexNum, '0')}`;
        const fileExt = imgList[i].split('.').at(-1)!;
        const fileName = `${index}.${fileExt}`;
        try {
          // eslint-disable-next-line no-await-in-loop
          const res = await request<ArrayBuffer>(imgList[i], {
            responseType: 'arraybuffer',
          });
          fileData[fileName] = new Uint8Array(res.response);
        } catch (error) {
          toast.error(`${fileName} 下载失败`);
          fileData[`${index} - 下载失败.${fileExt}`] = new Uint8Array();
        }
      }

      setTip('开始打包');
      const zipped = fflate.zipSync(fileData, {
        level: 0,
        comment: window.location.href,
      });
      saveAs(new Blob([zipped]), `${document.title}.zip`);
      setTip('下载完成');
    };

    return (
      <IconButton tip={tip()} onClick={handleDownload}>
        <MdFileDownload />
      </IconButton>
    );
  };

  const handleEnd = () => draftProps.onExit?.();

  draftProps.editButtonList = (list) => {
    // 在设置按钮上方放置下载按钮
    list.splice(-1, 0, DownloadButton);
    return [
      ...list,
      // 再在最下面添加分隔栏和退出按钮
      buttonListDivider,
      () => (
        <IconButton tip="退出" onClick={handleEnd}>
          <MdClose />
        </IconButton>
      ),
    ];
  };

  return draftProps;
};
