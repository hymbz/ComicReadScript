/** 阻止事件冒泡 */
export const stopPropagation = (e: Event) => {
  e.stopPropagation();
};

/** 从头开始播放元素的动画 */
export const playAnimation = (e?: HTMLElement) => {
  if (!e) return;
  for (const animation of e.getAnimations()) {
    animation.cancel();
    animation.play();
  }
};
