import { type SetStateFunction } from 'helper';
import { type Accessor } from 'solid-js';

import { type SessionState } from './useSelection';

type DragSelectOptions = {
  /** 当前是否处于多选模式 */
  isEnabled: () => boolean;
  /** 需要注册的可选 DOM 元素 Map，key 为 DOM 元素，value 为 id */
  registeredItems: Accessor<Map<HTMLElement, string>>;
  /** 判断指定 id 是否被选中 */
  isSelected: (id: string) => boolean;
  /** 修改会话状态 */
  setSession: SetStateFunction<SessionState>;
  /** 当前会话状态 */
  session: SessionState;
  /** 将 session 的修改应用到基线 */
  commit: () => void;
  /** 重置 session 为初始状态 */
  cancel: () => void;
};

export const useDragSelect = ({
  isEnabled,
  registeredItems,
  isSelected,
  setSession,
  session,
  commit,
  cancel,
}: DragSelectOptions) => {
  /** 当前活跃手势的 pointerId，null 表示无活跃手势 */
  let pointerId: number | null = null;
  /** 锚点在 items 中的索引，固定不变 */
  let anchorIndex = -1;
  /** 当前手势是否扩展过范围（用于判断是否应撤销选择） */
  let hasExpanded = false;

  return {
    onPointerDown: (dom: HTMLElement, e: PointerEvent) => {
      if (!isEnabled() || !e.isPrimary) return;
      if (e.pointerType === 'mouse' && e.button !== 0) return;

      const entries = [...registeredItems().entries()];
      anchorIndex = entries.findIndex(([d]) => d === dom);
      if (anchorIndex === -1) return;

      ({ pointerId } = e);
      hasExpanded = false;

      setSession((state) => {
        state.operationType = isSelected(registeredItems().get(dom)!)
          ? 'unselect'
          : 'select';
        state.items = entries.map(([, id]) => id);
        state.range = [anchorIndex, anchorIndex];
      });
    },
    onPointerEnter: (dom: HTMLElement, e: PointerEvent) => {
      if (!isEnabled() || pointerId === null || e.pointerId !== pointerId)
        return;

      // 鼠标移入时若左键已释放，视为手势结束
      if (e.pointerType === 'mouse' && (e.buttons & 1) === 0) {
        pointerId = null;
        return cancel();
      }

      const entries = [...registeredItems().keys()];
      const currentIndex = entries.indexOf(dom);
      if (currentIndex === -1) return;

      const newRange: [number, number] =
        anchorIndex <= currentIndex
          ? [anchorIndex, currentIndex]
          : [currentIndex, anchorIndex];
      setSession((state) => {
        if (state.range[0] === newRange[0] && state.range[1] === newRange[1])
          return;
        state.range = newRange;
        if (newRange[0] !== newRange[1]) hasExpanded = true;
      });
    },
    onPointerUp: (e: PointerEvent) => {
      if (e.pointerId !== pointerId) return;
      pointerId = null;
      // 如果扩展过返回后再重新回到初始项，则撤销这次选择
      if (session.range[0] === session.range[1] && hasExpanded) cancel();
      else commit();
    },
    onPointerCancel: (e: PointerEvent) => {
      if (e.pointerId !== pointerId) return;
      // 手势被系统中断，放弃 session 修改
      pointerId = null;
      cancel();
    },
    /** 取消活跃手势并重置状态 */
    clear: () => {
      if (pointerId !== null) cancel();
      pointerId = null;
    },
  };
};

export type DragSession = ReturnType<typeof useDragSelect>;
