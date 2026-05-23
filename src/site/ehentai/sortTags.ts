import { css, ensureGmValue } from 'helper';

import { type EhPageContext } from './helper';
import { type Tag, handleMyTagsChange, updateMyTags } from './myTags';

const updateSortCss = (tagList: Tag[]) => {
  let cssText = 'tr a :is(.gltm, .glink + div:not([class])) { display: flex; }';
  for (const { title, order } of tagList)
    cssText += `\n.gt[title="${title}"] { order: ${order}; }`;
  return GM.setValue('ehTagSortCss', cssText);
};

/** 按照 mytags 上配置的标签顺序对其他页面上的标签进行排序 */
export const sortTags = async (pageCtx: EhPageContext) => {
  handleMyTagsChange.add(updateSortCss);

  switch (pageCtx.type) {
    case 'p':
    case 'l':
    case 't':
      return css(await ensureGmValue('ehTagSortCss', updateMyTags));

    case 'mytags': {
      let style: HTMLStyleElement;
      const sortDom = (tagList: Tag[]) => {
        let cssText = `
          #usertags_outer { display: flex; flex-direction: column; }
          #usertags_outer > div { margin: unset; }
          #usertag_0 { order: -${tagList.length}; }`;
        for (const { order, id } of tagList)
          cssText += `\n#usertag_${id} { view-transition-name: _${id}; order: ${order}; }`;
        style ||= GM_addElement('style', { textContent: cssText });
        style.textContent = cssText;
      };
      handleMyTagsChange.add((tagList: Tag[]) => {
        if (!document.startViewTransition) return sortDom(tagList);
        document.startViewTransition(() => sortDom(tagList));
      });
    }
  }
};
