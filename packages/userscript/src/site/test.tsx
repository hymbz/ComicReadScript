import { useFab } from '../helper';

(async () => {
  unsafeWindow.setFab = await useFab({
    tip: '阅读模式',
  });
  unsafeWindow.setFab();
})();
