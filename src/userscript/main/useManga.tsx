import MdClose from '@material-design-icons/svg/round/close.svg';
import { IconButton } from 'components/IconButton';
import { Manga, refs, store as mangaStore } from 'components/Manga';
import {
  t,
  createEffectOn,
  createRootMemo,
  mountComponents,
  querySelector,
  WakeLock,
  useStyle,
} from 'helper';

import { DownloadButton } from '../../components/DownloadButton';

import type { MainContext } from '.';

let dom: HTMLDivElement;

/**
 * 显示漫画阅读窗口
 */
export const useManga = async <T extends Record<string, any>>({
  store,
  _setState,
  options,
  setOptions,
}: MainContext<T>) => {
  useStyle(`
    #comicRead {
      position: fixed;
      top: 0;
      left: 0;
      transform: scale(0);
      contain: strict;

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
    #comicRead[show] ~ :not(#fab, #toast, .comicread-ignore) {
      display: none !important;
      pointer-events: none !important;
      visibility: hidden !important;
      opacity: 0 !important;
      z-index: 1 !important;
    }
  `);

  _setState('manga', {
    show: false,
    option: options.option,
    defaultOption: options.defaultOption,
    onOptionChange: (option) => setOptions({ option }),

    hotkeys: store.hotkeys,
    onHotkeysChange(newValue: Record<string, string[]>) {
      GM.setValue('Hotkeys', newValue);
      _setState('hotkeys', newValue);
    },
  });

  dom = mountComponents('comicRead', () => <Manga {...store.manga} />);
  dom.style.setProperty('z-index', '2147483647', 'important');

  // 确保 toast 可以显示在漫画之上
  const toastDom = querySelector('#toast');
  if (toastDom) dom.after(toastDom);

  const htmlStyle = document.documentElement.style;
  let lastOverflow = htmlStyle.overflow;

  const wakeLock = new WakeLock();

  createEffectOn(
    createRootMemo(() => store.manga.show && store.manga.imgList.length > 0),
    (show) => {
      if (show) {
        dom.setAttribute('show', '');
        lastOverflow = htmlStyle.overflow;
        htmlStyle.setProperty('overflow', 'hidden', 'important');
        htmlStyle.setProperty('scrollbar-width', 'none', 'important');
        if (mangaStore.option.autoFullscreen) refs.root.requestFullscreen();
        wakeLock.on();
      } else {
        dom.removeAttribute('show');
        htmlStyle.overflow = lastOverflow;
        htmlStyle.removeProperty('scrollbar-width');
        wakeLock.off();
      }
    },
    { defer: true },
  );

  const ExitButton = () => (
    <IconButton
      tip={t('other.exit')}
      onClick={() => mangaStore.prop.onExit?.()}
    >
      <MdClose />
    </IconButton>
  );

  _setState('manga', {
    onExit: () => _setState('manga', 'show', false),
    editButtonList(list) {
      // 在设置按钮上方放置下载按钮
      list.splice(-1, 0, DownloadButton);
      return [
        ...list,
        // 再在最下面添加分隔栏和退出按钮
        () => <hr />,
        ExitButton,
      ];
    },
  });
};
