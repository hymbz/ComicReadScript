/** 阻止事件冒泡 */
export const stopPropagation = (e: UIEvent) => {
  e.stopPropagation();
};

/** 从头开始播放元素的动画 */
export const playAnimation = (e?: HTMLElement) =>
  e?.getAnimations().forEach((animation) => {
    animation.cancel();
    animation.play();
  });
