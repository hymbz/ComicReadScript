import MdFileDownload from '@material-design-icons/svg/round/file_download.svg';
import MdClose from '@material-design-icons/svg/round/close.svg';

import fflate from 'fflate';
import { createMemo, createSignal } from 'solid-js';
import { createStore, produce } from 'solid-js/store';

import { t } from 'helper/i18n';
import { IconButton, IconButtonStyle } from '../IconButton';
import type { MangaProps } from '../Manga';
import { buttonListDivider, MangaStyle, Manga } from '../Manga';
import { request } from '../../helper/request';
import { saveAs } from '../../helper';
import { mountComponents } from './helper';
import { toast } from './Toast';

let dom: HTMLDivElement;

/**
 * 显示漫画阅读窗口
 */
export const useManga = async (initProps?: Partial<MangaProps>) => {
  await GM.addStyle(`
    @supports (height: 100dvh) {
      #comicRead {
        height: 100dvh;
      }
    }

    #comicRead {
      position: fixed;
      top: 0;
      left: 0;
      transform: scale(0);

      width: 100vw;
      height: 100vh;

      font-size: 16px;

      opacity: 0;

      transition: opacity 300ms, transform 0s 300ms;
    }

    #comicRead[show] {
      transform: scale(1);
      opacity: 1;
      transition: opacity 300ms, transform 100ms;
    }
  `);

  const [props, setProps] = createStore({
    imgList: [],
    show: false,
    ...initProps,
  } as MangaProps);

  const set = (
    recipe: ((draftProps: MangaProps) => void) | Partial<MangaProps>,
  ) => {
    if (!dom) {
      dom = mountComponents('comicRead', () => (
        <>
          <Manga {...props} />
          <style type="text/css">{IconButtonStyle}</style>
          <style type="text/css">{MangaStyle}</style>
        </>
      ));
      dom.style.setProperty('z-index', '2147483647', 'important');
    }

    setProps(typeof recipe === 'function' ? produce(recipe) : recipe);

    if (props.imgList.length && props.show) {
      dom.setAttribute('show', '');
      document.documentElement.style.overflow = 'hidden';
    } else {
      dom.removeAttribute('show');
      document.documentElement.style.overflow = 'unset';
    }
  };

  /** 下载按钮 */
  const DownloadButton = () => {
    const [statu, setStatu] = createSignal('button.download');

    const handleDownload = async () => {
      const fileData: fflate.Zippable = {};
      const imgIndexNum = `${props.imgList.length}`.length;

      for (let i = 0; i < props.imgList.length; i += 1) {
        setStatu(`${i}/${props.imgList.length}`);
        const index = `${i}`.padStart(imgIndexNum, '0');
        const fileExt = props.imgList[i].match(/.+\/.+\.(\w+)/)?.[1] ?? 'jpg';
        const fileName = `${index}.${fileExt}`;
        try {
          const res = await request<ArrayBuffer>(props.imgList[i], {
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
    onExit: () => set({ show: false }),
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

  return [set, props, setProps] as const;
};
