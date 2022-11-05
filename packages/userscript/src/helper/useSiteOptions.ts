import type { MangaProps } from '@crs/ui-component/dist/Manga';

interface defaultOptions {
  option: Partial<MangaProps['option']> | undefined;
  autoLoad: boolean;
}

/**
 * 对修改站点配置的相关方法的封装
 *
 * @param name 站点名
 * @param defaultOptions 默认配置
 */
export const useSiteOptions = async <T extends Record<string, any>>(
  name: string,
  defaultOptions = {} as T,
) => {
  type Options = T & defaultOptions;

  const rawValue = await GM.getValue<Options | undefined>(name);
  const options = Object.assign(
    {
      option: undefined,
      autoLoad: true,
      ...defaultOptions,
    } as Options,
    rawValue,
  );

  const changeCallbackList: ((options: Options) => void | Promise<void>)[] = [];

  return {
    options,

    /** 该站点是否有储存配置 */
    isRecorded: rawValue !== undefined,

    /**
     * 设置新 Option
     *
     * @param newValue
     * @param trigger 是否触发变更事件
     */
    setOptions: async (newValue: Options, trigger = true) => {
      Object.assign(options, newValue);
      await GM.setValue(name, options);
      if (trigger)
        await Promise.all(
          changeCallbackList.map((callback) => callback(options)),
        );
    },

    /**
     * 监听配置变更事件
     *
     * @param callback 回调
     */
    onOptionChange: (callback: (options: Options) => void | Promise<void>) => {
      changeCallbackList.push(callback);
    },
  };
};
