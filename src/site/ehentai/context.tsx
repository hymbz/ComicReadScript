import { querySelector } from 'helper';
import { createMemo, type Component } from 'solid-js';
import { request, useInit } from 'main';

export const listPageTypes = [
  'm', // 最小化
  'p', // 最小化 + 关注标签
  'l', // 紧凑 + 标签
  'e', // 扩展
  't', // 缩略图;
] as const;

type ListPageType = (typeof listPageTypes)[number];

export type PageType = 'gallery' | 'mytags' | 'mpv' | ListPageType;

export type GalleryContext = {
  type: 'gallery';
  galleryId: number;
  galleryTitle: string | undefined;
  japanTitle: string | undefined;
  imgNum: number;

  imgList: string[];
  pageList: string[];
  fileNameList: string[];

  /** 放在原生右侧工具栏和标签选项里的漫画加载按钮 */
  LoadButton: Component<{
    id: string;
    onClick?: (e: MouseEvent) => unknown;
  }>;
  dom: {
    /** 标签输入框 */
    newTagField: HTMLInputElement;
  };
} & AsyncReturnType<typeof useInit>;

type OtherContext = { type: Exclude<PageType, 'gallery'> } & AsyncReturnType<
  typeof useInit
>;

export type EhContext = OtherContext | GalleryContext;

export const createEhContext = async (
  options: Record<string, any>,
): Promise<EhContext | null> => {
  let type: PageType | undefined;
  if (Reflect.has(unsafeWindow, 'display_comment_field')) type = 'gallery';
  else if (location.pathname === '/mytags') type = 'mytags';
  else if (Reflect.has(unsafeWindow, 'mpvkey')) type = 'mpv';
  else
    type = (
      querySelector('option[value="t"]')?.parentElement as HTMLSelectElement
    )?.value as Exclude<PageType, 'gallery'> | undefined;

  if (!type) return null;
  const fnMap = await useInit('ehentai', options);

  if (type !== 'gallery') return { type, ...fnMap };

  let imgNum = 0;
  imgNum = Number(
    querySelector('.gtb .gpc')
      ?.textContent?.replaceAll(',', '')
      .match(/\d+/g)
      ?.at(-1),
  );
  if (Number.isNaN(imgNum)) {
    imgNum = Number(
      /(?<=<td class="gdt2">)\d+(?= pages<\/td>)/.exec(
        (await request(window.location.href)).responseText,
      )?.[0],
    );
  }

  return {
    type: 'gallery',
    ...fnMap,
    galleryId: Number(location.pathname.split('/')[2]),
    galleryTitle: querySelector('#gn')?.textContent || undefined,
    japanTitle: querySelector('#gj')?.textContent || undefined,
    imgNum,

    imgList: [],
    pageList: [],
    fileNameList: [],

    LoadButton(props) {
      const tip = createMemo(() => {
        const _imgList = fnMap.comicMap[props.id]?.imgList;
        const progress = _imgList?.filter(Boolean).length;

        switch (_imgList?.length) {
          case undefined:
            return ' Load comic';
          case progress:
            return ' Read';
          default:
            return ` loading - ${progress}/${_imgList!.length}`;
        }
      });
      return (
        <a
          href="javascript:;"
          onClick={async (e) => {
            await props.onClick?.(e);
            fnMap.showComic(props.id);
          }}
          children={tip()}
        />
      );
    },
    dom: {
      newTagField: document.getElementById('newtagfield') as HTMLInputElement,
    },
  };
};
