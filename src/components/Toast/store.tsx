import { useStore } from 'helper';

import { type Toast } from '.';

export const { store, setState } = useStore({
  ref: null as HTMLElement | null,
  list: [] as Toast['id'][],
  // 删除断言后 map 类型会退化为 {}，导致 setState 路径类型报错
  // oxlint-disable-next-line typescript/no-unnecessary-type-assertion
  map: {} as Record<Toast['id'], Toast>,
});

export const creatId = (): string => {
  let id = `${Date.now()}`;
  while (Reflect.has(store.map, id)) id += '_';
  return id;
};

export const dismiss = (id: string) =>
  Reflect.has(store.map, id) && setState('map', id, 'exit', true);
