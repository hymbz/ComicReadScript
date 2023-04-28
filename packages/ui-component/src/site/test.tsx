import { useFab } from '../main';

(async () => {
  unsafeWindow.setFab = await useFab({
    tip: '阅读模式',
  });
  unsafeWindow.setFab();
})();
