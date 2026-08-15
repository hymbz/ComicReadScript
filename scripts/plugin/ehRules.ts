import { type RolldownPluginOption } from 'rolldown';

import { codeEdit } from './codeEdit';

/** 调整 ehRules 结构，方便规则的编写和阅读理解 */
export const ehRules: RolldownPluginOption = codeEdit(
  'self-ehRules',
  (code, chunk) => {
    if (chunk.fileName !== 'ehTagRules.js') return;

    return code.replace(/(?<=const \S+ = )\{.+?\}(?=;)/su, (json) => {
      // oxlint-disable-next-line no-eval
      const data = eval(`(${json})`) as Record<
        string,
        Record<string, string[]>
      >;

      const newCombo: Record<string, string[]> = {};
      // 将 combo 的存储结构反过来
      for (const [mainTag, tags] of Object.entries(data.combo))
        for (const tag of tags) {
          newCombo[tag] ||= [];
          newCombo[tag].push(mainTag);
        }
      data.combo = newCombo;

      return JSON.stringify(data);
    });
  },
);
