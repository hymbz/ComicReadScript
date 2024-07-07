import { linstenKeyup, querySelector } from 'main';

import { type PageType } from '.';

/** 快捷键翻页 */
export const hotkeysPageTurn = (pageType: PageType) => {
  if (pageType === 'gallery') {
    linstenKeyup((e) => {
      switch (e.key) {
        case 'ArrowRight':
        case 'd':
          querySelector('#dnext')?.click();
          break;

        case 'ArrowLeft':
        case 'a':
          querySelector('#dprev')?.click();
          break;
      }
    });
  } else {
    linstenKeyup((e) => {
      switch (e.key) {
        case 'ArrowRight':
        case 'd':
          querySelector('#unext')?.click();
          break;

        case 'ArrowLeft':
        case 'a':
          querySelector('#uprev')?.click();
          break;
      }
    });
  }
};
