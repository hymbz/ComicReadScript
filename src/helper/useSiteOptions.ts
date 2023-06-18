import { createMutable } from 'solid-js/store';
import type { MangaProps } from '../components/Manga';

export interface DefaultOptions {
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
  type Options = T & DefaultOptions;

  const rawValue = await GM.getValue<Options>(name);
  const options = createMutable<Options>({
    option: undefined,
    autoShow: true,
    hiddenFAB: false,
    ...defaultOptions,
    ...rawValue,
  });

  const changeCallbackList: ((options: Options) => void | Promise<void>)[] = [];

  return {
    options,

    /** 该站点是否有储存配置 */
    isRecorded: rawValue !== undefined,

    /**
     * 设置新 Option
     * @param newValue newValue
     * @param trigger 是否触发变更事件
     */
    setOptions: async (newValue: Options, trigger = true) => {
      Object.assign(options, newValue);
      if (trigger)
        await Promise.all(
          changeCallbackList.map((callback) => callback(options)),
        );
      return GM.setValue(name, options);
    },

    /**
     * 监听配置变更事件
     */
    onOptionChange: (callback: (options: Options) => void | Promise<void>) => {
      changeCallbackList.push(callback);
    },
  };
};
