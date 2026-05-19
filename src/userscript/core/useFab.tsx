import MdChecklist from '@material-design-icons/svg/round/checklist.svg';
import MdClearAll from '@material-design-icons/svg/round/clear_all.svg';
import MdClose from '@material-design-icons/svg/round/close.svg';
import MdCloudDownload from '@material-design-icons/svg/round/cloud_download.svg';
import MdImageSearch from '@material-design-icons/svg/round/image_search.svg';
import MdImportContacts from '@material-design-icons/svg/round/import_contacts.svg';
import MdMenuBook from '@material-design-icons/svg/round/menu_book.svg';
import { Fab } from 'components/Fab';
import { type ComicImgData, imgList } from 'components/Manga';
import {
  type UseDrag,
  createEffectOn,
  createRootMemo,
  isNumber,
  mountComponents,
  t,
  useDrag,
  useStyle,
  useStyleMemo,
} from 'helper';
import { type Accessor, createEffect } from 'solid-js';

import { type CoreContext } from './types';
import { useSpeedDial } from './useSpeedDial';

export const useFab = <T extends Record<string, any>>(
  coreCtx: CoreContext<T>,
  nowImgList: Accessor<(string | ComicImgData)[] | undefined>,
) => {
  const { store, setState, options, setOptions, showComic } = coreCtx;

  useStyle(`
    #fab {
      --text-bg: transparent;

      position: fixed;
      right: calc(3vw - var(--left, 0px));
      bottom: calc(6vh - var(--top, 0px));

      font-size: clamp(12px, 1.5vw, 16px);
    }
  `);

  useStyleMemo('#fab', {
    '--left': () => `${options.fabPosition.left}px`,
    '--top': () => `${options.fabPosition.top}px`,
  });

  /** 当前已取得 url 的图片数量 */
  const doneImgNum = createRootMemo(
    () => nowImgList()?.filter(Boolean)?.length,
  );

  /** 已加载完毕的图片数量 */
  const loadedImgNum = createRootMemo(() => {
    let i = 0;
    for (const img of imgList()) if (img.loadType === 'loaded') i += 1;
    return i;
  });

  createEffectOn(
    [
      doneImgNum,
      loadedImgNum,
      () => nowImgList()?.length,
      coreCtx.canLoadComic,
      coreCtx.canMultiSelect,
      () => coreCtx.multiSelect?.isEnabled?.(),
      () => coreCtx.multiSelect?.selectedIds?.().length,
      () => options.hiddenFab,
    ],
    ([
      doneNum,
      loadNum,
      totalNum,
      canLoadComic,
      canMultiSelect,
      enabled,
      selectedCount,
      hiddenFab,
    ]) =>
      setState((state) => {
        // 多选相关状态：已激活时显示选中数量，未激活但可多选时显示多选按钮图标
        if (enabled || (canMultiSelect && !canLoadComic)) {
          const ms = coreCtx.multiSelect!;
          const isActive = enabled && isNumber(selectedCount);
          state.fab.show = isActive ? true : undefined;
          state.fab.children = isActive ? (
            <div style={{ 'text-align': 'center', 'line-height': '1.2' }}>
              <span style={{ opacity: 0.6, 'font-size': '0.75em' }}>
                {t('other.selected')}
              </span>
              <br />
              {selectedCount}
            </div>
          ) : (
            <MdChecklist />
          );
          state.fab.tip = t('hotkeys.multi_select_load');
          state.fab.onClick = ms.load;
          state.fab.overrideSpeedDial = [
            { name: t('other.exit'), onClick: ms.unmount, icon: <MdClose /> },
            { name: t('other.clear'), onClick: ms.clear, icon: <MdClearAll /> },
          ];
          return;
        }

        state.fab.progress = undefined;

        // 非多选模式时重置相关状态
        if (hiddenFab) state.fab.show = false;
        else
          state.fab.show = canLoadComic || canMultiSelect ? undefined : false;
        state.fab.onClick = showComic;
        state.fab.overrideSpeedDial = undefined;

        if (totalNum === undefined || doneNum === undefined) {
          state.fab.children = <MdImportContacts />;
          return;
        }

        if (totalNum === 0) {
          state.fab.children = <MdImageSearch />;
          state.fab.progress = 0;
          state.fab.tip = `${t('other.loading_img')} - ${doneNum}/${totalNum}`;
          return;
        }

        if (doneNum < totalNum) {
          state.fab.children = <MdImageSearch />;
          state.fab.progress = doneNum / totalNum;
          state.fab.tip = `${t('other.loading_img')} - ${doneNum}/${totalNum}`;
          return;
        }

        if (loadNum < totalNum) {
          state.fab.children = <MdCloudDownload />;
          state.fab.progress = 1 + loadNum / totalNum;
          state.fab.tip = `${t('other.img_loading')} - ${loadNum}/${totalNum}`;
          return;
        }

        state.fab.children = <MdMenuBook />;
        state.fab.progress = 1 + loadNum / totalNum;
        state.fab.tip = t('other.read_mode');
      }),
  );

  const handleMount = (ref: HTMLElement) => {
    const handleDrag: UseDrag = ({ xy: [x, y], last: [lx, ly] }) => {
      const left = options.fabPosition.left + x - lx;
      const top = options.fabPosition.top + y - ly;
      setOptions({ fabPosition: { left, top } });
    };
    useDrag({ ref, handleDrag, setCapture: true });

    // 超出显示范围就恢复原位
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.length !== 1 || entries[0].isIntersecting) return;
        setOptions({ fabPosition: { left: 0, top: 0 } });
      },
      { threshold: 0.5 },
    );
    observer.observe(ref);
  };

  const dom = mountComponents('fab', () => {
    createEffect(() => {
      setState('fab', {
        placement:
          -options.fabPosition.left < window.innerWidth / 2 ? 'left' : 'right',
        speedDialPlacement:
          -options.fabPosition.top < window.innerHeight / 2 ? 'top' : 'bottom',
      });
    });

    return <Fab ref={handleMount} {...store.fab} />;
  });
  dom.style.setProperty('z-index', '2147483646', 'important');

  useSpeedDial(coreCtx);
};
