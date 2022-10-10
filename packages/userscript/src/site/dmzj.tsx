import { showComicReadWindow } from '../components/ComicReadWindow';
import { showFab } from '../components/Fab';

showFab(() => {
  showComicReadWindow(
    [...document.querySelectorAll('.inner_img img')].map(
      (i) => i.getAttribute('data-original')!,
    ),
  );
});
