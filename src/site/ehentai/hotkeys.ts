import { hotkeysMap } from 'components/Manga';
import { getKeyboardCode, linstenKeydown, querySelector } from 'helper';

import type { EhContext } from './helper';

import { escHandler } from './helper';

export const addHotkeysActions = (context: EhContext) => {
  if (!context.options.add_hotkeys_actions) return;

  if (context.type === 'gallery') {
    escHandler.set('取消选中当前标签', () =>
      unsafeWindow.selected_tagname ? unsafeWindow.toggle_tagmenu() : true,
    );

    linstenKeydown((e) => {
      // 使用上下方向键进行投票
      if (unsafeWindow.selected_tagid) {
        switch (e.key) {
          case 'ArrowUp':
            e.preventDefault();
            return unsafeWindow?.tag_vote_up();
          case 'ArrowDown':
            e.preventDefault();
            return unsafeWindow?.tag_vote_down();
        }
      }

      switch (hotkeysMap()[getKeyboardCode(e)]) {
        case 'scroll_right':
          e.preventDefault();
          return querySelector('.ptt td:last-child:not(.ptdd)')?.click();
        case 'scroll_left':
          e.preventDefault();
          return querySelector('.ptt td:first-child:not(.ptdd)')?.click();
      }
    });
  } else {
    linstenKeydown((e) => {
      switch (hotkeysMap()[getKeyboardCode(e)]) {
        case 'scroll_right':
          e.preventDefault();
          return querySelector('#unext')?.click();
        case 'scroll_left':
          e.preventDefault();
          return querySelector('#uprev')?.click();
      }
    });
  }
};
