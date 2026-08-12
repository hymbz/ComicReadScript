import { toast } from 'components/Toast';
import { ensureGmValue, lang, versionLt } from 'helper';
import { For } from 'solid-js';

import { migration } from './migration';

/** 分组顺序与标题，需与 scripts/lib/changelog.ts 的 changeTypes 保持一致 */
const changeTypes = ['feat', 'fix', 'perf'] as const;
type ChangeType = (typeof changeTypes)[number];
const changeSectionTitle: Record<ChangeType, string> = {
  feat: '新增',
  fix: '修复',
  perf: '优化',
};

/** 处理版本更新相关 */
export const handleVersionUpdate = async () => {
  const version = await ensureGmValue('@Version', GM.info.script.version);
  if (version === GM.info.script.version) return;

  await migration(version); // 每次版本更新都执行一遍迁移

  // 只在语言为中文时弹窗提示最新更新内容
  if (lang() === 'zh') {
    toast(
      () => {
        // 找出比上次记录版本更新的所有版本
        const changes = Object.entries(__LATEST_CHANGES__)
          .filter(([changeVersion]) => versionLt(version, changeVersion))
          .map(([, change]) => change);
        return (
          /* oxlint-disable i18next/no-literal-string */
          <>
            <h2>🥳 ComicRead 已更新到 v{GM.info.script.version}</h2>
            <For each={changeTypes}>
              {(type) => {
                const items = changes.flatMap((change) => change[type] ?? []);
                if (items.length === 0) return null;
                return (
                  <section>
                    <h3>{changeSectionTitle[type]}</h3>
                    <ul>
                      <For each={items}>{(item) => <li>{item}</li>}</For>
                    </ul>
                  </section>
                );
              }}
            </For>
          </>
          /* eslint-enable i18next/no-literal-string */
        );
      },
      {
        id: 'Version Tip',
        type: 'custom',
        duration: Number.POSITIVE_INFINITY,
        // 手动点击关掉通知后才不会再次弹出
        onDismiss: () => GM.setValue('@Version', GM.info.script.version),
      },
    );

    // 监听储存的版本数据的变动，如果和当前版本一致就关掉弹窗
    // 防止在更新版本后一次性打开多个页面，不得不一个一个关过去
    const listenerId = await GM.addValueChangeListener(
      '@Version',
      async (_, __, newVersion) => {
        if (newVersion !== GM.info.script.version) return;
        toast.dismiss('Version Tip');
        await GM.removeValueChangeListener(listenerId);
      },
    );
  } else await GM.setValue('@Version', GM.info.script.version);
};
