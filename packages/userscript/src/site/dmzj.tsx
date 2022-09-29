import { showFab, showComicReadWindow } from '../helper/components';

showFab(() => {
  showComicReadWindow(
    [...document.querySelectorAll('.inner_img img')].map(
      (i) => i.getAttribute('data-original')!,
    ),
  );
});
