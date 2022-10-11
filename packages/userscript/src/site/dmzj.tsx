import { showComicReadWindow } from '../components/ComicReadWindow';
import { useFab } from '../components/Fab';

// eslint-disable-next-line @typescript-eslint/require-await
(async () => {
  const [showFab, setFab] = useFab({
    onClick: () => {
      showComicReadWindow(
        [...document.querySelectorAll('.inner_img img')].map(
          (i) => i.getAttribute('data-original')!,
        ),
      );
    },
  });

  showFab();
})();
