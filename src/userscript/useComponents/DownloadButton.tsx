import MdFileDownload from '@material-design-icons/svg/round/file_download.svg';
import { zipSync, type Zippable } from 'fflate';
import { createMemo, createSignal } from 'solid-js';
import { store } from 'components/Manga';
import { IconButton } from 'components/IconButton';
import { saveAs, t } from 'helper';

import { request } from '../main/request';

import { toast } from './Toast';

const Accept =
  'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8';

/** 下载按钮 */
export const DownloadButton = () => {
  const [statu, setStatu] = createSignal('button.download');

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

      const img = imgList[i];
      const url =
        img.translationType === 'show' ? img.translationUrl! : img.src;

      const index = `${i}`.padStart(imgIndexNum, '0');

      let data: Blob | undefined;
      let fileName: string;
      try {
        const res = await request<Blob>(url, {
          headers: { Accept },
          responseType: 'blob',
          errorText: `${t('alert.download_failed')}: ${index}`,
        });
        data = res.response;
        fileName = `${index}.${data.type.split('/')[1]}`;
      } catch {
        fileName = `${index} - ${t('alert.download_failed')}`;
      }
      fileData[fileName] = new Uint8Array((await data?.arrayBuffer()) ?? []);
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