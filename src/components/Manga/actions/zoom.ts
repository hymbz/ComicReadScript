import {
  clamp,
  approx,
  createMemoMap,
  type PointerState,
  type UseDrag,
  debounce,
} from 'helper';

import { type State, store, refs } from '../store';

import { setOption } from './helper';

export const touches = new Map<number, PointerState>();

export const bound = createMemoMap({
  x: () => -store.rootSize.width * (store.option.zoom.ratio / 100 - 1),
  y: () => -store.rootSize.height * (store.option.zoom.ratio / 100 - 1),
});

const checkBound = (state: State) => {
  state.option.zoom.offset.x = clamp(bound().x, state.option.zoom.offset.x, 0);
  state.option.zoom.offset.y = clamp(bound().y, state.option.zoom.offset.y, 0);
};

export const zoom = (
  val: number,
  focal?: { x: number; y: number },
  animation = false,
) => {
  const newScale = clamp(100, val, 300);
  if (newScale === store.option.zoom.ratio) return;

  // 消除放大导致的偏移
  const { left, top } = refs.mangaBox.getBoundingClientRect();
  const x = (focal?.x ?? store.rootSize.width / 2) - left;
  const y = (focal?.y ?? store.rootSize.height / 2) - top;

  // 当前直接放大后的基准点坐标
  const newX = (x / (store.option.zoom.ratio / 100)) * (newScale / 100);
  const newY = (y / (store.option.zoom.ratio / 100)) * (newScale / 100);

  // 放大后基准点的偏移距离
  const dx = newX - x;
  const dy = newY - y;

  setOption((draftOption, state) => {
    draftOption.zoom.ratio = newScale;
    draftOption.zoom.offset.x -= dx;
    draftOption.zoom.offset.y -= dy;
    checkBound(state);

    if (animation) state.page.anima = 'zoom';
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
  if (approx(velocity.x, 0, 1) && approx(velocity.y, 0, 1)) {
    animationId = null;
    return;
  }

  // 在拖拽后模拟惯性滑动
  setOption((draftOption, state) => {
    draftOption.zoom.offset.x += velocity.x;
    draftOption.zoom.offset.y += velocity.y;
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
  if (
    mouse.x === store.option.zoom.offset.x &&
    mouse.y === store.option.zoom.offset.y
  ) {
    animationId = null;
    return;
  }

  setOption((draftOption, state) => {
    last.x = draftOption.zoom.offset.x;
    last.y = draftOption.zoom.offset.y;

    draftOption.zoom.offset.x = mouse.x;
    draftOption.zoom.offset.y = mouse.y;
    checkBound(state);

    velocity.x = draftOption.zoom.offset.x - last.x;
    velocity.y = draftOption.zoom.offset.y - last.y;
  });

  animationId = requestAnimationFrame(handleDragAnima);
};

/** 一段时间没有移动后应该将速率归零 */
const resetVelocity = debounce(() => {
  velocity.x = 0;
  velocity.y = 0;
}, 200);

/** 是否正在双指捏合缩放中 */
let pinchZoom = false;

/** 处理放大后的拖拽移动 */
export const handleZoomDrag: UseDrag = ({
  type,
  xy: [x, y],
  last: [lx, ly],
}) => {
  if (store.option.zoom.ratio === 100) return;

  switch (type) {
    case 'down': {
      mouse.x = store.option.zoom.offset.x;
      mouse.y = store.option.zoom.offset.y;
      if (animationId) cancelAnimation();
      break;
    }

    case 'move': {
      if (animationId) cancelAnimation();
      mouse.x += x - lx;
      mouse.y += y - ly;
      if (animationId === null)
        animationId = requestAnimationFrame(handleDragAnima);
      resetVelocity();
      break;
    }

    case 'up': {
      resetVelocity.clear();

      // 当双指捏合结束，一个手指抬起时，将剩余的指针当作刚点击来处理
      if (pinchZoom) {
        pinchZoom = false;
        mouse.x = store.option.zoom.offset.x;
        mouse.y = store.option.zoom.offset.y;
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
      initScale = store.option.zoom.ratio;
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
