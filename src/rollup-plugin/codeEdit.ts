import type { RenderedChunk } from 'rollup';

type Fn = (code: string, chunk: RenderedChunk) => unknown;

export const codeEdit = (name: string, ...fnList: Fn[]) => ({
  name,
  renderChunk: async (code: string, chunk: RenderedChunk) => {
    for (const fn of fnList) {
      const newCode = await fn(code, chunk);
      if (typeof newCode === 'string') code = newCode;
    }
    return code;
  },
});
