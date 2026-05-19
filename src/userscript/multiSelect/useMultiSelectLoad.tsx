import MdChecklist from '@material-design-icons/svg/round/checklist.svg';
import { type CoreContext, listenHotkey, registerEsc } from 'core';
import {
  createEffectOn,
  isEqual,
  isString,
  singleThreaded,
  t,
  useCache,
  wait,
} from 'helper';
import { createRoot, createSignal } from 'solid-js';

import {
  type MultiSelectController,
  type UseMultiSelectOptions,
  useMultiSelect,
} from './useMultiSelect';

export type MultiSelectExternalController = MultiSelectController & {
  load: () => Promise<void> | undefined;
};

/**
 * 多选加载缓存结构
 * - pending: 未确认的选择项
 * - confirmed: 已确认的选择项
 */
type MultiSelectCache = {
  pending: { id: string; selecteds: string[] };
  confirmed: { id: string; selecteds: string[] };
};

export type MultiSelectLoadOptions = {
  /** 当前列表的唯一标识，用于区分不同列表的选择项 */
  id: string;
  /** 在 start 时调用，用于页面 DOM 预处理，返回清理函数 */
  onStart?: UseMultiSelectOptions['onStart'];
  /** 根据标识获取图片列表 */
  getImgList: (id: string) => Promise<string[]>;
};

export const createMultiSelectLoadController = <T extends Record<string, any>>(
  coreCtx: CoreContext<T>,
  { id: initListId, onStart, getImgList }: MultiSelectLoadOptions,
) =>
  createRoot(async (dispose) => {
    const { setState, showComic } = coreCtx;
    const cache = await useCache<MultiSelectCache>({
      pending: 'id',
      confirmed: 'id',
    });

    const [listId, setListId] = createSignal<string>(initListId);
    const [registeredItems, setRegisteredItems] = createSignal(
      new Map<HTMLElement, string>(),
    );
    const controller = useMultiSelect({ onStart, registeredItems });

    // 切换列表时清空选中状态
    createEffectOn([listId], ([currentId], prev) => {
      const prevId = prev?.[0];
      if (prevId !== undefined && prevId !== currentId) controller.clear();
    });

    const multiSelectLoad = singleThreaded(async () => {
      if (!controller.isEnabled()) {
        controller.start();
        const confirmed = await cache.get('confirmed', listId());
        if (confirmed) controller.setSelectedIds(confirmed.selecteds);
        return;
      }

      const imgLists = await controller.collect(getImgList);
      const imgList = imgLists.flat().filter(isString);
      if (imgList.length === 0) return controller.clear();

      await cache.del('pending', listId());
      await cache.set('confirmed', {
        id: listId(),
        selecteds: controller.selectedIds(),
      });

      setState('comicMap', 'multiSelect', { imgList });
      await showComic('multiSelect');
    });

    coreCtx.multiSelect = { ...controller, load: multiSelectLoad };

    // 提前设置 imgList 表示当前页面可以被多选加载
    setState('comicMap', 'multiSelect', { imgList: [] });

    let unregisterEscHandler: (() => void) | undefined;
    createEffectOn([controller.isEnabled], ([enabled]) => {
      // ESC 退出多选模式
      if (enabled) {
        unregisterEscHandler?.();
        unregisterEscHandler = registerEsc(-1, () =>
          controller.isEnabled() ? controller.unmount() : 'SKIP',
        );
      }
    });

    setState('fab', 'extraSpeedDial', [
      {
        name: t('hotkeys.multi_select_load'),
        onClick: multiSelectLoad,
        icon: <MdChecklist />,
      },
    ]);

    // 多选模式启用时，将当前选中项保存到 pending 缓存
    createEffectOn(
      [controller.isEnabled, () => controller.selectedIds().length, listId],
      ([enabled, , id]) => {
        if (!enabled) return;

        const selecteds = controller.selectedIds();
        (async () => {
          await cache.del('confirmed', id);
          await (selecteds.length === 0
            ? cache.del('pending', id)
            : cache.set('pending', { id, selecteds }));
        })();
      },
    );

    const unlistenHotkey = listenHotkey(
      {
        enter_read_mode: multiSelectLoad,
        multi_select_load: multiSelectLoad,
      },
      true,
    );

    let oldIdSet: string[] = [];
    /** 清理副作用，但保留选中状态（用于翻页） */
    const unmount = () => {
      unregisterEscHandler?.();
      // 保存当前 ID 集合供下次比对
      oldIdSet = [...registeredItems().values()];

      controller.unmount();
      // 清空 registeredItems，避免旧 DOM 引用残留
      setRegisteredItems(new Map());
      unlistenHotkey();
    };

    return {
      /** 注册新的可选项，并等待至和上次的注册项不同 */
      registerItems: async (
        newId: string,
        fillItems: (map: Map<HTMLElement, string>) => Promise<void>,
        maxWaitTime = 5000,
      ) => {
        setListId(newId);

        const map = await wait(async () => {
          const newMap = new Map<HTMLElement, string>();
          await fillItems(newMap);
          if (newMap.size === 0) return;
          // IdSet相同，说明 DOM 未更新
          if (isEqual(oldIdSet, [...newMap.values()])) return;
          return newMap;
        }, maxWaitTime);

        if (!map) throw new Error('等待新 DOM 超时');

        // 设置注册项，并自动恢复 pending 状态
        setRegisteredItems(map);
        const pending = await cache.get('pending', listId());
        // 有 pending 时自动恢复选中状态
        if (pending?.selecteds.length) {
          controller.start();
          controller.setSelectedIds(pending.selecteds);
        }
      },
      unmount,
      /** 完全清理所有状态和副作用 */
      dispose: () => {
        oldIdSet = [];
        unmount();
        controller.dispose();
        dispose();
      },
      /** 页面切换时的清理策略 */
      createCleanup:
        (id: string) => (nextPageCtx?: { type: string; id: string }) => {
          // 同一 list 翻页，只清理副作用，保留实例和选中状态
          unmount();
          // 切换到不同页面时，完全清理
          if (nextPageCtx?.type !== 'list' || nextPageCtx?.id !== id) {
            dispose();
            multiSelectLoadController = undefined;
          }
        },
    };
  });

export type MultiSelectLoadController = Awaited<
  ReturnType<typeof createMultiSelectLoadController>
>;

let multiSelectLoadController: MultiSelectLoadController | undefined;

export const useMultiSelectLoad = async <T extends Record<string, any>>(
  coreCtx: CoreContext<T>,
  options: MultiSelectLoadOptions,
) => {
  if (multiSelectLoadController) return multiSelectLoadController;
  multiSelectLoadController = await createMultiSelectLoadController(
    coreCtx,
    options,
  );
  return multiSelectLoadController;
};
