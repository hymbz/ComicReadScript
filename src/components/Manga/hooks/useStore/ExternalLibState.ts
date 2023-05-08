import type { PanZoom } from 'panzoom';

export const ExternalLibState = {
  panzoom: undefined as PanZoom | undefined,
  /** 当前是否处于放大模式 */
  isZoomed: false,
};
