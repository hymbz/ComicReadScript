import { linstenKeydown, querySelector } from 'helper';

import { setEscHandler, type EhContext } from './helper';

/** 快捷键翻页 */
export const hotkeysPageTurn = (context: EhContext) => {
  if (!context.options.hotkeys) return;

  if (context.type === 'gallery') {
    setEscHandler(0, () =>
      unsafeWindow.selected_tagname ? unsafeWindow.toggle_tagmenu() : true,
    );

    linstenKeydown((e) => {
      switch (e.key) {
        case 'ArrowRight':
        case 'd':
          e.preventDefault();
          return querySelector('.ptt td:last-child:not(.ptdd)')?.click();

        case 'ArrowLeft':
        case 'a':
          e.preventDefault();
          return querySelector('.ptt td:first-child:not(.ptdd)')?.click();
      }

      // 使用上下方向键进行投票
      if (!unsafeWindow.selected_tagid) return;
      switch (e.key) {
        case 'ArrowUp':
          e.preventDefault();
          return unsafeWindow?.tag_vote_up();
        case 'ArrowDown':
          e.preventDefault();
          return unsafeWindow?.tag_vote_down();
      }
    });
  } else {
    linstenKeydown((e) => {
      switch (e.key) {
        case 'ArrowRight':
        case 'd':
          e.preventDefault();
          return querySelector('#unext')?.click();

        case 'ArrowLeft':
        case 'a':
          e.preventDefault();
          return querySelector('#uprev')?.click();
      }
    });
  }
};
