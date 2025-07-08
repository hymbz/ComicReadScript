import { useStore } from 'helper';

import type { Toast } from '.';

export const { store, setState } = useStore({
  ref: null as HTMLElement | null,
  list: [] as Toast['id'][],
  map: {} as Record<Toast['id'], Toast>,
});

export const creatId = (): string => {
  let id = `${Date.now()}`;
  while (Reflect.has(store.map, id)) id += '_';
  return id;
};

export const dismiss = (id: string) =>
  Reflect.has(store.map, id) && setState('map', id, 'exit', true);
