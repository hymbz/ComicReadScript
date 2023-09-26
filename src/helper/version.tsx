import { byPath } from '.';
import { lang } from './i18n';
import { log } from './logger';
import { toast } from '../components/useComponents/Toast';

/** 重命名配置项 */
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

  // 6 => 7
  for (let i = 0; i < values.length; i++) {
    const key = values[i];

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
        duration: Infinity,
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
