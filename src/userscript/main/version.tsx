import { Show } from 'solid-js';
import { byPath, lang, log } from 'helper';
import { toast } from 'components/Toast';

/** 判断版本号1是否小于版本号2 */
const versionLt = (version1: string, version2: string) => {
  const v1 = version1.split('.').map(Number);
  const v2 = version2.split('.').map(Number);
  for (let i = 0; i < 3; i++) {
    const num1 = v1[i] ?? 0;
    const num2 = v2[i] ?? 0;
    if (num1 !== num2) return num1 < num2;
  }
  return false;
};

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
const migration = async (version: string) => {
  // 任何样式修改都得更新 css 才行，干脆直接删了
  GM.deleteValue('ehTagColorizeCss');
  GM.deleteValue('ehTagSortCss');

  // 11.4.2 => 11.5
  if (versionLt(version, '11.5.0'))
    await migrationOption('Hotkeys', (option, save) => {
      for (const [name, hotkeys] of Object.entries(option)) {
        option[name] = hotkeys.map((key: string) =>
          key.replaceAll(/\b[A-Z]\b/g, (match) => match.toLowerCase()),
        );
      }
      return save();
    });
};

/** 处理版本更新相关 */
export const handleVersionUpdate = async () => {
  const version = await GM.getValue<string>('Version');
  if (!version) return GM.setValue('Version', GM.info.script.version);
  if (version === GM.info.script.version) return;

  await migration(version); // 每次版本更新都执行一遍迁移

  // 只在语言为中文时弹窗提示最新更新内容
  if (lang() === 'zh') {
    toast(
      () => (
        /* eslint-disable i18next/no-literal-string */
        <>
          <h2>🥳 ComicRead 已更新到 v{GM.info.script.version}</h2>
          inject@LatestChange
          <Show when={versionLt(version, '10.8.0')}>
            <h3>改动</h3>
            <ul>
              <li>
                ehentai 悬浮标签列表的透明度调节
                <br />
                由「鼠标滚轮」改为「Shift + 鼠标滚轮」
              </li>
            </ul>
          </Show>
        </>
        /* eslint-enable i18next/no-literal-string */
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
