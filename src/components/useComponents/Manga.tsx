import MdClose from '@material-design-icons/svg/round/close.svg';
import { t } from 'helper/i18n';
import { createStore } from 'solid-js/store';
import { createEffectOn, createRootMemo } from 'helper/solidJs';

import { IconButton, IconButtonStyle } from '../IconButton';
import {
  type MangaProps,
  buttonListDivider,
  MangaStyle,
  Manga,
} from '../Manga';

import { DownloadButton } from './DownloadButton';
import { mountComponents } from './helper';

export { store } from '../Manga';
export { showPageList } from '../Manga/actions';

let dom: HTMLDivElement;

type UseMangaProps = MangaProps & { adList?: Set<number> };

/**
 * 显示漫画阅读窗口
 */
export const useManga = async (initProps?: Partial<UseMangaProps>) => {
  GM_addStyle(`
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

  const imgList = createRootMemo(() =>
    props.adList
      ? props.imgList.filter((_, i) => !props.adList!.has(i))
      : props.imgList,
  );

  createEffectOn([() => imgList().length, () => props.show], () => {
    if (!dom) {
      dom = mountComponents(
        'comicRead',
        () => <Manga {...props} imgList={imgList()} />,
        [IconButtonStyle, MangaStyle],
      );
      dom.style.setProperty('z-index', '2147483647', 'important');
    }

    if (imgList().length > 0 && props.show) {
      dom.setAttribute('show', '');
      document.documentElement.style.overflow = 'hidden';
    } else {
      dom.removeAttribute('show');
      document.documentElement.style.overflow = 'unset';
    }
  });

  const ExitButton = () => (
    <IconButton tip={t('button.exit')} onClick={() => props.onExit?.()}>
      <MdClose />
    </IconButton>
  );

  setProps({
    onExit: () => setProps('show', false),
    editButtonList(list) {
      // 在设置按钮上方放置下载按钮
      list.splice(-1, 0, DownloadButton);
      return [
        ...list,
        // 再在最下面添加分隔栏和退出按钮
        buttonListDivider,
        ExitButton,
      ];
    },
  });

  return [setProps, props] as const;
};
