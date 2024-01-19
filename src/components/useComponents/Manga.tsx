import MdFileDownload from '@material-design-icons/svg/round/file_download.svg';
import MdClose from '@material-design-icons/svg/round/close.svg';

import fflate from 'fflate';
import { createMemo, createSignal } from 'solid-js';

import { t } from 'helper/i18n';
import { createStore } from 'solid-js/store';
import { createEffectOn } from 'helper/solidJs';
import { IconButton, IconButtonStyle } from '../IconButton';
import type { MangaProps } from '../Manga';
import { buttonListDivider, MangaStyle, Manga, store } from '../Manga';
import { request } from '../../helper/request';
import { saveAs } from '../../helper';
import { mountComponents } from './helper';
import { toast } from './Toast';

export { store };
export { showPageList } from '../Manga/actions';

let dom: HTMLDivElement;

type UseMangaProps = MangaProps & { adList?: Set<number> };

/**
 * 显示漫画阅读窗口
 */
export const useManga = async (initProps?: Partial<UseMangaProps>) => {
  await GM.addStyle(`
    #comicRead {
      position: fixed;
      top: 0;
      left: 0;
      transform: scale(0);

      width: 100%;
      height: 100%;

      font-size: 16px;

      opacity: 0;

      transition: opacity 300ms, transform 0s 300ms;
    }

    #comicRead[show] {
      transform: scale(1);
      opacity: 1;
      transition: opacity 300ms, transform 100ms;
    }

    /* 防止其他扩展的元素显示到漫画上来 */
    #comicRead[show] ~ :not(#fab, #toast) {
      display: none !important;
      pointer-events: none !important;
      visibility: hidden !important;
      opacity: 0 !important;
      z-index: 1 !important;
    }
  `);

  const [props, setProps] = createStore<UseMangaProps>({
    imgList: [],
    show: false,
    ...initProps,
  });

  const imgList = createMemo(() =>
    props.adList
      ? props.imgList.filter((_, i) => !props.adList!.has(i))
      : props.imgList,
  );

  createEffectOn([() => imgList().length, () => props.show], () => {
    if (!dom) {
      dom = mountComponents('comicRead', () => (
        <>
          <Manga {...props} imgList={imgList()} />
          <style type="text/css">{IconButtonStyle}</style>
          <style type="text/css">{MangaStyle}</style>
        </>
      ));
      dom.style.setProperty('z-index', '2147483647', 'important');
    }

    if (imgList().length && props.show) {
      dom.setAttribute('show', '');
      document.documentElement.style.overflow = 'hidden';
    } else {
      dom.removeAttribute('show');
      document.documentElement.style.overflow = 'unset';
    }
  });

  /** 下载按钮 */
  const DownloadButton = () => {
    const [statu, setStatu] = createSignal('button.download');

    const getFileExt = (url: string) => url.split('.').pop();

    const handleDownload = async () => {
      const fileData: fflate.Zippable = {};

      const downImgList = store.imgList.map((img) =>
        img.translationType === 'show'
          ? `${img.translationUrl!}#.${getFileExt(img.src)}`
          : img.src,
      );
      const imgIndexNum = `${downImgList.length}`.length;

      for (let i = 0; i < downImgList.length; i += 1) {
        setStatu(`${i}/${downImgList.length}`);
        const index = `${i}`.padStart(imgIndexNum, '0');
        const fileExt = getFileExt(downImgList[i]) ?? 'jpg';
        const fileName = `${index}.${fileExt}`;
        try {
          const res = await request<ArrayBuffer>(downImgList[i], {
            responseType: 'arraybuffer',
          });
          fileData[fileName] = new Uint8Array(res.response);
        } catch (error) {
          toast.error(`${fileName} ${t('alert.download_failed')}`);
          fileData[`${index} - ${t('alert.download_failed')}.${fileExt}`] =
            new Uint8Array();
        }
      }

      setStatu('button.packaging');
      const zipped = fflate.zipSync(fileData, {
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

  setProps({
    onExit: () => setProps('show', false),
    editButtonList: (list) => {
      // 在设置按钮上方放置下载按钮
      list.splice(-1, 0, DownloadButton);
      return [
        ...list,
        // 再在最下面添加分隔栏和退出按钮
        buttonListDivider,
        () => (
          <IconButton tip={t('button.exit')} onClick={() => props.onExit?.()}>
            <MdClose />
          </IconButton>
        ),
      ];
    },
  });

  return [setProps, props] as const;
};
