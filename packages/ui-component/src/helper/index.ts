/**
 * 自定义的可以从 boolean | Element 分出 Element 的类型保护函数
 *
 * @param e *
 * @returns boolean
 */
export const isElement = (
  e: boolean | JSX.Element | undefined,
): e is JSX.Element => !!e;
