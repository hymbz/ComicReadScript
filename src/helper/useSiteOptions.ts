import { createMutable } from 'solid-js/store';
import { createMemo, createRoot, createSignal } from 'solid-js';

import type { MangaProps } from '../components/Manga';

import { assign, difference } from '.';

export interface SiteOptions {
  option: MangaProps['option'];
  defaultOption: MangaProps['defaultOption'];

  /** 自动进入阅读模式 */
  autoShow: boolean;
  /** 隐藏 FAB */
  hiddenFAB: boolean;
}

const getHotkeys = async (): Promise<Record<string, string[]>> => ({
  enter_read_mode: ['v'],
  ...(await GM.getValue<Record<string, string[]>>('Hotkeys', {})),
});

/**
 * 对修改站点配置的相关方法的封装
 * @param name 站点名
 * @param defaultOptions 默认配置
 */
export const useSiteOptions = async <T = Record<string, any>>(
  name: string,
  defaultOptions: T = {} as T,
) => {
  type SaveOptions = T & SiteOptions;

  const _defaultOptions = {
    autoShow: true,
    hiddenFAB: false,
    ...defaultOptions,
  } as SaveOptions;

  const saveOptions = await GM.getValue<SaveOptions>(name);

  const options = createMutable<SaveOptions>(
    assign(_defaultOptions, saveOptions),
  );

  const setOptions = async (newValue: Partial<SaveOptions>) => {
    Object.assign(options, newValue);
    // 只保存和默认设置不同的部分
    return GM.setValue(name, difference(options, _defaultOptions));
  };

  const [hotkeys, setHotkeys] = createSignal(await getHotkeys());

  const isStored = saveOptions !== undefined;
  // 如果当前站点没有存储配置，就补充上去
  if (!isStored) await GM.setValue(name, {});

  return {
    /** 站点配置 */
    options,
    /** 修改站点配置 */
    setOptions,
    /** 是否存过配置 */
    isStored,

    /** 快捷键配置 */
    hotkeys,
    /** 处理快捷键配置的变动 */
    onHotkeysChange(newValue: Record<string, string[]>) {
      GM.setValue('Hotkeys', newValue);
      setHotkeys(newValue);
    },
    /** 进入阅读模式的快捷键 */
    readModeHotkeys: createRoot(() => {
      const readModeHotkeysMemo = createMemo(
        () => new Set(Object.assign([], hotkeys().enter_read_mode)),
      );
      return readModeHotkeysMemo;
    }),
  };
};
