import AutoStories from '@material-design-icons/svg/round/auto_stories.svg';

import { IconBotton } from '@crs/ui-component/dist/IconBotton';
import type { MangaProps } from '@crs/ui-component/dist/Manga';
import { useManga, useFab, useToast } from '../components';
import { querySelectorClick, useSiteOptions } from '../helper';

declare const pVars: { manga: { filePath: string } };
declare const cInfo: { nextId: number; prevId: number };

(async () => {
  // 只在漫画页内运行
  if (!Reflect.has(unsafeWindow, 'cInfo')) return;

  const { options, setOptions } = await useSiteOptions('manhuagui', {
    option: undefined as MangaProps['option'] | undefined,
    autoLoad: false,
  });

  const [showFab] = useFab({
    tip: '阅读模式',
    progress: 1,
    speedDial: [
      () => (
        <IconBotton
          tip="自动加载"
          placement="left"
          enabled={options.autoLoad}
          onClick={() =>
            setOptions({ ...options, autoLoad: !options.autoLoad })
          }
        >
          <AutoStories />
        </IconBotton>
      ),
    ],
  });

  const toast = useToast();

  let imgList: string[] = [];
  const [showManga] = useManga({
    imgList,
    onOptionChange: (option) => setOptions({ ...options, option }),
    onNext: cInfo.nextId !== 0 ? querySelectorClick('a.nextC') : null,
    onPrev: cInfo.prevId !== 0 ? querySelectorClick('a.prevC') : null,
  });

  const showComic = () => {
    if (imgList.length === 0) {
      try {
        const comicInfo = JSON.parse(
          // 只能通过 eval 获得数据
          // eslint-disable-next-line no-eval
          eval(
            document.querySelectorAll('body > script')[1].innerHTML.slice(26),
          ).slice(12, -12),
        );
        const sl = Object.entries(comicInfo.sl)
          .map((attr) => `${attr[0]}=${attr[1]}`)
          .join('&');
        imgList = comicInfo.files.map(
          (file) => `${pVars.manga.filePath}${file}?${sl}`,
        );
        if (imgList.length === 0) throw new Error('获取漫画图片失败');
      } catch (e) {
        console.error(e);
        toast('获取漫画图片失败', { type: 'error' });
      }
    }

    showManga((draftProps) => {
      draftProps.imgList = imgList;
    });
  };
  showFab((draftProps) => {
    draftProps.onClick = showComic;
  });

  if (options.autoLoad) showComic();
})();
