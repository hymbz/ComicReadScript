import MdFileDownload from '@material-design-icons/svg/round/file_download.svg';
import MdClose from '@material-design-icons/svg/round/close.svg';

import { IconBotton } from '@crs/ui-component/dist/IconBotton';
import { buttonListDivider } from '@crs/ui-component/dist/Manga';

import { useState, useCallback } from 'react';
import { toast } from 'react-toastify';
import fflate from 'fflate';
import type { SelfMangaProps } from '../components';
import { download, saveAs } from '.';

/** 为工具栏加上下载和退出按钮 */
export const setToolbarButton = (draftProps: SelfMangaProps) => {
  /** 下载按钮 */
  const DownloadButton = () => {
    const [tip, setTip] = useState('下载');
    const handleDownload = useCallback(async () => {
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
          const data = await download<ArrayBuffer>(imgList[i], {
            headers: { Referer: window.location.href },
            responseType: 'arraybuffer',
          });
          fileData[fileName] = new Uint8Array(data);
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
    }, []);

    return (
      <IconBotton tip={tip} onClick={handleDownload}>
        <MdFileDownload />
      </IconBotton>
    );
  };

  const handleEnd = () => draftProps.onExit?.();

  draftProps.editButtonList = (list) => {
    // 在设置按钮上方放置下载按钮
    list.splice(-1, 0, ['下载', DownloadButton]);
    return [
      ...list,
      // 再在最下面添加分隔栏和退出按钮
      buttonListDivider,
      [
        '退出',
        () => (
          <IconBotton tip="退出" onClick={handleEnd}>
            <MdClose />
          </IconBotton>
        ),
      ],
    ];
  };

  return draftProps;
};
