import {
  AnimationFrame,
  type PointerState,
  type UseDrag,
  approx,
  clamp,
  createMemoMap,
  debounce,
} from 'helper';

import { type State, refs, store } from '../store';
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

/** 逐帧根据鼠标坐标移动元素，并计算速率 */
const zoomDragAnim = new (class extends AnimationFrame {
  mouse = { x: 0, y: 0 };
  last = { x: 0, y: 0 };
  velocity = { x: 0, y: 0 };

  frame = () => {
    // 当停着不动时退出循环
    if (
      this.mouse.x === store.option.zoom.offset.x &&
      this.mouse.y === store.option.zoom.offset.y
    ) {
      this.animationId = 0;
      return;
    }

    setOption((draftOption, state) => {
      this.last.x = draftOption.zoom.offset.x;
      this.last.y = draftOption.zoom.offset.y;

      draftOption.zoom.offset.x = this.mouse.x;
      draftOption.zoom.offset.y = this.mouse.y;
      checkBound(state);

      this.velocity.x = draftOption.zoom.offset.x - this.last.x;
      this.velocity.y = draftOption.zoom.offset.y - this.last.y;
    });

    this.call(true);
  };

  /** 一段时间没有移动后应该将速率归零 */
  resetVelocity = debounce(() => {
    this.velocity.x = 0;
    this.velocity.y = 0;
  }, 200);
})();

/** 逐帧计算惯性滑动 */
const zoomSlideAnim = new (class extends AnimationFrame {
  lastTime: DOMHighResTimeStamp = 0;

  frame = (timestamp: DOMHighResTimeStamp) => {
    // 当速率足够小时停止计算动画
    if (approx(zoomDragAnim.velocity.x, 0, 1) && approx(zoomDragAnim.velocity.y, 0, 1)) {
      this.animationId = 0;
      return;
    }

    // 在拖拽后模拟惯性滑动
    setOption((draftOption, state) => {
      draftOption.zoom.offset.x += zoomDragAnim.velocity.x;
      draftOption.zoom.offset.y += zoomDragAnim.velocity.y;
      checkBound(state);

      // 确保每16毫秒才减少一次速率，防止在高刷新率显示器上衰减过快
      if (timestamp - this.lastTime > 16) {
        zoomDragAnim.velocity.x *= FRICTION_COEFF;
        zoomDragAnim.velocity.y *= FRICTION_COEFF;

        this.lastTime = timestamp;
      }
    });

    this.call(true);
  };
})();

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
      zoomDragAnim.velocity.x = 0;
      zoomDragAnim.velocity.y = 0;
      zoomDragAnim.mouse.x = store.option.zoom.offset.x;
      zoomDragAnim.mouse.y = store.option.zoom.offset.y;
      zoomSlideAnim.cancel();
      zoomDragAnim.cancel();
      break;
    }

    case 'move': {
      zoomDragAnim.cancel();
      zoomDragAnim.mouse.x += x - lx;
      zoomDragAnim.mouse.y += y - ly;
      zoomDragAnim.call();
      zoomDragAnim.resetVelocity();
      break;
    }

    case 'up': {
      zoomDragAnim.resetVelocity.clear();

      // 当双指捏合结束，一个手指抬起时，将剩余的指针当作刚点击来处理
      if (pinchZoom) {
        pinchZoom = false;
        zoomDragAnim.mouse.x = store.option.zoom.offset.x;
        zoomDragAnim.mouse.y = store.option.zoom.offset.y;
        return;
      }

      zoomDragAnim.cancel();
      zoomSlideAnim.call();
    }
  }
};

//
// 双指捏合缩放
//

/** 获取两个指针之间的距离 */
const getDistance = (a: PointerState, b: PointerState) =>
  Math.hypot(b.xy[0] - a.xy[0], b.xy[1] - a.xy[1]);

/** 逐帧计算当前屏幕上两点之间的距离，并换算成缩放比例 */
const pinchZoomAnim = new (class extends AnimationFrame {
  initDistance = 0;
  initScale = 100;

  frame = () => {
    if (touches.size < 2) {
      this.animationId = 0;
      return;
    }

    const [a, b] = [...touches.values()];
    const distance = getDistance(a, b);
    zoom((distance / this.initDistance) * this.initScale, {
      x: (a.xy[0] + b.xy[0]) / 2,
      y: (a.xy[1] + b.xy[1]) / 2,
    });

    this.call(true);
  };
})();

/** 处理双指捏合缩放 */
export const handlePinchZoom: UseDrag = ({ type }) => {
  if (touches.size < 2) return;

  switch (type) {
    case 'down': {
      pinchZoom = true;
      const [a, b] = [...touches.values()];
      pinchZoomAnim.initDistance = getDistance(a, b);
      pinchZoomAnim.initScale = store.option.zoom.ratio;
      break;
    }

    case 'up': {
      const [a, b] = [...touches.values()];
      pinchZoomAnim.initDistance = getDistance(a, b);
      break;
    }

    case 'move': {
      pinchZoomAnim.call();
      break;
    }

    case 'cancel': {
      const [a, b] = [...touches.values()];
      pinchZoomAnim.initDistance = getDistance(a, b);
      break;
    }
  }
};
