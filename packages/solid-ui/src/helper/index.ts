import type { JSX } from 'solid-js';

/**
 * 从 boolean | Element 分出 Element 的类型保护函数
 */
export const isElement = (
  e: boolean | JSX.Element | undefined,
): e is JSX.Element => !!e;

/**
 * 判断使用参数颜色作为默认值时是否需要切换为黑暗模式
 *
 * @param hexColor 十六进制颜色。例如 #112233
 */
export const needDarkMode = (hexColor: string) => {
  // 来自 https://24ways.org/2010/calculating-color-contrast
  const r = parseInt(hexColor.substring(1, 3), 16);
  const g = parseInt(hexColor.substring(3, 5), 16);
  const b = parseInt(hexColor.substring(5, 7), 16);
  const yiq = (r * 299 + g * 587 + b * 114) / 1000;
  return yiq < 128;
};
