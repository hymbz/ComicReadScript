import MdFileDownload from '@material-design-icons/svg/round/file_download.svg';
import MdClose from '@material-design-icons/svg/round/close.svg';

import fflate from 'fflate';
import { createSignal } from 'solid-js';
import { createStore, produce } from 'solid-js/store';

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
    #comicRead {
      position: fixed;
      z-index: 999999999;
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
    const [tip, setTip] = createSignal('下载');
    const handleDownload = async () => {
      // eslint-disable-next-line solid/reactivity
      const { imgList } = props;

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
      toast.success('下载完成');
    };

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
          <IconButton tip="退出" onClick={() => props.onExit?.()}>
            <MdClose />
          </IconButton>
        ),
      ];
    },
  });

  return [set, props] as [typeof set, MangaProps];
};
