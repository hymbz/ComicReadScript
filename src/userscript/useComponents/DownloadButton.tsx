import MdFileDownload from '@material-design-icons/svg/round/file_download.svg';
import { zipSync, type Zippable } from 'fflate';
import { createMemo, createSignal } from 'solid-js';
import { store } from 'components/Manga';
import { IconButton } from 'components/IconButton';
import { saveAs, t } from 'helper';

import { request } from '../main/request';

import { toast } from './Toast';

/** 下载按钮 */
export const DownloadButton = () => {
  const [statu, setStatu] = createSignal('button.download');

  const getFileExt = (url: string) => /[^?]+\.(\w+)/.exec(url)?.[1] ?? 'jpg';

  const handleDownload = async () => {
    const fileData: Zippable = {};

    const { imgList } = store;
    const imgIndexNum = `${imgList.length}`.length;

    for (let i = 0; i < imgList.length; i += 1) {
      setStatu(`${i}/${imgList.length}`);

      if (
        store.option.translation.onlyDownloadTranslated &&
        imgList[i].translationType !== 'show'
      )
        continue;

      let data: ArrayBuffer;
      let fileName: string;

      const img = imgList[i];
      const url =
        img.translationType === 'show'
          ? `${img.translationUrl!}#.${getFileExt(img.src)}`
          : img.src;

      const index = `${i}`.padStart(imgIndexNum, '0');

      if (url.startsWith('blob:')) {
        const res = await fetch(url);
        const blob = await res.blob();
        data = await blob.arrayBuffer();
        const fileExt = blob.type.split('/')[1];
        fileName = `${index}.${fileExt}`;
      } else {
        const fileExt = getFileExt(url);
        fileName = `${index}.${fileExt}`;
        try {
          const res = await request<ArrayBufferLike>(url, {
            responseType: 'arraybuffer',
            errorText: `${t('alert.download_failed')}: ${fileName}`,
          });
          data = res.response;
        } catch {
          fileName = `${index} - ${t('alert.download_failed')}.${fileExt}`;
        }
      }

      fileData[fileName] = new Uint8Array(data!);
    }

    if (Object.keys(fileData).length === 0) {
      toast.warn(t('alert.no_img_download'));
      setStatu('button.download');
      return;
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
