import { log } from 'helper';

type EscHandlerEntry = {
  priority: number;
  handler: () => unknown;
};

let priorityMap = new Map<string, number>();

const getPriority = (id: string): number => {
  const p = priorityMap.get(id);
  if (p !== undefined) return p;
  log.warn(`[escManager] 未定义 「${id}」 的优先级`);
  return 64;
};

/** 设置字符串 ID 的对应优先级顺序 */
export const setEscPriority = (ids: string[]) => {
  priorityMap = new Map(ids.map((id, index) => [id, index]));
};

const handlers: EscHandlerEntry[] = [];

export const registerEsc = (
  id: string | number,
  handler: () => unknown,
): (() => void) => {
  const priority = typeof id === 'number' ? id : getPriority(id);
  const entry: EscHandlerEntry = { priority, handler };
  handlers.push(entry);
  handlers.sort((a, b) => a.priority - b.priority);

  return () => {
    const idx = handlers.indexOf(entry);
    if (idx !== -1) handlers.splice(idx, 1);
  };
};

/** 执行按优先级顺序执行所有已注册的 ESC 处理函数，返回是否有被处理 */
export const handleEsc = (): boolean => {
  for (const { handler } of handlers) if (handler() !== 'SKIP') return true;
  return false;
};
