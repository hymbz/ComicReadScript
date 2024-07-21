import { toast } from '../components/useComponents/Toast';

import { lang } from './i18n';
import { log } from './logger';

import { byPath } from '.';

const migrationOption = async (
  name: string,
  editFn: (option: Record<any, any>, save: () => Promise<void>) => unknown,
) => {
  try {
    const option = await GM.getValue<object>(name);
    if (!option) throw new Error(`GM.getValue Error: not found ${name}`);
    await editFn(option, () => GM.setValue(name, option));
  } catch (error) {
    log.error(`migration ${name} option error:`, error);
  }
};

/** 重命名配置项 */
export const renameOption = async (name: string, list: string[]) =>
  migrationOption(name, (option, save) => {
    for (const itemText of list) {
      const [path, newName] = itemText.split(' => ');
      byPath(option, path, (parent, key) => {
        log('rename Option', itemText);
        if (newName) Reflect.set(parent, newName, parent[key]);
        Reflect.deleteProperty(parent, key);
      });
    }
    return save();
  });

/** 旧版本配置迁移 */
const migration = async () => {
  // 任何样式修改都得更新 css 才行，干脆直接删了
  GM.deleteValue('ehTagColorizeCss');

  const values = await GM.listValues();

  // 8 => 9
  for (const key of values) {
    switch (key) {
      case 'Version':
      case 'Languages':
        continue;

      case 'Hotkeys': {
        await renameOption(key, [
          // 原本上下快捷键是混在一起的，现在分开后要迁移太麻烦了，应该也没多少人改，就直接删了
          'turn_page_up => ',
          'turn_page_down => ',
          'turn_page_right => scroll_right',
          'turn_page_left => scroll_left',
        ]);
        break;
      }

      default:
        await migrationOption(key, (option, save) => {
          if (typeof option.option?.scrollMode !== 'boolean') return;
          option.option.scrollMode = {
            enabled: option.option.scrollMode,
            spacing: option.option.scrollModeSpacing,
            imgScale: option.option.scrollModeImgScale,
            fitToWidth: option.option.scrollModeFitToWidth,
          };
          return save();
        });
    }
  }

  // 9.3 => 9.4
  await migrationOption('ehentai', (option, save) => {
    if (!Reflect.has(option, 'hotkeys_page_turn')) return;
    option.hotkeys = option.hotkeys_page_turn;
    Reflect.deleteProperty(option, 'hotkeys_page_turn');
    return save();
  });
};

/** 处理版本更新相关 */
export const handleVersionUpdate = async () => {
  const version = await GM.getValue<string>('Version');
  if (!version) return GM.setValue('Version', GM.info.script.version);
  if (version === GM.info.script.version) return;

  // 每次版本更新都执行一遍迁移
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
