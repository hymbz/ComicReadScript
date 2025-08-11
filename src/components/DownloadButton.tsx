import type { Zippable } from 'fflate';

import MdFileDownload from '@material-design-icons/svg/round/file_download.svg';
import { zipSync } from 'fflate';
import { createMemo } from 'solid-js';

import { IconButton } from 'components/IconButton';
import { downloadImg, imgList, store } from 'components/Manga';
import { toast } from 'components/Toast';
import { createEffectOn, FaviconProgress, saveAs, t, useStore } from 'helper';

const getExtName = (mime: string) => /.+\/([^;]+)/.exec(mime)?.[1] ?? 'jpg';

/** 下载按钮 */
export const DownloadButton = () => {
  const { store: state, setState } = useStore({
    length: 0,
    /** undefined 表示未开始下载，等于 length 表示正在打包，-1 表示下载完成 */
    completedNum: undefined as undefined | number,
    errorNum: 0,
    rawTitle: document.title,
    showRawTitle: true,
  });

  const progress = new FaviconProgress();

  const handleDownload = async () => {
    const fileData: Zippable = {};
    setState({ errorNum: 0, length: imgList().length });
    if (state.showRawTitle) setState('rawTitle', document.title);

    const imgIndexNum = `${state.length}`.length;

    for (let i = 0; i < state.length; i += 1) {
      setState('completedNum', i);
      const img = imgList()[i];

      if (
        store.option.translation.onlyDownloadTranslated &&
        img.translationType !== 'show'
      )
        continue;

      const index = `${i}`.padStart(imgIndexNum, '0');
      const url =
        img.translationType === 'show' ? img.translationUrl! : img.src;

      let data: Blob | undefined;
      let fileName: string;
      try {
        data = await downloadImg(url);
        fileName = `${index}.${getExtName(data.type)}`;
      } catch {
        fileName = `${index} - ${t('alert.download_failed')}`;
        setState('errorNum', (num) => num + 1);
      }
      fileData[fileName] = new Uint8Array((await data?.arrayBuffer()) ?? []);
    }

    if (Object.keys(fileData).length === 0) {
      toast.warn(t('alert.no_img_download'));
      setState('completedNum', undefined);
      return;
    }

    setState('completedNum', state.length);
    const zipped = zipSync(fileData, {
      level: 0,
      comment: location.href,
    });
    saveAs(
      new Blob([zipped as BlobPart]),
      `${store.title || state.rawTitle}.zip`,
    );
    setState('completedNum', -1);
    toast(
      state.errorNum > 0
        ? t('button.download_completed_error', { errorNum: state.errorNum })
        : t('button.download_completed'),
      {
        type: state.errorNum > 0 ? 'warn' : 'success',
        onDismiss() {
          document.title = state.rawTitle;
          setState('showRawTitle', true);
          progress.recover();
        },
      },
    );
  };

  const tip = createMemo(() => {
    switch (state.completedNum) {
      case undefined:
        return t('other.download');
      case state.length:
        return t('button.packaging');
      case -1:
        return t('button.download_completed');
      default:
        return `${t('button.downloading')} - ${state.completedNum}/${state.length}`;
    }
  });

  // 根据下载进度更新网页标题
  createEffectOn(
    () => state.completedNum,
    (num) => {
      let showTip = '';
      switch (num) {
        case undefined:
          return;
        case state.length:
          showTip = '📦';
          break;
        case -1:
          showTip = state.errorNum > 0 ? `❗[${state.errorNum}]` : '✅';
          break;
        default:
          showTip = `${num}/${state.length}`;
      }
      document.title = `${showTip} - ${state.rawTitle}`;
      setState('showRawTitle', false);
    },
    { defer: true },
  );

  // 根据下载进度更新网页图标
  createEffectOn(
    () => state.completedNum,
    (num) => num && num > 0 && progress.update(num / state.length),
    { defer: true },
  );

  return (
    <IconButton
      tip={tip()}
      onClick={handleDownload}
      enabled={state.completedNum !== undefined}
    >
      <MdFileDownload />
    </IconButton>
  );
};
