import { byPath, log } from 'helper';

/** 判断版本号1是否小于版本号2 */
export const versionLt = (version1: string, version2: string) => {
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
const renameOption = async (name: string, list: string[]) =>
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
export const migration = async (version: string) => {
  // 任何样式修改都得更新 css 才行，干脆直接删了
  GM.deleteValue('ehTagColorizeCss');
  GM.deleteValue('ehTagSortCss');

  const values = await GM.listValues();

  // 6 => 7
  if (versionLt(version, '7'))
    for (const key of values) {
      switch (key) {
        case 'Version':
        case 'Languages':
          continue;

        case 'HotKeys': {
          await renameOption(key, [
            '向上翻页 => turn_page_up',
            '向下翻页 => turn_page_down',
            '向右翻页 => turn_page_right',
            '向左翻页 => turn_page_left',
            '跳至首页 => jump_to_home',
            '跳至尾页 => jump_to_end',
            '退出 => exit',
            '切换页面填充 => switch_page_fill',
            '切换卷轴模式 => switch_scroll_mode',
            '切换单双页模式 => switch_single_double_page_mode',
            '切换阅读方向 => switch_dir',
            '进入阅读模式 => enter_read_mode',
          ]);
          break;
        }

        default:
          await renameOption(key, [
            'option.scrollbar.showProgress => showImgStatus',
            'option.clickPage => clickPageTurn',
            'option.clickPage.overturn => reverse',
            'option.swapTurnPage => swapPageTurnKey',
            'option.flipToNext => jumpToNext',
            // ehentai
            '匹配nhentai => associate_nhentai',
            '快捷键翻页 => hotkeys_page_turn',
            // nhentai
            '自动翻页 => auto_page_turn',
            '彻底屏蔽漫画 => block_totally',
            '在新页面中打开链接 => open_link_new_page',
            // other
            '记住当前站点 => remember_current_site',
          ]);
      }
    }

  // 8 => 9
  if (versionLt(version, '9'))
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
  if (versionLt(version, '9.4'))
    await migrationOption('ehentai', (option, save) => {
      if (!Reflect.has(option, 'hotkeys_page_turn')) return;
      option.hotkeys = option.hotkeys_page_turn;
      Reflect.deleteProperty(option, 'hotkeys_page_turn');
      return save();
    });

  // 11.4.2 => 11.5
  if (versionLt(version, '11.5'))
    await migrationOption('Hotkeys', (option, save) => {
      for (const [name, hotkeys] of Object.entries(option)) {
        option[name] = hotkeys.map((key: string) =>
          key.replaceAll(/\b[A-Z]\b/g, (match) => match.toLowerCase()),
        );
      }
      return save();
    });

  if (versionLt(version, '11.9.1'))
    for (const key of values) {
      switch (key) {
        case 'Version':
        case 'Languages':
        case 'HotKeys':
          continue;

        default:
          await renameOption(key, ['option.translation => ']);
      }
    }
};
