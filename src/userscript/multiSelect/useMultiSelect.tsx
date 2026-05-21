import { plimit } from 'helper';
import { type Accessor, createRoot, createSignal } from 'solid-js';
import { render } from 'solid-js/web';
import { type Promisable } from 'type-fest';

import { SelectionMask } from './SelectionMask';
import { useDragSelect } from './useDragSelect';
import { createSelectionController } from './useSelection';

export type UseMultiSelectOptions = {
  /** 在 start 时调用，用于页面 DOM 预处理，返回清理函数 */
  onStart?: () => (() => void) | void;
  /** 需要注册的可选 DOM 元素 Map，key 为 DOM 元素，value 为 id */
  registeredItems: Accessor<Map<HTMLElement, string>>;
};

export const useMultiSelect = ({
  onStart,
  registeredItems,
}: UseMultiSelectOptions) =>
  createRoot((dispose) => {
    const [isEnabled, setIsEnabled] = createSignal(false);

    const selectionController = createSelectionController();

    const drag = useDragSelect({
      isEnabled,
      registeredItems,
      ...selectionController,
    });

    /** 所有需要在 unmount 时执行的清理函数（DOM dispose、事件监听等） */
    const cleanups: (() => void)[] = [];
    let isInitialized = false;
    let elementIndex = 0;

    /** 注册一个可选元素：挂载 SelectionMask */
    const register = (dom: HTMLElement) => {
      const id = registeredItems().get(dom);
      if (!id) return;

      const index = elementIndex++;
      const container = document.createElement('div');
      dom.append(container);
      const disposeDom = render(
        () => (
          <SelectionMask
            dom={dom}
            index={index}
            isEnabled={isEnabled}
            registeredItems={registeredItems}
            selection={selectionController}
            drag={drag}
          />
        ),
        container,
      );

      cleanups.push(() => {
        disposeDom();
        container.remove();
      });
    };

    /** 卸载所有 DOM 注册和事件监听，但保留选中状态（翻页场景） */
    const unmount = () => {
      drag.clear();
      setIsEnabled(false);
      isInitialized = false;
      for (let i = cleanups.length - 1; i >= 0; i--) cleanups[i]?.();
      cleanups.length = 0;
    };

    return {
      /** 当前是否处于多选模式 */
      isEnabled,
      /** 开启多选模式并注册元素 */
      start: () => {
        if (isEnabled()) return;
        setIsEnabled(true);
        if (isInitialized) return;

        document.addEventListener('pointerup', drag.onPointerUp);
        document.addEventListener('pointercancel', drag.onPointerCancel);
        cleanups.push(() => {
          document.removeEventListener('pointerup', drag.onPointerUp);
          document.removeEventListener('pointercancel', drag.onPointerCancel);
        });

        // 执行 onStart 预处理
        const cleanup = onStart?.();
        if (cleanup) cleanups.push(cleanup);

        // 注册所有 DOM 元素
        for (const dom of registeredItems().keys()) register(dom);

        isInitialized = true;
      },
      /** 结束多选模式，并发处理所有选中项并返回结果列表 */
      collect: async <T,>(
        process: (id: string) => Promisable<T>,
        limit?: number,
      ) => {
        const ids = selectionController.selectedIds();
        if (ids.length === 0) return [];

        setIsEnabled(false);

        return await plimit(
          ids.map((id) => async () => {
            try {
              return await process(id);
            } catch (error) {
              return error instanceof Error ? error : new Error(String(error));
            }
          }),
          undefined,
          limit,
        );
      },
      /** 清空选中状态并卸载所有 DOM 注册 */
      clear: () => {
        selectionController.clearBaseline();
        selectionController.cancel();
        unmount();
      },
      unmount,
      /** 清理所有 SolidJS 响应式资源 */
      dispose,
      /** 当前选中项 ID 列表 */
      selectedIds: selectionController.selectedIds,
      /** 根据 ID 列表恢复选中状态（翻页后重新注册 DOM 时使用） */
      setSelectedIds: selectionController.setBaseline,
    };
  });

export type MultiSelectController = ReturnType<typeof useMultiSelect>;
