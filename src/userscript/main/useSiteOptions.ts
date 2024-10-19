import { createMutable } from 'solid-js/store';
import type { MangaProps } from 'components/Manga';
import { assign, difference } from 'helper';

export interface SiteOptions {
  option: MangaProps['option'];
  defaultOption: MangaProps['defaultOption'];

  /** 自动进入阅读模式 */
  autoShow: boolean;
  /** 锁定站点配置 */
  lockOption: boolean;
  /** 隐藏 FAB */
  hiddenFAB: boolean;
}

/** 清理多余的配置项 */
const clear = <T extends Record<string, any> = {}>(
  options: T,
  defaultOptions: T,
) => {
  let isClear = false;
  for (const key of Object.keys(options)) {
    if (Reflect.has(defaultOptions, key)) continue;
    Reflect.deleteProperty(options, key);
    isClear = true;
  }
  return isClear;
};

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
    option: undefined,
    defaultOption: undefined,
    autoShow: true,
    lockOption: false,
    hiddenFAB: false,
    ...defaultOptions,
  } as SaveOptions;

  const saveOptions = await GM.getValue<SaveOptions>(name);

  const options = createMutable<SaveOptions>(
    assign(_defaultOptions, saveOptions),
  );

  const setOptions = async (newOptions?: Partial<SaveOptions>) => {
    const lockOption = options.lockOption;
    if (newOptions) Object.assign(options, newOptions);
    if (lockOption && newOptions?.lockOption !== false) return;
    // 只保存和默认设置不同的部分
    return GM.setValue(name, difference(options, _defaultOptions));
  };

  const isStored = saveOptions !== undefined;
  // 如果当前站点没有存储配置，就补充上去
  if (!isStored) await GM.setValue(name, {});
  // 否则检查是否有多余的配置
  else if (clear(options, _defaultOptions)) await setOptions();

  return {
    /** 站点配置 */
    options,
    /** 修改站点配置 */
    setOptions,
    /** 是否存过配置 */
    isStored,
  };
};
