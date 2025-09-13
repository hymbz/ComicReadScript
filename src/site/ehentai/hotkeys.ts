import { listenHotkey } from 'components/Manga';
import { querySelector } from 'helper';

import type { EhContext } from './helper';

import { escHandler } from './helper';

export const addHotkeysActions = (context: EhContext) => {
  if (!context.options.add_hotkeys_actions) return;

  if (context.type === 'gallery') {
    escHandler.set('取消选中当前标签', () =>
      unsafeWindow.selected_tagname ? unsafeWindow.toggle_tagmenu() : true,
    );

    listenHotkey({
      // 使用上下方向键进行投票
      ArrowUp: () => unsafeWindow.selected_tagid && unsafeWindow?.tag_vote_up(),
      ArrowDown: () =>
        unsafeWindow.selected_tagid && unsafeWindow?.tag_vote_down(),

      scroll_right: () =>
        querySelector('.ptt td:last-child:not(.ptdd)')?.click(),
      scroll_left: () =>
        querySelector('.ptt td:first-child:not(.ptdd)')?.click(),
    });
  } else {
    listenHotkey({
      scroll_right: () => querySelector('#unext')?.click(),
      scroll_left: () => querySelector('#uprev')?.click(),
    });
  }
};
