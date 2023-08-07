import { createMutable } from 'solid-js/store';
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

  const _defaultOptions: Options = {
    autoShow: true,
    hiddenFAB: false,
    ...defaultOptions,
    option: { ...defaultOption, ...defaultOptions?.option },
  };

  const rawValue = await GM.getValue<Options>(name);
  const options = createMutable<Options>({
    ..._defaultOptions,
    ...rawValue,
  });

  return {
    options,

    /** 该站点是否有储存配置 */
    isRecorded: rawValue !== undefined,

    setOptions: async (newValue: Options) => {
      Object.assign(options, newValue);

      // 只保存和默认设置不同的部分
      return GM.setValue(name, difference(options, _defaultOptions));
    },
  };
};
