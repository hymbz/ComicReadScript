import { showFAB, showComicReadWindow } from '../helper/components';

showFAB(() => {
  showComicReadWindow(
    [...document.querySelectorAll('.inner_img img')].map(
      (i) => i.getAttribute('data-original')!,
    ),
  );
});
