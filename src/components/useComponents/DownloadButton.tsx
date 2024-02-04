import MdFileDownload from '@material-design-icons/svg/round/file_download.svg';

import { zipSync, type Zippable } from 'fflate';
import { createMemo, createSignal } from 'solid-js';
import { saveAs } from 'helper';
import { request } from 'helper/request';
import { t } from 'helper/i18n';
import { store } from '../Manga';
import { IconButton } from '../IconButton';
import { toast } from './Toast';

/** 下载按钮 */
export const DownloadButton = () => {
  const [statu, setStatu] = createSignal('button.download');

  const getFileExt = (url: string) => url.split('.').pop();

  const handleDownload = async () => {
    const fileData: Zippable = {};

    const downImgList = store.imgList.map((img) =>
      img.translationType === 'show'
        ? `${img.translationUrl!}#.${getFileExt(img.src)}`
        : img.src,
    );
    const imgIndexNum = `${downImgList.length}`.length;

    for (let i = 0; i < downImgList.length; i += 1) {
      setStatu(`${i}/${downImgList.length}`);
      const index = `${i}`.padStart(imgIndexNum, '0');

      let data: ArrayBuffer;
      let fileName: string;

      const url = downImgList[i];
      if (url.startsWith('blob:')) {
        const res = await fetch(url);
        const blob = await res.blob();
        data = await blob.arrayBuffer();
        const fileExt = blob.type.split('/')[1];
        fileName = `${index}.${fileExt}`;
      } else {
        const fileExt = getFileExt(url) ?? 'jpg';
        fileName = `${index}.${fileExt}`;
        try {
          const res = await request<ArrayBufferLike>(url, {
            responseType: 'arraybuffer',
            errorText: `${t('alert.download_failed')}: ${fileName}`,
          });
          data = res.response;
        } catch (error) {
          fileName = `${index} - ${t('alert.download_failed')}.${fileExt}`;
        }
      }

      fileData[fileName] = new Uint8Array(data!);
    }

    setStatu('button.packaging');
    const zipped = zipSync(fileData, {
      level: 0,
      comment: window.location.href,
    });
    saveAs(new Blob([zipped]), `${document.title}.zip`);
    setStatu('button.download_completed');
    toast.success(t('button.download_completed'));
  };

  const tip = createMemo(
    () => t(statu()) || `${t('button.downloading')} - ${statu()}`,
  );

  return (
    <IconButton tip={tip()} onClick={handleDownload}>
      <MdFileDownload />
    </IconButton>
  );
};
