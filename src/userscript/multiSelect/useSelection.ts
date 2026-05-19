import { ReactiveSet, createRootMemo, useStore } from 'helper';

/** 拖拽选择会话状态 */
export type SessionState = {
  /** 当前可操作的选中项 id 列表，应由 registeredItems 转换而来 */
  items: string[];
  /** 操作范围，对应 items 中的索引，包含负数表示未启用 */
  range: [number, number];
  /** 操作类型，select 为选中，unselect 为取消选中 */
  operationType: 'select' | 'unselect';
};

/** 创建选中状态管理器 */
export const createSelectionController = () => {
  /** 已确认的选中项 */
  const baselineIds = new ReactiveSet<string>();

  const { store: session, setState: setSession } = useStore<SessionState>({
    items: [],
    range: [-1, -1],
    operationType: 'select',
  });

  /** 判断 session 是否处于活跃状态 */
  const isSessionActive = () => session.range[0] >= 0 && session.range[1] >= 0;

  /** 当前 range 区间内的 id 集合 */
  const rangeIds = createRootMemo(() => {
    if (!isSessionActive()) return new Set<string>();
    return new Set(session.items.slice(session.range[0], session.range[1] + 1));
  });

  const selectedIds = createRootMemo(() => {
    if (!isSessionActive()) return [...baselineIds];

    return session.operationType === 'select'
      ? [...baselineIds.union(rangeIds())]
      : [...baselineIds.difference(rangeIds())];
  });

  /** 记录每个 id 的选中顺序 */
  const orderMap = createRootMemo(() =>
    Object.fromEntries(selectedIds().map((id, i) => [id, i + 1])),
  );

  const cancel = () =>
    setSession((state) => {
      state.items = [];
      state.range = [-1, -1];
      state.operationType = 'select';
    });

  return {
    /** 当前会话状态（只读） */
    session,

    /** 当前选中项 id 列表 */
    selectedIds,
    /** 记录每个 id 的选中顺序 */
    orderMap,
    /** 判断指定 id 是否被选中 */
    isSelected: (id: string) => id in orderMap(),
    /** 获取指定 id 的选中顺序，未选中返回 undefined */
    getOrder: (id: string) => orderMap()[id],

    /** 修改会话状态 */
    setSession,
    /** 将 session 的修改应用到基线，然后重置 session */
    commit: () => {
      if (!isSessionActive()) return;
      if (session.operationType === 'select')
        for (const id of rangeIds()) baselineIds.add(id);
      else for (const id of rangeIds()) baselineIds.delete(id);
      cancel();
    },
    /** 重置 session 为初始状态 */
    cancel,
    /** 直接设置基线选中项列表 */
    setBaseline: (ids: string[]) => {
      baselineIds.clear();
      for (const id of ids) baselineIds.add(id);
    },
    /** 清空基线选中项列表 */
    clearBaseline: () => baselineIds.clear(),
  };
};

export type SelectionController = ReturnType<typeof createSelectionController>;
