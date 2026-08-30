import { useStore } from 'helper';

export type DebugImgType = 'raw' | 'gray' | 'area';

export type DebugImgItem = {
  id: string;
  sourceUrl: string;
  url: string;
  width: number;
  height: number;
  index: number;
  version: number;
  type: DebugImgType;
  name?: string;
};

export const { store, setState } = useStore({
  ref: null as HTMLDivElement | null,
  list: [] as string[],
  // 删除断言后 map 类型会退化为 {}，导致 setState 路径类型报错
  // oxlint-disable-next-line typescript/no-unnecessary-type-assertion
  map: {} as Record<string, DebugImgItem>,
  currentVersion: 0,
  visible: false,
});

let idSeq = 0;

export const addDebugItem = (item: Omit<DebugImgItem, 'id'>) => {
  setState((state) => {
    if (item.version < state.currentVersion) {
      URL.revokeObjectURL(item.url);
      return;
    }

    if (item.version > state.currentVersion) {
      for (const id of state.list) {
        const oldItem = state.map[id];
        if (oldItem?.version < item.version) {
          URL.revokeObjectURL(oldItem.url);
          delete state.map[id];
        }
      }
      state.list = state.list.filter((id) => Reflect.has(state.map, id));
      state.currentVersion = item.version;
    }

    const id = `${++idSeq}`;
    state.map[id] = { ...item, id };
    state.list.push(id);
    state.visible = true;
  });
};

export const clearDebugItems = () => {
  setState((state) => {
    for (const id of state.list) {
      const item = state.map[id];
      if (item) URL.revokeObjectURL(item.url);
      delete state.map[id];
    }
    state.list = [];
  });
};
