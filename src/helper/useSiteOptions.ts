import { createMutable } from 'solid-js/store';
import { createMemo, createRoot, createSignal } from 'solid-js';
import type { MangaProps } from '../components/Manga';
import { difference } from '.';
import { defaultOption } from '../components/Manga/hooks/useStore/OptionState';

export interface SiteOptions {
  option: Partial<MangaProps['option']> | undefined;

  /** 自动进入阅读模式 */
  autoShow: boolean;
  /** 隐藏 FAB */
  hiddenFAB: boolean;
}

const getHotKeys = async (): Promise<Record<string, string[]>> => ({
  进入阅读模式: ['v'],
  ...(await GM.getValue<Record<string, string[]>>('HotKeys', {})),
});

/**
 * 对修改站点配置的相关方法的封装
 * @param name 站点名
 * @param defaultOptions 默认配置
 */
export const useSiteOptions = async <T extends Record<string, any>>(
  name: string,
  defaultOptions = {} as T,
) => {
  type Options = T & SiteOptions;

  const _defaultOptions = {
    autoShow: true,
    hiddenFAB: false,
    ...defaultOptions,
    option: { ...defaultOption, ...defaultOptions?.option },
  } as Options;

  const saveOptions = await GM.getValue<Options>(name);

  const options = createMutable<Options>({
    ..._defaultOptions,
    ...saveOptions,
  });

  const setOptions = async (newValue: Partial<Options>) => {
    Object.assign(options, newValue);

    // 只保存和默认设置不同的部分
    return GM.setValue(name, difference(options, _defaultOptions));
  };

  const [hotKeys, setHotKeys] = createSignal(await getHotKeys());

  // 如果当前站点没有存储配置，就补充上去
  if (saveOptions === undefined) GM.setValue(name, options);

  return {
    /** 站点配置 */
    options,
    /** 修改站点配置 */
    setOptions,

    /** 快捷键配置 */
    hotKeys,
    /** 处理快捷键配置的变动 */
    onHotKeysChange: (newValue: Record<string, string[]>) => {
      GM.setValue('HotKeys', newValue);
      setHotKeys(newValue);
    },
    /** 进入阅读模式的快捷键 */
    readModeHotKeys: createRoot(() => {
      const readModeHotKeysMemo = createMemo(
        () => new Set(Object.assign([], hotKeys()['进入阅读模式'])),
      );
      return readModeHotKeysMemo;
    }),
  };
};
