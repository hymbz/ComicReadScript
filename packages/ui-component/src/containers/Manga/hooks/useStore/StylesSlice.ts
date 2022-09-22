// TODO: 移到 otherSlice 里去

export interface StylesSlice {
  /** 是否强制显示侧边栏 */
  showToolbar: boolean;
  /** 是否强制显示滚动条 */
  showScrollbar: boolean;

  [key: string]: unknown;
}

export const stylesSlice: SelfStateCreator<StylesSlice> = () => ({
  showToolbar: false,
  showScrollbar: false,
});
