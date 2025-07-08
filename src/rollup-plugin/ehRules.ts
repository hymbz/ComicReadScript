import type { OutputPluginOption } from 'rollup';

/** 调整 ehRules 结构以减少代码量 */
export const ehRules: OutputPluginOption = {
  name: 'self-ehRules',
  renderChunk(code, chunk) {
    if (chunk.fileName !== 'ehTagRules.js') return code;

    return code.replace(/(?<=const \S+ = )\{.+?\}(?=;)/s, (json) => {
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
};
