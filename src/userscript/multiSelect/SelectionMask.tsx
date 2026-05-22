import { useStyle, useStyleMemo, withEventStop } from 'helper';
import { type Accessor, type Component, Show } from 'solid-js';

import { type DragSession } from './useDragSelect';
import { type SelectionController } from './useSelection';

const DashedRoundedSquare: Component = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    width="1.5em"
    height="1.5em"
    fill="none"
    opacity="0.4"
    style={{ display: 'inline', 'vertical-align': '-0.15em' }}
  >
    <rect
      x="2"
      y="2"
      width="20"
      height="20"
      rx="5"
      stroke="currentColor"
      stroke-width="1.3"
      stroke-dasharray="3 2"
    />
  </svg>
);

export const SelectionMask: Component<{
  dom: HTMLElement;
  index: number;
  isEnabled: () => boolean;
  registeredItems: Accessor<Map<HTMLElement, string>>;
  selection: Pick<
    SelectionController,
    'isSelected' | 'getOrder' | 'selectedIds'
  >;
  drag: Pick<DragSession, 'onPointerDown' | 'onPointerEnter'>;
}> = (props) => {
  const id = () => props.registeredItems().get(props.dom)!;
  const isSelected = () => props.selection.isSelected(id());

  useStyle(
    `
      .selection-mask {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 2147483646;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        container-type: size;
        font-size: 4cqmin;
        overflow: clip;
        user-select: none;
        touch-action: none;
        background: rgba(0, 0, 0, 0.6);
        cursor: cell;
      }

      .selection-mask-order {
        font-size: 2em;
        font-family: sans-serif;
        font-weight: bold;
        -webkit-text-stroke: none;
        text-shadow: none;
      }`,
    props.dom,
  );

  useStyleMemo(
    '.selection-mask',
    { color: () => (isSelected() ? '#ffffffbf' : '#fffb') },
    props.dom,
  );

  return (
    <Show when={props.isEnabled()}>
      <div
        class="selection-mask"
        onPointerDown={withEventStop((e) =>
          props.drag.onPointerDown(props.dom, e),
        )}
        onPointerEnter={withEventStop((e) =>
          props.drag.onPointerEnter(props.dom, e),
        )}
        onPointerOver={withEventStop()}
        onMouseOver={withEventStop()}
        onContextMenu={withEventStop()}
        onClick={withEventStop()}
      >
        <span class="selection-mask-order">
          {props.selection.getOrder(id()) ?? <DashedRoundedSquare />}
        </span>
      </div>
    </Show>
  );
};
