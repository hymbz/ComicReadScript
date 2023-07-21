/** 阻止事件冒泡 */
export const stopPropagation = (e: Event) => {
  e.stopPropagation();
};

/** 从头开始播放元素的动画 */
export const playAnimation = (e?: HTMLElement) =>
  e?.getAnimations().forEach((animation) => {
    animation.cancel();
    animation.play();
  });

export const clamp = (max: number, val: number, min: number) =>
  Math.max(Math.min(max, val), min);
