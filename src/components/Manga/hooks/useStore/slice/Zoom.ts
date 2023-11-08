import { createRoot, createMemo } from 'solid-js';
import { clamp, isEqual } from 'helper';
import { debounce } from 'throttle-debounce';
import type { State } from '..';
import { store, setState } from '..';
import type { PointerState, UseDrag } from '../../useDrag';

export const touches = new Map<number, PointerState>();

const scale = () => store.zoom.scale / 100;

const mangaFlowBox = () => store.ref.mangaFlow;

const width = () => store.ref.mangaFlow?.clientWidth ?? 0;
const height = () => store.ref.mangaFlow?.clientHeight ?? 0;

const bound = createRoot(() => {
  const x = createMemo(() => -width() * (scale() - 1));
  const y = createMemo(() => -height() * (scale() - 1));

  return { x, y };
});

const checkBound = (state: State) => {
  state.zoom.offset.x = clamp(bound.x(), state.zoom.offset.x, 0);
  state.zoom.offset.y = clamp(bound.y(), state.zoom.offset.y, 0);
};

const closeScrollLock = debounce(200, () =>
  setState((state) => {
    state.scrollLock = false;
  }),
);

export const zoom = (
  val: number,
  focal?: { x: number; y: number },
  animation = false,
) => {
  const newScale = clamp(100, val, 500);
  if (newScale === store.zoom.scale) return;

  // 消除放大导致的偏移
  const { left, top } = mangaFlowBox().getBoundingClientRect();
  const x = (focal?.x ?? width() / 2) - left;
  const y = (focal?.y ?? height() / 2) - top;

  // 当前直接放大后的基准点坐标
  const newX = (x / (store.zoom.scale / 100)) * (newScale / 100);
  const newY = (y / (store.zoom.scale / 100)) * (newScale / 100);

  // 放大后基准点的偏移距离
  const dx = newX - x;
  const dy = newY - y;

  setState((state) => {
    state.zoom.scale = newScale;
    state.zoom.offset.x -= dx;
    state.zoom.offset.y -= dy;
    checkBound(state);

    if (animation) state.page.anima = 'zoom';

    // 加一个延时锁防止在放大模式下通过滚轮缩小至原尺寸后就立刻跳到下一页
    if (newScale === 100) {
      state.scrollLock = true;
      closeScrollLock();
    }

    // 缩放的时候关掉强制显示的工具栏和滚动条
    state.show.toolbar = false;
    state.show.scrollbar = false;
  });
};

//
// 惯性滑动
//

/** 摩擦系数 */
const FRICTION_COEFF = 0.91;

const mouse = { x: 0, y: 0 };
const last = { x: 0, y: 0 };
const velocity = { x: 0, y: 0 };

let animationId: number | null = null;
const cancelAnimation = () => {
  if (!animationId) return;
  cancelAnimationFrame(animationId);
  animationId = null;
};

let lastTime: DOMHighResTimeStamp = 0;

/** 逐帧计算惯性滑动 */
const handleSlideAnima = (timestamp: DOMHighResTimeStamp) => {
  // 当速率足够小时停止计算动画
  if (isEqual(velocity.x, 0, 1) && isEqual(velocity.y, 0, 1)) {
    animationId = null;
    return;
  }

  // 在拖拽后模拟惯性滑动
  setState((state) => {
    state.zoom.offset.x += velocity.x;
    state.zoom.offset.y += velocity.y;
    checkBound(state);

    // 确保每16毫秒才减少一次速率，防止在高刷新率显示器上衰减过快
    if (timestamp - lastTime > 16) {
      velocity.x *= FRICTION_COEFF;
      velocity.y *= FRICTION_COEFF;

      lastTime = timestamp;
    }
  });

  animationId = requestAnimationFrame(handleSlideAnima);
};

/** 逐帧根据鼠标坐标移动元素，并计算速率 */
const handleDragAnima = () => {
  // 当停着不动时退出循环
  if (mouse.x === store.zoom.offset.x && mouse.y === store.zoom.offset.y) {
    animationId = null;
    return;
  }

  setState((state) => {
    last.x = state.zoom.offset.x;
    last.y = state.zoom.offset.y;

    state.zoom.offset.x = mouse.x;
    state.zoom.offset.y = mouse.y;
    checkBound(state);

    velocity.x = state.zoom.offset.x - last.x;
    velocity.y = state.zoom.offset.y - last.y;
  });

  animationId = requestAnimationFrame(handleDragAnima);
};

/** 是否正在双指捏合缩放中 */
let pinchZoom = false;

/** 处理放大后的拖拽移动 */
export const handleZoomDrag: UseDrag = ({
  type,
  xy: [x, y],
  last: [lx, ly],
}) => {
  if (store.zoom.scale === 100) return;

  switch (type) {
    case 'down': {
      mouse.x = store.zoom.offset.x;
      mouse.y = store.zoom.offset.y;
      if (animationId) cancelAnimation();
      break;
    }
    case 'move': {
      if (animationId) cancelAnimation();
      mouse.x += x - lx;
      mouse.y += y - ly;
      if (animationId === null)
        animationId = requestAnimationFrame(handleDragAnima);
      break;
    }
    case 'up': {
      // 当双指捏合结束，一个手指抬起时，将剩余的指针当作刚点击来处理
      if (pinchZoom) {
        pinchZoom = false;
        mouse.x = store.zoom.offset.x;
        mouse.y = store.zoom.offset.y;
        return;
      }
      if (animationId) cancelAnimationFrame(animationId);
      animationId = requestAnimationFrame(handleSlideAnima);
    }
  }
};

//
// 双指捏合缩放
//

/** 初始双指距离 */
let initDistance = 0;
/** 初始缩放比例 */
let initScale = 100;

/** 获取两个指针之间的距离 */
const getDistance = (a: PointerState, b: PointerState) =>
  Math.hypot(b.xy[0] - a.xy[0], b.xy[1] - a.xy[1]);

/** 逐帧计算当前屏幕上两点之间的距离，并换算成缩放比例 */
const handlePinchZoomAnima = () => {
  if (touches.size < 2) {
    animationId = null;
    return;
  }

  const [a, b] = [...touches.values()];
  const distance = getDistance(a, b);
  zoom((distance / initDistance) * initScale, {
    x: (a.xy[0] + b.xy[0]) / 2,
    y: (a.xy[1] + b.xy[1]) / 2,
  });

  animationId = requestAnimationFrame(handlePinchZoomAnima);
};

/** 处理双指捏合缩放 */
export const handlePinchZoom: UseDrag = ({ type }) => {
  if (touches.size < 2) return;

  switch (type) {
    case 'down': {
      pinchZoom = true;
      const [a, b] = [...touches.values()];
      initDistance = getDistance(a, b);
      initScale = store.zoom.scale;
      break;
    }
    case 'up': {
      const [a, b] = [...touches.values()];
      initDistance = getDistance(a, b);
      break;
    }
    case 'move': {
      if (animationId === null)
        animationId = requestAnimationFrame(handlePinchZoomAnima);
      break;
    }
    case 'cancel': {
      const [a, b] = [...touches.values()];
      initDistance = getDistance(a, b);
      break;
    }
  }
};
