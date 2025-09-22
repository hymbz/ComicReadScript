import type { Component } from 'solid-js';

import MdAutoSync from '@material-design-icons/svg/round/sync.svg';

import {
  Manga,
  store as mangaStore,
  refs,
  SettingsItemButton,
} from 'components/Manga';
import { toast } from 'components/Toast';
import {
  createEffectOn,
  createRootMemo,
  difference,
  mountComponents,
  querySelector,
  t,
  useStyle,
  WakeLock,
} from 'helper';

import type { MainContext } from '.';

import { migrationOption } from './migration';

let dom: HTMLDivElement;

/**
 * 显示漫画阅读窗口
 */
export const useManga = <T extends Record<string, any>>({
  store,
  setState,
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

      writing-mode: initial;
      font-size: 16px;

      opacity: 0;

      transition:
        opacity 300ms,
        transform 0s 300ms;
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

  setState('manga', {
    show: false,
    option: options.option,
    defaultOption: options.defaultOption,
    onOptionChange: (option) => setOptions({ option }),

    hotkeys: store.hotkeys,
    onHotkeysChange(newValue: Record<string, string[]>) {
      GM.setValue('@Hotkeys', newValue);
      setState('hotkeys', newValue);
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

  setState('manga', {
    onExit: () => setState('manga', 'show', false),
    editSettingList(list) {
      const SyncOptions: Component = () => {
        const sync = async () => {
          const currentReadOption = difference(
            mangaStore.option,
            mangaStore.defaultOption,
          );
          for (const key of await GM.listValues()) {
            if (key.startsWith('@')) continue;
            await migrationOption(key, (option) => {
              option.option = currentReadOption;
            });
          }
          toast.success(t('setting.sync_options_other_site'));
        };

        return (
          <SettingsItemButton
            name={t('setting.sync_options_other_site')}
            onClick={sync}
            children={<MdAutoSync />}
          />
        );
      };

      // 在其他设置里增加同步配置的按钮
      const otherSetting = list.find(([title]) => title === t('other.other'));
      if (otherSetting) {
        const [, FC] = otherSetting;
        otherSetting[1] = () => (
          <>
            <FC />
            <SyncOptions />
          </>
        );
      }
      return list;
    },
  });
};
