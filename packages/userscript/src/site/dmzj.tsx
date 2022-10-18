import { useManga, useFab } from '../components';

// eslint-disable-next-line @typescript-eslint/require-await
(async () => {
  const [showManga] = useManga();

  const [showFab] = useFab({
    onClick: () => {
      showManga((draftProps) => {
        draftProps.imgList = [
          ...document.querySelectorAll('.inner_img img'),
        ].map((i) => i.getAttribute('data-original')!);
      });
    },
  });

  showFab();
})();
