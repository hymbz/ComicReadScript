import { createSignal } from 'solid-js';

import { hotkeysMap, setDefaultHotkeys } from 'components/Manga';
import {
  domParse,
  getKeyboardCode,
  linstenKeydown,
  querySelector,
  querySelectorAll,
  useStyle,
} from 'helper';
import { request } from 'main';

import type { EhContext } from './helper/context';

import { colorizeTag } from './colorizeTag';

/** 展开标签列表 */
export const expandTagList = (context: EhContext) => {
  if (context.type !== 't') return;

  useStyle(`
    #taglist {
      height: auto;
      max-height: 230px;
      padding: 0 3px;

      --scrollbar-slider: ${getComputedStyle(querySelector('.ido')!).backgroundColor};
      scrollbar-color: var(--scrollbar-slider) transparent;
      scrollbar-width: thin;
      &::-webkit-scrollbar { width: 5px; height: 10px; }
      &::-webkit-scrollbar-track { background: transparent; }
      &::-webkit-scrollbar-thumb { background: var(--scrollbar-slider); }
    }
    .gl1t[data-tag-list-loading], .gl1t[data-tag-list-loading] * { cursor: progress; }
    .gl1t[data-show-tag-list] .gl6t { display: none; }
    .gl1t:not([data-show-tag-list]) #taglist { display: none; }

    /* 长标签换行 */
    #taglist [id^=td_] a[id^=ta_] {
      text-wrap: balance;
      word-break: keep-all;
      overflow-wrap: anywhere;
    }
  `);

  const tagListMap = new Map<HTMLElement, HTMLElement>();

  const handleShow = async (item: HTMLElement) => {
    if (item.style.cursor === 'progress') return;
    if (!tagListMap.has(item)) {
      let html: Document | undefined;
      let taglist: HTMLElement | null = null;
      try {
        item.dataset.tagListLoading = '';
        const res = await request(item.querySelector('a')!.href, {
          noTip: true,
          errorText: 'Fetch tag list error',
          noCheckCode: true,
        });
        html = domParse(res.responseText);
        taglist = html.querySelector<HTMLElement>('#taglist');
        if (!taglist) throw new Error('Fetch tag list error');

        // 因为 eh 目录页的缩略图是用精灵图的方式实现的，
        // 所以在这里顺便预载一下这张图，点进去后就能立刻显示缩略图了
        const [, thumbnail] = html
          .querySelector<HTMLElement>('#gdt div[title][style]')!
          .style.background.split('"');
        new Image().src = thumbnail;

        for (const a of taglist.querySelectorAll<HTMLAnchorElement>('a'))
          a.target = '_blank';
      } catch {
        taglist = document.createElement('div');
        taglist.id = 'taglist';
        taglist.textContent =
          html?.querySelector<HTMLElement>('.d p')?.textContent ||
          'Fetch tag list error';
      }
      item.querySelector('.gl3t')!.after(taglist);
      tagListMap.set(item, taglist);
      Reflect.deleteProperty(item.dataset, 'tagListLoading');
    }
    if (Reflect.has(item.dataset, 'showTagList'))
      Reflect.deleteProperty(item.dataset, 'showTagList');
    else item.dataset.showTagList = '';
  };

  for (const item of querySelectorAll('.gl1t')) {
    item.addEventListener(
      'click',
      (e) =>
        (e.target as HTMLElement).matches(
          ':not(a):is(.gl1t, .gl6t, .gl6t *, #taglist, #taglist *)',
        ) && handleShow(item),
    );
  }

  // 使用悬浮标签栏的快捷键
  setDefaultHotkeys((hotkeys) => ({ ...hotkeys, float_tag_list: ['q'] }));

  const [mouseXY, setMouseXY] = createSignal<[number, number]>([0, 0]);
  document.addEventListener('pointermove', (e) =>
    setMouseXY([e.clientX, e.clientY]),
  );

  linstenKeydown((e) => {
    const code = getKeyboardCode(e);
    if (hotkeysMap()[code] !== 'float_tag_list') return;
    e.stopPropagation();
    e.preventDefault();
    const elements = document.elementsFromPoint(...mouseXY());
    for (const item of elements)
      if (item.matches('.gl1t')) return handleShow(item as HTMLElement);
  }, true);

  // 为标签染色
  colorizeTag('gallery');
};
