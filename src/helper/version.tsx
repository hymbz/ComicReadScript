import { toast } from '../components/useComponents/Toast';

import { lang } from './i18n';
import { log } from './logger';

import { byPath } from '.';

/** 重命名配置项 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const renameOption = async (name: string, list: string[]) => {
  try {
    const option = await GM.getValue<object>(name);
    if (!option) throw new Error(`GM.getValue Error: not found ${name}`);

    for (let i = list.length - 1; i; i--) {
      const [path, newName] = list[i].split(' => ');
      byPath(option, path, (parent, key) => {
        log('rename Option', list[i]);
        Reflect.set(parent, newName, parent[key]);
        Reflect.deleteProperty(parent, key);
      });
    }

    await GM.setValue(name, option);
  } catch (error) {
    log.error(`migration ${name} option error:`, error);
  }
};

/** 旧版本配置迁移 */
const migration = async () => {
  const values = await GM.listValues();

  // 8 => 9
  for (const key of values) {
    switch (key) {
      case 'Version':
      case 'Languages':
      case 'Hotkeys':
        continue;
    }

    const saveData = await GM.getValue<any>(key);
    if (typeof saveData?.option?.scrollMode === 'boolean') {
      saveData.option.scrollMode = {
        enabled: saveData.option.scrollMode,
        spacing: saveData.option.scrollModeSpacing,
        imgScale: saveData.option.scrollModeImgScale,
        fitToWidth: saveData.option.scrollModeFitToWidth,
      };
      await GM.setValue(key, saveData);
    }
  }
};

/** 处理版本更新相关 */
export const handleVersionUpdate = async () => {
  const version = await GM.getValue<string>('Version');
  if (!version) return GM.setValue('Version', GM.info.script.version);
  if (version === GM.info.script.version) return;

  if (version.split('.')[0] !== GM.info.script.version.split('.')[0])
    await migration();

  // 只在语言为中文时弹窗提示最新更新内容
  if (lang() === 'zh') {
    toast(
      () => (
        <>
          {/* eslint-disable-next-line i18next/no-literal-string */}
          <h2>🥳 ComicRead 已更新到 v{GM.info.script.version}</h2>
          inject@LatestChange
        </>
      ),
      {
        id: 'Version Tip',
        type: 'custom',
        duration: Number.POSITIVE_INFINITY,
        // 手动点击关掉通知后才不会再次弹出
        onDismiss: () => GM.setValue('Version', GM.info.script.version),
      },
    );

    // 监听储存的版本数据的变动，如果和当前版本一致就关掉弹窗
    // 防止在更新版本后一次性打开多个页面，不得不一个一个关过去
    const listenerId = await GM.addValueChangeListener(
      'Version',
      async (_, __, newVersion) => {
        if (newVersion !== GM.info.script.version) return;
        toast.dismiss('Version Tip');
        await GM.removeValueChangeListener(listenerId);
      },
    );
  } else await GM.setValue('Version', GM.info.script.version);
};
