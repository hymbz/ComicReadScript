import type { Meta, StoryObj } from 'storybook-solidjs-vite';

import rfdc from 'rfdc';
import { mergeProps } from 'solid-js';

import type { RequestDetails } from 'request';

import { request } from 'request';

import type { MangaProps } from '../components/Manga';

import { Manga } from '../components/Manga';
import { initStore, refs, setState } from '../components/Manga/store';
import { defaultOption } from '../components/Manga/store/option';
import { Toaster } from '../components/Toast';
import { imgList, waitImgLoaded } from './helper';

const cloneArray = (arr: string[], count: number) =>
  Array.from<string[]>({ length: count }).fill(arr).flat();

const deepClone = rfdc({ proto: true, circles: false });

export type Props = MangaProps & {
  图源: keyof typeof imgList;
  cloneImgList?: number;
};
export type PartialProps = Partial<Props>;

window.GM_xmlhttpRequest = ((details: RequestDetails<any>) =>
  request(details.url!, { ...details, fetch: true })) as any;

const meta = {
  title: '漫画',
  parameters: { layout: 'fullscreen' },
  argTypes: {
    图源: { control: 'radio', options: Object.keys(imgList) },
    option: { control: 'object', name: '配置' },
  },
  args: {
    imgList: [],
    图源: '饮茶之时、女仆之梦（彩图）',
  } satisfies Props,
  component: Manga,
  render(props: Props) {
    return (
      <>
        <Manga
          {...mergeProps(props, {
            imgList: props.图源
              ? cloneArray(imgList[props.图源], props.cloneImgList ?? 1)
              : props.imgList,
            option: Object.assign(defaultOption(), props.option ?? {}, {
              alwaysLoadAllImg: true,
              autoScroll: { enabled: true, triggerEnd: true },
            }),
          })}
        />
        <Toaster />
      </>
    );
  },
  beforeEach() {
    setState((state) => Object.assign(state, deepClone(initStore)));
    refs.root?.scrollTo(0, 0);
  },
} satisfies Meta<Props>;

export default meta;
type Story = StoryObj<typeof meta>;

export const 翻页模式: Story = {
  args: {
    图源: '透过百合SM能否连结两人的身心呢（跨页）',
  } satisfies PartialProps,
  play: waitImgLoaded,
};

export const 卷轴模式: Story = {
  args: {
    图源: '方便的陪跑友（四格）',
    option: { scrollMode: { enabled: true, imgScale: 0.3 } },
  } satisfies PartialProps,
  play: waitImgLoaded,
};

export const 并排卷轴模式: Story = {
  args: {
    图源: '方便的陪跑友（四格）',
    option: { scrollMode: { enabled: true, abreastMode: true, imgScale: 0.3 } },
  } satisfies PartialProps,
  play: waitImgLoaded,
};

export const 双页卷轴模式: Story = {
  args: {
    图源: '若爱在眼前（跨页+小图）',
    option: { scrollMode: { enabled: true, doubleMode: true } },
  } satisfies PartialProps,
  play: waitImgLoaded,
};

export const 网格模式: Story = {
  args: {
    图源: '饮茶之时、女仆之梦（彩图）',
  } satisfies PartialProps,
  async play() {
    setState('gridMode', true);
    await waitImgLoaded();
  },
};

// export const 翻译 = {
//   args: {
//     option: { translation: { server: 'selfhosted' } },
//   } satisfies PartialProps,
//   async play() {
//     await clickSettingItem(t('setting.option.disable_auto_enlarge'));
//   },
// };
