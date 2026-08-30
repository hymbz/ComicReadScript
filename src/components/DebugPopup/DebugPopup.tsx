// oxlint-disable i18next/no-literal-string
import { css, mountComponents } from 'helper';
import { For, createMemo, createSignal, onMount } from 'solid-js';

import classes from './index.module.css';
import style from './index.module.css?inline';
import { clearDebugItems, setState, store } from './store';

type DragState = {
  startX: number;
  startY: number;
  originX: number;
  originY: number;
};

export const DebugPopup = () => {
  const [position, setPosition] = createSignal({ x: 100, y: 100 });
  const [collapsed, setCollapsed] = createSignal(false);
  const sortedList = createMemo(() =>
    [...store.list].toSorted((a, b) => store.map[a].index - store.map[b].index),
  );
  let dragState: DragState | undefined;
  let suppressHeaderClick = false;
  let pointerDownOnHeader = false;

  const handlePointerMove = (e: PointerEvent) => {
    if (!dragState) return;
    if (
      Math.hypot(e.clientX - dragState.startX, e.clientY - dragState.startY) > 3
    )
      suppressHeaderClick = true;
    setPosition({
      x: dragState.originX + e.clientX - dragState.startX,
      y: dragState.originY + e.clientY - dragState.startY,
    });
  };

  const handlePointerUp = (e: PointerEvent) => {
    if (!dragState) return;
    const wasDragged = suppressHeaderClick;
    dragState = undefined;
    const el = e.currentTarget as HTMLDivElement;
    if (el.hasPointerCapture(e.pointerId))
      el.releasePointerCapture(e.pointerId);
    if (e.type === 'pointerup' && pointerDownOnHeader && !wasDragged)
      setCollapsed((value) => !value);
    pointerDownOnHeader = false;
    suppressHeaderClick = false;
  };

  const handlePointerDown = (e: PointerEvent) => {
    const target = e.target as HTMLElement;
    if (target.closest('button')) return;
    pointerDownOnHeader = Boolean(target.closest(`.${classes.header}`));
    suppressHeaderClick = false;
    e.preventDefault();
    const pos = position();
    dragState = {
      startX: e.clientX,
      startY: e.clientY,
      originX: pos.x,
      originY: pos.y,
    };
    (e.currentTarget as HTMLDivElement).setPointerCapture(e.pointerId);
  };

  onMount(() => {
    css(style, store.ref);
  });

  return (
    <div
      ref={(ref) => setState('ref', ref)}
      class={classes.root}
      style={{
        display: store.visible ? undefined : 'none',
        left: `${position().x}px`,
        top: `${position().y}px`,
      }}
      on:pointerdown={handlePointerDown}
      on:pointermove={handlePointerMove}
      on:pointerup={handlePointerUp}
      on:pointercancel={handlePointerUp}
    >
      <div class={classes.header}>
        <span>{collapsed() ? '▶' : '▼'} Image Debug</span>
        <button type="button" class={classes.clear} onClick={clearDebugItems}>
          Clear
        </button>
        <button
          type="button"
          class={classes.close}
          onClick={() => setState('visible', false)}
        >
          Close
        </button>
      </div>
      {!collapsed() && (
        <div class={classes.list}>
          <For each={sortedList()}>
            {(id) => {
              const item = store.map[id];
              return (
                <figure class={classes.item}>
                  <img
                    src={item.url}
                    width={item.width}
                    height={item.height}
                    alt={`${item.type} ${item.version}`}
                    draggable={false}
                  />
                  <figcaption class={classes.caption}>
                    {`#${item.index} · ${item.name ?? item.type} v${item.version} · ${item.width}x${item.height}`}
                  </figcaption>
                </figure>
              );
            }}
          </For>
        </div>
      )}
    </div>
  );
};

let dom: HTMLDivElement | undefined;
export const init = () => {
  if (dom || store.ref) return;
  dom = mountComponents('debug-popup', () => <DebugPopup />);
  dom.style.setProperty('position', 'fixed', 'important');
  dom.style.setProperty('z-index', '2147483647', 'important');
  dom.classList.add('comicread-ignore');
  const mangaDom = document.getElementById('comicRead');
  if (mangaDom) mangaDom.after(dom);
};
