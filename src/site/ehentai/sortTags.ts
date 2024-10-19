import { getGmValue } from 'helper';

import { updateMyTags, handleMyTagsChange, type Tag } from './myTags';

import type { PageType } from '.';

const updateSortCss = (tagList: Tag[]) => {
  let css = 'tr a :is(.gltm, .glink + div:not([class])) { display: flex; }';
  for (const { title, order } of tagList)
    css += `\n.gt[title="${title}"] { order: ${order}; }`;
  return GM.setValue('ehTagSortCss', css);
};

export const sortTags = async (pageType: PageType) => {
  handleMyTagsChange.add(updateSortCss);

  switch (pageType) {
    case 'p':
    case 'l':
    case 't':
      return GM_addStyle(await getGmValue('ehTagSortCss', updateMyTags));

    case 'mytags': {
      let style: HTMLStyleElement;
      const sortDom = (tagList: Tag[]) => {
        let css = `
          #usertags_outer { display: flex; flex-direction: column; }
          #usertags_outer > div { margin: unset; }
          #usertag_0 { order: -${tagList.length}; }`;
        for (const { order, id } of tagList)
          css += `\n#usertag_${id} { view-transition-name: _${id}; order: ${order}; }`;
        style ||= GM_addElement('style', { textContent: css });
        style.textContent = css;
      };
      handleMyTagsChange.add((tagList: Tag[]) => {
        if (!document.startViewTransition) return sortDom(tagList);
        document.startViewTransition(() => sortDom(tagList));
      });
    }
  }
};
