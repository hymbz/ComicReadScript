/** 日志列之间的固定间隔空格数 */
export const LOG_COLUMN_SPACING = 4;

/** 计算字符串在等宽终端中的显示宽度，CJK/全角字符按 2 列计算 */
export const displayWidth = (text: string) => {
  let width = 0;
  for (const ch of text) width += ch.codePointAt(0)! > 255 ? 2 : 1;
  return width;
};

/** 将日志按列对齐：第一列（时间）右对齐，其余列左对齐 */
export const formatLogs = (logs: string[][]) => {
  if (logs.length === 0) return [];

  const columnCount = Math.max(...logs.map((row) => row.length));
  const columnWidths = Array.from({ length: columnCount }, (_, col) =>
    Math.max(
      0,
      ...logs
        .filter((row) => row[col] !== undefined)
        .map((row) => displayWidth(row[col])),
    ),
  );

  return logs.map((row) => {
    const parts: string[] = [];
    for (let col = 0; col < row.length; col++) {
      const value = row[col];
      const isLast = col === row.length - 1;
      if (isLast) {
        parts.push(value);
        continue;
      }

      // 没有时间列时，普通日志不需要输出前导空格
      if (col === 0 && value === '' && columnWidths[0] === 0) continue;

      const padding = Math.max(0, columnWidths[col] - displayWidth(value));
      // 第一列是时间列，右对齐；其余列左对齐
      parts.push(
        col === 0 ? ' '.repeat(padding) + value : value + ' '.repeat(padding),
      );
    }
    return parts.join(' '.repeat(LOG_COLUMN_SPACING));
  });
};

export class Log {
  readonly logs: string[][] = [];

  private readonly startTime = performance.now();
  private lastMarkTime = this.startTime;

  /** 记录普通日志，消息会在时间列之后左对齐输出 */
  log(message: string) {
    this.logs.push(['', message]);
  }

  /**
   * 记录从上一次 mark 到当前时刻的耗时。
   *
   * 第一项为耗时（右对齐），后续字符串参数在时间后依次左对齐输出。
   */
  mark(label: string, ...args: string[]) {
    const now = performance.now();
    const elapsed = now - this.lastMarkTime;
    this.lastMarkTime = now;
    this.logs.push([`${elapsed.toFixed(2)}ms`, label, ...args]);
  }

  /** 从图片开始处理到当前时刻的总耗时 */
  get totalTime(): number {
    return performance.now() - this.startTime;
  }

  /** 格式化所有日志为对齐后的完整字符串 */
  format(): string {
    return formatLogs(this.logs).join('\n');
  }
}
