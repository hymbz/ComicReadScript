import MdPictureInPicture from '@material-design-icons/svg/round/picture_in_picture.svg?raw';
import { focus, hotkeysMap, setDefaultHotkeys } from 'components/Manga';
import {
  approx,
  clamp,
  createEffectOn,
  linstenKeydown,
  querySelector,
  useStyleMemo,
  useStore,
  useDrag,
  getKeyboardCode,
  hijackFn,
} from 'helper';

import { setEscHandler, type GalleryContext } from './helper';

const getDomPosition = (dom: HTMLElement) => {
  const rect = dom.getBoundingClientRect();
  const computedStyle = getComputedStyle(dom);

  const leftBorder = Number.parseFloat(computedStyle.borderLeftWidth);
  const leftPadding = Number.parseFloat(computedStyle.paddingLeft);
  const topPadding = Number.parseFloat(computedStyle.paddingTop);
  const topBorder = Number.parseFloat(computedStyle.borderTopWidth);

  return {
    left: rect.left + leftBorder + leftPadding,
    top: rect.top + topBorder + topPadding,
    width: computedStyle.width,
    height: computedStyle.height,
  };
};

export const floatTagList = ({
  store: { manga },
  dom: { newTagField },
}: GalleryContext) => {
  const gd4 = querySelector('#gd4')!;
  const gd4Style = getComputedStyle(gd4);

  /** 背景颜色 */
  let background = 'rgba(0, 0, 0, 0)';
  let dom = gd4;
  while (background === 'rgba(0, 0, 0, 0)') {
    background = getComputedStyle(dom).backgroundColor;
    dom = dom.parentElement!;
  }
  const { borderColor } = getComputedStyle(querySelector('#gdt')!);
  /** 边框样式 */
  const border = `1px solid ${borderColor}`;

  GM_addStyle(`
      #comicread-tag-box {
        position: fixed;
        z-index: 2147483647;

        font-size: 12px;
        text-align: justify;

        background: ${background};
        box-shadow: 0 0 15px -3px #0004;
      }

      #comicread-tag-box > #gd4 {
        margin: 0;
        padding: 0;
        border: none;
      }

      #comicread-tag-box > #ehs-introduce-box {
        position: relative;
        width: 161px;
        height: 100%;
        border-left: ${border};
      }

      /* 确保始终显示在最上层，防止和其他脚本冲突 */
      #ehs-introduce-box { z-index: 1; }

      #comicread-tag-box-placeholder {
        cursor: pointer;

        float: left;
        display: flex;
        grid-area: gd4;
        justify-content: center;

        margin: 0 0 0 10px;
        padding: 0 0 0 5px;

        border-right: 1px solid ${borderColor};
        border-left: 1px solid ${borderColor};
      }

      #comicread-tag-box-placeholder svg {
        width: 17em;
        opacity: 0.5;
      }

      /* 防止在窗口变小时确认按钮被挤出范围 */
      #tagmenu_new {
        width: fit-content;
      }
    `);

  const { store, setState, _setState, _state } = useStore({
    open: false,
    top: 0,
    left: 0,
    opacity: 1,
    mouse: { x: 0, y: 0 },
    bound: { width: 0, height: 0 },
  });

  type State = typeof _state;

  const setPos = (state: State, top: number, left: number) => {
    state.top = clamp(-gd4.clientHeight * 0.75, top, state.bound.height);
    state.left = clamp(-gd4.clientWidth * 0.75, left, state.bound.width);
  };

  const setOpacity = (opacity: number) =>
    _setState('opacity', clamp(0.5, opacity, 1));
  setOpacity(Number(localStorage.getItem('floatTagListOpacity')) || 1);

  // 监视鼠标位置，以便在通过快捷键唤出时出现在鼠标所在位置
  document.addEventListener('pointermove', (e) => {
    setState((state) => {
      state.mouse.x = e.clientX;
      state.mouse.y = e.clientY;
    });
  });

  const hadnleResize = () => {
    setState((state) => {
      state.bound.width = window.innerWidth - gd4.clientWidth / 4;
      state.bound.height = window.innerHeight - gd4.clientHeight / 4;
      setPos(state, state.top, state.left);
    });
  };
  window.addEventListener('resize', hadnleResize);
  hadnleResize();

  useStyleMemo('#comicread-tag-box', {
    display: () => (store.open ? undefined : 'none'),
    top: () => `${store.top}px`,
    left: () => `${store.left}px`,
    opacity: () => store.opacity,
  });

  // 防止布局偏移的占位元素
  const placeholder = gd4.cloneNode() as HTMLDivElement;
  placeholder.id = 'comicread-tag-box-placeholder';
  placeholder.style.display = 'none';
  placeholder.addEventListener('click', () => _setState('open', false));
  placeholder.innerHTML = MdPictureInPicture;
  gd4.parentElement!.append(placeholder);

  const ref = document.createElement('div');
  ref.id = 'comicread-tag-box';
  ref.classList.add('comicread-ignore');
  document.body.append(ref);

  // 使用 shift + 滚轮调整透明度
  ref.addEventListener(
    'wheel',
    (e) => {
      if (!e.shiftKey) return;
      e.stopPropagation();
      e.preventDefault();
      setOpacity(store.opacity + (e.deltaY > 0 ? -0.05 : 0.05));
      localStorage.setItem('floatTagListOpacity', `${store.opacity}`);
    },
    { passive: false },
  );

  const initPos = { top: 0, left: 0 };
  useDrag({
    ref: gd4,
    handleDrag({ type, xy: [x, y], initial: [ix, iy] }) {
      switch (type) {
        case 'down':
          if (!store.open) {
            const pos = getDomPosition(gd4);
            setState((state) => {
              // state.open = true;
              state.top = pos.top;
              state.left = pos.left;
            });
          }
          initPos.top = store.top;
          initPos.left = store.left;
          break;

        case 'up':
          setState((state) => {
            // 窗口移到原位附近时自动收回
            if (manga.show) return;
            const rect = placeholder.getBoundingClientRect();
            if (
              approx(state.top, rect.top, 50) &&
              approx(state.left, rect.left, 50)
            )
              state.open = false;
          });
          break;

        case 'move':
          setState((state) => {
            setPos(state, initPos.top + y - iy, initPos.left + x - ix);
            state.open = true;
          });
          break;
      }
    },
    handleClick: (_, target) => target.click(),
    skip: (e) =>
      !(e.target as HTMLElement).matches(
        '#gd4, #taglist, #gwrd, td+td, [id^=comidread] *:not(a)',
      ),
  });

  let ehs: HTMLElement | null;
  let ehsParent: HTMLElement | null;
  const handleEhs = () => {
    if (ehs) return;
    ehs = querySelector('#ehs-introduce-box');
    if (!ehs) return;
    ehsParent = ehs.parentElement;

    // 让 ehs 的自动补全列表能显示在顶部
    const autoComplete = querySelector('.eh-syringe-lite-auto-complete-list');
    if (autoComplete) {
      autoComplete.classList.add('comicread-ignore');
      autoComplete.style.zIndex = '2147483647';
      document.body.append(autoComplete);
    }

    // 只在当前有标签被选中时显示 ehs 的标签介绍
    hijackFn(
      'toggle_tagmenu',
      () =>
        (unsafeWindow.selected_tagname as string) ||
        querySelector('#ehs-introduce-box .ehs-close')?.click(),
    );
  };

  createEffectOn(
    () => store.open,
    (open) => {
      handleEhs();
      if (open) {
        const { height, width } = gd4Style;
        placeholder.style.cssText = `height: ${height}; width: ${width};`;
        ref.style.height = height;
        gd4.style.width = width;
        ref.append(gd4);
        if (ehs) ref.append(ehs);
        (document.activeElement as HTMLElement).blur();
      } else {
        placeholder.style.cssText = `display: none;`;
        gd4.style.width = '';
        placeholder.after(gd4);
        if (ehs) ehsParent!.append(ehs);
        focus();
      }
    },
    { defer: true },
  );

  setDefaultHotkeys((hotkeys) => ({ ...hotkeys, float_tag_list: ['q'] }));

  setEscHandler(0, () => (store.open ? _setState('open', false) : true));

  linstenKeydown((e) => {
    const code = getKeyboardCode(e);
    if (hotkeysMap()[code] !== 'float_tag_list') return;

    e.stopPropagation();
    e.preventDefault();
    setState((state) => {
      state.open = !state.open;
      if (!state.open) return;
      setPos(
        state,
        state.mouse.y - gd4.clientHeight / 2,
        state.mouse.x - gd4.clientWidth / 2,
      );
    });
  });

  // 在悬浮状态下打完标签后移开焦点，以便能快速用快捷键关掉悬浮界面
  hijackFn('tag_from_field', (rawFn, args) => {
    if (store.open) (document.activeElement as HTMLElement).blur();
    return rawFn(...args);
  });

  // 悬浮状态下鼠标划过自动聚焦输入框
  newTagField.addEventListener(
    'pointerenter',
    () => store.open && newTagField.focus(),
  );

  /** 根据标签链接获取对应的标签名 */
  const getDropTag = (tagUrl: string) => {
    const tagDom = querySelector(`a[href=${CSS.escape(tagUrl)}]`);
    if (!tagDom) return;
    // 有 ehs 的情况下 title 会是标签的简写
    return tagDom.title || tagDom.id.slice(3).replaceAll('_', ' ');
  };

  // 让标签可以直接拖进输入框，方便一次性点赞多个标签
  const handleDrop = (e: DragEvent) => {
    const text = e.dataTransfer!.getData('text');
    const tag = getDropTag(text);
    if (!tag) return;
    e.preventDefault();
    if (!newTagField.value.includes(tag)) newTagField.value += `${tag}, `;
    // 触发一下 input 事件
    newTagField.dispatchEvent(new Event('input'));
  };
  newTagField.addEventListener('drop', handleDrop);

  // 增大拖拽标签的放置范围，不用非得拖进框
  const taglist = querySelector('#taglist')!;
  taglist.addEventListener('dragover', (e) => e.preventDefault());
  taglist.addEventListener('dragenter', (e) => e.preventDefault());
  taglist.addEventListener('drop', handleDrop);
};
